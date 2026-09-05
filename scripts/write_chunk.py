import sys, os, base64

if len(sys.argv) < 4:
    print('Usage: write_chunk.py <path> <w|a> <b64>')
    sys.exit(1)

path, mode, b64_str = sys.argv[1], sys.argv[2], sys.argv[3].strip()
if len(b64_str) % 4 == 1:
    b64_str = b64_str[:-1]

rem = len(b64_str) % 4
if rem > 0:
    b64_str += '=' * (4 - rem)

content = base64.b64decode(b64_str.encode('ascii')).decode('utf-8', errors='ignore')
os.makedirs(os.path.dirname(path), exist_ok=True)
with open(path, mode, encoding='utf-8') as f:
    f.write(content)
print(f'{mode} -> {path} (+{len(content)} chars)')
