#!/usr/bin/env python3
"""
Scan HTML/CSS/JS for referenced image files and optionally copy them
into a normalized `images/` directory.

This is the original script used during maintenance. It defaults to a dry-run
and only copies when called with `--apply`.
"""
import re
import sys
import os
import shutil
from pathlib import Path

apply_changes = '--apply' in sys.argv

root = Path(__file__).parent
os.chdir(root)

pattern = re.compile(r'src\s*=\s*"([^"]+)"|url\(([^)]+)\)', re.IGNORECASE)

refs = {}
for p in root.rglob('*.html'):
    text = p.read_text(encoding='utf-8', errors='ignore')
    for m in pattern.finditer(text):
        ref = m.group(1) or m.group(2)
        if not ref:
            continue
        ref = ref.strip().strip('"').strip("'")
        if ref.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg')):
            refs.setdefault(ref, []).append(str(p))

for p in root.rglob('*.css'):
    text = p.read_text(encoding='utf-8', errors='ignore')
    for m in pattern.finditer(text):
        ref = m.group(1) or m.group(2)
        if not ref:
            continue
        ref = ref.strip().strip('"').strip("'")
        if ref.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg')):
            refs.setdefault(ref, []).append(str(p))

dest = root / 'images'
if apply_changes and not dest.exists():
    dest.mkdir(parents=True, exist_ok=True)

report = []
for ref, sources in refs.items():
    basename = Path(ref).name
    norm = re.sub(r'[^0-9a-zA-Z.]+', '-', basename).strip('-').lower()
    destpath = dest / norm
    # locate source file in repo
    found = None
    # try direct path
    candidate = root / ref
    if candidate.exists():
        found = candidate
    else:
        # search for file by basename
        for p in root.rglob(basename):
            if p.is_file():
                found = p
                break
    report.append((ref, norm, str(found) if found else None, sources))
    if apply_changes and found:
        try:
            shutil.copy2(found, destpath)
        except Exception as e:
            print('copy error', found, destpath, e)

for r in report:
    ref, norm, src, sources = r
    if src:
        print(f'FOUND: {ref} -> {norm} from {src} (used in {len(sources)} files)')
    else:
        print(f'NOT FOUND: {ref} -> {norm} (used in {len(sources)} files)')

if not apply_changes:
    print('\nDry-run complete. Run with --apply to copy files into images/')
else:
    print('\nApply complete. Copied available files into images/')
