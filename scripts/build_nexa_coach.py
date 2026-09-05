# -*- coding: utf-8 -*
import os

def save(path, text):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(text.strip() + '\n')
    print(f'Generated: {path} (+{len(text)} chars)')
