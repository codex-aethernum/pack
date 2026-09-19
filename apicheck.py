"""Проверка сигнатур: мод зовёт метод/конструктор/поле соседнего мода,
которого в установленной версии уже нет ИЛИ у которого изменилась сигнатура.

Именно так падают:
  PneumaticCraft -> Cold Sweat   NoSuchMethodError: BlockTemp.<init>(DDDDDZZ[LBlock;)V
  Mek Energistics -> MoreMachine  поле inputSlot сменило тип
classcheck.py это пропускает: класс-то на месте.

Две фазы:
  1. читаем constant pool всех классов, собираем ссылки на члены классов,
     которые принадлежат ДРУГОМУ установленному моду
  2. разбираем таблицы методов/полей только у этих классов-целей
     и проверяем, что нужный член с нужным дескриптором существует
     (с обходом вверх по цепочке суперклассов)

Цель вне установленных модов (Minecraft, JDK) не проверяется — судить не по чему.
"""
import glob, io, os, struct, sys, zipfile
from collections import defaultdict

MODS = sys.argv[1]
HEAD = 160 * 1024
SKIP = ("java/", "javax/", "jdk/", "sun/", "net/minecraft/", "com/mojang/",
        "net/neoforged/", "org/", "com/google/", "io/netty/", "kotlin/",
        "it/unimi/", "com/electronwill/", "cpw/mods/", "net/minecraftforge/",
        "joptsimple/", "com/ibm/")


def parse_pool(d):
    """-> (utf, classes, nameandtype, refs, pos_after_pool) или None"""
    if len(d) < 10 or d[:4] != b"\xca\xfe\xba\xbe":
        return None
    count = struct.unpack_from(">H", d, 8)[0]
    utf, cls, nat, refs = {}, {}, {}, []
    i, pos, n = 1, 10, len(d)
    while i < count:
        if pos >= n:
            return None
        tag = d[pos]; pos += 1
        if tag == 1:
            ln = struct.unpack_from(">H", d, pos)[0]; pos += 2
            if pos + ln > n:
                return None
            utf[i] = d[pos:pos + ln]; pos += ln
        elif tag == 7:
            cls[i] = struct.unpack_from(">H", d, pos)[0]; pos += 2
        elif tag == 12:
            nat[i] = struct.unpack_from(">HH", d, pos); pos += 4
        elif tag in (9, 10, 11):
            refs.append((tag,) + struct.unpack_from(">HH", d, pos)); pos += 4
        elif tag in (3, 4, 17, 18):
            pos += 4
        elif tag in (8, 16, 19, 20):
            pos += 2
        elif tag == 15:
            pos += 3
        elif tag in (5, 6):
            pos += 8; i += 1
        else:
            return None
        i += 1
    return utf, cls, nat, refs, pos


def s(utf, idx):
    b = utf.get(idx)
    if b is None:
        return None
    try:
        return b.decode("utf-8")
    except UnicodeDecodeError:
        return None


def members_of(d):
    """Разбирает таблицы полей и методов. -> (super_name, {(name,desc,is_field)})"""
    p = parse_pool(d)
    if not p:
        return None, set()
    utf, cls, nat, _, pos = p
    pos += 2                                   # access_flags
    pos += 2                                   # this_class
    sup_i = struct.unpack_from(">H", d, pos)[0]; pos += 2
    sup = s(utf, cls.get(sup_i)) if sup_i else None
    ic = struct.unpack_from(">H", d, pos)[0]; pos += 2 + ic * 2
    out = set()
    for is_field in (True, False):
        cnt = struct.unpack_from(">H", d, pos)[0]; pos += 2
        for _ in range(cnt):
            pos += 2
            ni, di = struct.unpack_from(">HH", d, pos); pos += 4
            out.add((s(utf, ni), s(utf, di), is_field))
            ac = struct.unpack_from(">H", d, pos)[0]; pos += 2
            for _ in range(ac):
                pos += 2
                ln = struct.unpack_from(">I", d, pos)[0]; pos += 4 + ln
    return sup, out


# ---- фаза 0: где какой класс лежит -----------------------------------------
jars = sorted(glob.glob(os.path.join(MODS, "*.jar")))
loc = {}            # класс -> (jar, zipfile, entry)
owner_pkg = defaultdict(set)
zips = {}
print(f"индексирую {len(jars)} джарников...", flush=True)


def walk(z, base, depth=0):
    for nm in z.namelist():
        if nm.endswith(".class"):
            c = nm[:-6]
            loc.setdefault(c, (base, z, nm))
            parts = c.split("/")
            if len(parts) >= 3 and not c.startswith(SKIP):
                owner_pkg["/".join(parts[:3])].add(base)
        elif depth == 0 and nm.endswith(".jar") and nm.startswith("META-INF/"):
            try:
                walk(zipfile.ZipFile(io.BytesIO(z.read(nm))), base, depth + 1)
            except Exception:
                pass


for j in jars:
    try:
        z = zipfile.ZipFile(j)
    except Exception:
        continue
    zips[os.path.basename(j)] = z
    walk(z, os.path.basename(j))

sole = {p: next(iter(v)) for p, v in owner_pkg.items() if len(v) == 1}
print(f"классов: {len(loc)}, однозначных пакетов: {len(sole)}\n", flush=True)

# ---- фаза 1: межмодовые ссылки на члены ------------------------------------
wanted = defaultdict(set)      # целевой класс -> {(name, desc, is_field, откуда)}
for base, z, entry in set((v[0], v[1], v[2]) for v in loc.values()):
    pass  # заглушка, реальный обход ниже

for c, (base, z, entry) in loc.items():
    if c.startswith(SKIP):
        continue
    try:
        with z.open(entry) as fh:
            d = fh.read(HEAD)
    except Exception:
        continue
    p = parse_pool(d)
    if not p:
        continue
    utf, cls, nat, refs, _ = p
    for tag, ci, ni in refs:
        owner = s(utf, cls.get(ci))
        if not owner or owner.startswith("[") or owner.startswith(SKIP):
            continue
        tgt = loc.get(owner)
        if not tgt or tgt[0] == base:
            continue
        pkg = "/".join(owner.split("/")[:3])
        if sole.get(pkg) != tgt[0]:
            continue
        nd = nat.get(ni)
        if not nd:
            continue
        name, desc = s(utf, nd[0]), s(utf, nd[1])
        if name and desc:
            wanted[owner].add((name, desc, tag == 9, base))

print(f"классов-целей для проверки: {len(wanted)}", flush=True)

# ---- фаза 2: проверяем наличие членов --------------------------------------
cache = {}


def has_member(cname, name, desc, is_field, depth=0):
    if depth > 12:
        return True
    if cname not in loc:
        return True                 # цель вне модов — судить не по чему
    if cname not in cache:
        base, z, entry = loc[cname]
        try:
            cache[cname] = members_of(z.read(entry))
        except Exception:
            cache[cname] = (None, None)
    sup, mem = cache[cname]
    if mem is None:
        return True
    if (name, desc, is_field) in mem:
        return True
    if sup:
        return has_member(sup, name, desc, is_field, depth + 1)
    return False


problems = defaultdict(list)
for owner, items in wanted.items():
    for name, desc, is_field, src in items:
        if not has_member(owner, name, desc, is_field):
            problems[src].append((owner, name, desc, is_field, loc[owner][0]))

print("\n=== ВЫЗОВЫ ОТСУТСТВУЮЩИХ МЕТОДОВ/ПОЛЕЙ СОСЕДЕЙ ===")
if not problems:
    print("  нет")
for src in sorted(problems, key=lambda k: -len(problems[k])):
    items = sorted(problems[src])
    print(f"\n  {src}  ({len(items)})")
    for owner, name, desc, is_field, tgt in items[:6]:
        kind = "поле" if is_field else "метод"
        print(f"      {kind} {owner.replace('/', '.')}.{name}  {desc}")
        print(f"        -> нет в {tgt}")
    if len(items) > 6:
        print(f"      ... и ещё {len(items) - 6}")
