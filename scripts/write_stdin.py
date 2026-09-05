import sys, os

if len(sys.argv) < 3:
    print('Usage: write_stdin.py <path> <w|a>')
    sys.exit(1)

path, mode = sys.argv[1], sys.argv[2]
content = sys.stdin.read()

os.makedirs(os.path.dirname(path), exist_ok=True)
with open(path, mode, encoding='utf-8') as f:
    f.write(content)
print(f'{mode} -> {path} (+{len(content)} chars)')
