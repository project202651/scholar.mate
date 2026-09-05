# -*- coding: utf-8 -*-
import sys, os, base64

if len(sys.argv) < 2:
    print('Usage: python write_file_b64.py <target_path>')
    sys.exit(1)

target = sys.argv[1]
data = sys.stdin.read().strip()
decoded = base64.b64decode(data.encode('ascii')).decode('utf-8')

os.makedirs(os.path.dirname(target), exist_ok=True)
with open(target, 'w', encoding='utf-8') as f:
    f.write(decoded)

print(f'Successfully written: {target} ({len(decoded)} chars)')
