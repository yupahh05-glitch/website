#!/usr/bin/env python3
"""
Lightweight navbar updater.

Dry-run by default. Use --apply to write files.
"""
import os
import sys
import glob

apply_changes = '--apply' in sys.argv

root = os.path.dirname(__file__)
os.chdir(root)

files = glob.glob('**/*.html', recursive=True)

target = '<a href="admissions/index.html">Admissions</a>'

updated = []
for f in files:
    try:
        if f.startswith('Our team') or '/scripts/' in f.replace('\\', '/'):
            continue
        with open(f, 'r', encoding='utf-8') as fh:
            s = fh.read()
        if 'Admissions' in s and 'admissions' in s:
            continue
        # naive insertion: add Admissions to first <nav> or near first set of links
        if '<nav' in s:
            new = s.replace('</nav>', '    <a href="admissions/index.html">Admissions</a>\n</nav>', 1)
            if new != s:
                updated.append(f)
                if apply_changes:
                    with open(f, 'w', encoding='utf-8') as fh:
                        fh.write(new)
        else:
            # fallback: add link to header if present
            if '<header' in s:
                new = s.replace('</header>', '    <a href="admissions/index.html">Admissions</a>\n</header>', 1)
                if new != s:
                    updated.append(f)
                    if apply_changes:
                        with open(f, 'w', encoding='utf-8') as fh:
                            fh.write(new)
    except Exception as e:
        print('err', f, e)

print('Files updated (or would):', len(updated))
if not apply_changes:
    print('Dry-run; run with --apply')
