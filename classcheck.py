"""Поиск необъявленных несовместимостей: мод ссылается на класс соседнего мода,
которого в установленной версии уже нет.

Именно так падают Compat Delight (FD убрал ShepherdsPieBlock) и
Create: Relics plus (Relics переехал WearableRelicItem) — объявленные
диапазоны версий при этом в полном порядке.

Логика:
  1. собираем ВСЕ доступные классы (включая вложенные jar) -> available
  2. определяем, какому моду принадлежит какой пакет (по 2-3 сегментам)
  3. для каждого мода читаем constant pool его классов и берём CONSTANT_Class
  4. ссылка подозрительна, если пакет принадлежит ДРУГОМУ установленному моду,
     а самого класса нет: значит сосед его удалил или переименовал

Ссылки в пакеты отсутствующих модов пропускаем — это обычные мягкие
зависимости под `mod_loaded`, они не падают.
"""
import glob, io, os, struct, sys, zipfile
from collections import defaultdict

MODS = sys.argv[1]
HEAD = 96 * 1024          # constant pool лежит в начале файла
SKIP_PREFIX = ("java/", "javax/", "jdk/", "sun/", "net/minecraft/", "com/mojang/",
               "net/neoforged/", "org/", "com/google/", "io/netty/", "kotlin/",
               "it/unimi/", "com/electronwill/", "cpw/mods/", "net/minecraftforge/")


def class_refs(data):
    """Имена классов из constant pool. Возвращает None, если пул не поместился."""
    if len(data) < 10 or data[:4] != b"\xca\xfe\xba\xbe":
        return None
    count = struct.unpack_from(">H", data, 8)[0]
    utf, cls, i, pos = {}, [], 1, 10
    n = len(data)
    while i < count:
        if pos >= n:
            return None
        tag = data[pos]
        pos += 1
        if tag == 1:
            if pos + 2 > n:
                return None
            ln = struct.unpack_from(">H", data, pos)[0]
            pos += 2
            if pos + ln > n:
                return None
            utf[i] = data[pos:pos + ln]
            pos += ln
        elif tag == 7:
            cls.append(struct.unpack_from(">H", data, pos)[0])
            pos += 2
        elif tag in (8, 16, 19, 20):
            pos += 2
        elif tag == 15:
            pos += 3
        elif tag in (3, 4, 9, 10, 11, 12, 17, 18):
            pos += 4
        elif tag in (5, 6):
            pos += 8
            i += 1
        else:
            return None
        i += 1
    out = []
    for ci in cls:
        b = utf.get(ci)
        if b:
            try:
                out.append(b.decode("utf-8"))
            except UnicodeDecodeError:
                pass
    return out


def iter_class_entries(z, depth=0):
    """(имя класса, zipfile, entry) по jar и его вложенным jar."""
    for n in z.namelist():
        if n.endswith(".class"):
            yield n[:-6], z, n
        elif depth == 0 and n.endswith(".jar") and n.startswith("META-INF/"):
            try:
                inner = zipfile.ZipFile(io.BytesIO(z.read(n)))
            except Exception:
                continue
            for t in iter_class_entries(inner, depth + 1):
                yield t


jars = sorted(glob.glob(os.path.join(MODS, "*.jar")))
available = set()
owner = {}                      # пакет (3 сегмента) -> {jar}
per_jar_classes = {}

print(f"сканирую {len(jars)} джарников...", flush=True)
for j in jars:
    base = os.path.basename(j)
    try:
        z = zipfile.ZipFile(j)
    except Exception:
        continue
    names = []
    for cname, zz, entry in iter_class_entries(z):
        available.add(cname)
        names.append((cname, zz, entry))
        parts = cname.split("/")
        if len(parts) >= 3 and not cname.startswith(SKIP_PREFIX):
            owner.setdefault("/".join(parts[:3]), set()).add(base)
    per_jar_classes[base] = names

# пакеты, принадлежащие ровно одному моду — по ним судим об "owner"
sole = {p: next(iter(s)) for p, s in owner.items() if len(s) == 1}

print(f"классов всего: {len(available)},  однозначных пакетов: {len(sole)}\n", flush=True)

problems = defaultdict(set)
for base, names in per_jar_classes.items():
    seen = set()
    for cname, zz, entry in names:
        try:
            with zz.open(entry) as fh:
                data = fh.read(HEAD)
        except Exception:
            continue
        refs = class_refs(data)
        if refs is None:
            continue
        for r in refs:
            if r in seen or r.startswith("[") or r.startswith(SKIP_PREFIX):
                continue
            seen.add(r)
            if r in available:
                continue
            parts = r.split("/")
            if len(parts) < 3:
                continue
            pkg = "/".join(parts[:3])
            own = sole.get(pkg)
            if own and own != base:
                problems[base].add((r.replace("/", "."), own))

print("=== ССЫЛКИ НА ИСЧЕЗНУВШИЕ КЛАССЫ СОСЕДЕЙ ===")
if not problems:
    print("  нет")
for base in sorted(problems, key=lambda b: -len(problems[b])):
    items = sorted(problems[base])
    print(f"\n  {base}  ({len(items)})")
    for cls, own in items[:6]:
        print(f"      {cls}\n        -> пакет принадлежит {own}")
    if len(items) > 6:
        print(f"      ... и ещё {len(items) - 6}")
