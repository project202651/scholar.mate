# -*- coding: utf-8 -*
import os, base64

def save(path, str_content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(str_content.strip() + '\n')
    print(f'Written: {path}')

print('Script writer ready')
