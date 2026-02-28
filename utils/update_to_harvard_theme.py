"""Small helper to inject Harvard-style navbar into HTML files.

Dry-run by default; use --apply to persist changes.
"""
import sys
import glob
import os

apply_changes = '--apply' in sys.argv

root = os.path.dirname(__file__)
os.chdir(root)

files = glob.glob('*.html')

snippet = '<!-- HARVARD NAV -->\n<li><a href="admissions/index.html">Admissions</a></li>\n<!-- END HARVARD NAV -->'

changed = []
for f in files:
    if f == 'index.html':
        continue
    try:
        with open(f, 'r', encoding='utf-8') as fh:
            s = fh.read()
        if 'HARVARD NAV' in s:
            continue
        if '</ul>' in s:
            new = s.replace('</ul>', snippet + '\n</ul>', 1)
            if new != s:
                changed.append(f)
                if apply_changes:
                    with open(f, 'w', encoding='utf-8') as fh:
                        fh.write(new)
    except Exception:
        pass

print('Done. changed:', len(changed))
if not apply_changes:
    print('Dry-run; run with --apply to apply')
