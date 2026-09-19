"""Предполётная проверка папки mods: ловит то, на чём NeoForge падает при запуске.

1. mods.toml без modLoader/loaderVersion -> "is not a valid mod file"
2. нарушенные versionRange у зависимостей (включая optional: если мод есть,
   диапазон обязан выполняться)
"""
import glob, io, os, re, sys, zipfile

MODS = sys.argv[1]
BUILTIN = {"minecraft", "java", "fml", "mcp"}
MC_VERSION = "1.21.1"
NEOFORGE_VERSION = "21.1.251"


def ver_key(s):
    """Версия -> кортеж чисел; нечисловые хвосты отбрасываем."""
    parts = re.split(r'[.\-+]', norm(s))
    out = []
    for p in parts:
        m = re.match(r'^(\d+)', p)
        if m:
            out.append(int(m.group(1)))
        else:
            break
    return tuple(out) or (0,)


def cmp_ver(a, b):
    ka, kb = ver_key(a), ver_key(b)
    n = max(len(ka), len(kb))
    ka += (0,) * (n - len(ka))
    kb += (0,) * (n - len(kb))
    return (ka > kb) - (ka < kb)


def in_range(version, rng):
    """Maven-диапазон: [a,b) (a,b] [a,] и т.п. Возвращает None, если не разобрали."""
    rng = (rng or "").strip()
    if not rng or rng == "*":
        return True
    if not (rng[0] in "[(" and rng[-1] in "])"):
        return None
    lo_inc, hi_inc = rng[0] == "[", rng[-1] == "]"
    body = rng[1:-1]
    if "," not in body:
        return cmp_ver(version, body) == 0
    lo, hi = body.split(",", 1)
    lo, hi = lo.strip(), hi.strip()
    if lo:
        c = cmp_ver(version, lo)
        if c < 0 or (c == 0 and not lo_inc):
            return False
    if hi:
        c = cmp_ver(version, hi)
        if c > 0 or (c == 0 and not hi_inc):
            return False
    return True


def manifest_version(z):
    try:
        mf = z.read("META-INF/MANIFEST.MF") if "META-INF/MANIFEST.MF" in z.namelist()             else z.read("META-INF/MANIFEST.mf")
        m = re.search(r'Implementation-Version:\s*(\S+)', mf.decode("utf-8", "replace"))
        return m.group(1) if m else None
    except Exception:
        return None


def norm(v):
    """Отрезает приписанную спереди версию Minecraft: 1.21-3.6.4 -> 3.6.4"""
    m = re.match(r'^1\.(?:1[6-9]|2\d)(?:\.\d+)?[-_](\d.*)$', v.strip())
    return m.group(1) if m else v.strip()


def read_toml(z):
    for n in ("META-INF/neoforge.mods.toml", "META-INF/mods.toml"):
        if n in z.namelist():
            return n, z.read(n).decode("utf-8", "replace")
    return None, None


present = {"minecraft": MC_VERSION, "neoforge": NEOFORGE_VERSION,
           "forge": NEOFORGE_VERSION}
deps = []
invalid = []

jars = sorted(glob.glob(os.path.join(MODS, "*.jar")))


def scan(z, jar, nested=False):
    name, t = read_toml(z)
    if t:
        if not nested and not re.search(r'^\s*modLoader\s*=', t, re.M):
            invalid.append((jar, "нет modLoader= в " + name))
        if not nested and not re.search(r'^\s*loaderVersion\s*=', t, re.M):
            invalid.append((jar, "нет loaderVersion= в " + name))
        for m in re.finditer(r'\[\[mods\]\](.*?)(?=^\[\[|\Z)', t, re.S | re.M):
            mid = re.search(r'^\s*modId\s*=\s*"([^"]+)"', m.group(1), re.M)
            ver = re.search(r'^\s*version\s*=\s*"([^"]+)"', m.group(1), re.M)
            if mid:
                v = ver.group(1) if ver else "0"
                if v.startswith("$"):
                    v = manifest_version(z) or "0"
                present.setdefault(mid.group(1), v)
        if not nested:
            for m in re.finditer(
                    r'\[\[dependencies\.([A-Za-z0-9_\-]+)\]\](.*?)(?=^\[\[|\Z)',
                    t, re.S | re.M):
                b = m.group(2)
                dep = re.search(r'^\s*modId\s*=\s*"([^"]+)"', b, re.M)
                rng = re.search(r'^\s*versionRange\s*=\s*"([^"]+)"', b, re.M)
                typ = re.search(r'^\s*type\s*=\s*"([^"]+)"', b, re.M | re.I)
                man = re.search(r'^\s*mandatory\s*=\s*(true|false)', b, re.M)
                if not dep:
                    continue
                kind = typ.group(1).lower() if typ else (
                    "required" if (not man or man.group(1) == "true") else "optional")
                deps.append((m.group(1), dep.group(1),
                             rng.group(1) if rng else "", kind, jar))
    for x in z.namelist():
        if x.endswith(".jar") and (x.startswith("META-INF/jarjar/")
                                   or x.startswith("META-INF/jars/")):
            try:
                scan(zipfile.ZipFile(io.BytesIO(z.read(x))), jar, True)
            except Exception:
                pass


for j in jars:
    try:
        scan(zipfile.ZipFile(j), os.path.basename(j))
    except Exception as e:
        invalid.append((os.path.basename(j), f"не читается: {e}"))

print(f"джарников: {len(jars)}   модидов: {len(present)}\n")

print("=== 1. НЕВАЛИДНЫЕ ФАЙЛЫ МОДОВ ===")
print("  нет" if not invalid else "")
for jar, why in invalid:
    print(f"  {jar}\n      {why}")

print("\n=== 2. НАРУШЕННЫЕ ДИАПАЗОНЫ ВЕРСИЙ ===")
bad = []
conflicts = []
for parent, dep, rng, kind, jar in deps:
    if dep in BUILTIN:
        continue
    if dep not in present:
        if kind == "required":
            bad.append(f"  {parent:22s} требует {dep} — МОДА НЕТ   [{jar}]")
        continue
    inside = in_range(present[dep], rng)
    if kind in ("incompatible", "discouraged"):
        if inside is True:
            conflicts.append(f"  {parent:22s} НЕСОВМЕСТИМ с {dep} {rng}, "
                             f"установлен {present[dep]}   [{jar}]")
    elif inside is False:
        bad.append(f"  {parent:22s} требует {dep} {rng}, "
                   f"установлен {present[dep]}   [{jar}]")
print("  нет" if not bad else "")
for b in bad:
    print(b)

print(f"\nитог: невалидных файлов {len(invalid)}, нарушенных диапазонов {len(bad)}")
