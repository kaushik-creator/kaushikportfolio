#!/usr/bin/env python3
"""Crop new About photos to matching 900x900 B&W JPEGs.
Usage:
  python3 about/process-photos.py input1.jpg input2.png ...
Outputs about/photos/about-NN.jpg continuing the sequence.
"""
from PIL import Image
from pathlib import Path
import sys

OUT = Path(__file__).parent / 'photos'
OUT.mkdir(exist_ok=True)
SIZE = 900

existing = sorted(OUT.glob('about-*.jpg'))
n = 1
if existing:
    n = int(existing[-1].stem.split('-')[1]) + 1

def square_crop(im):
    w, h = im.size
    side = min(w, h)
    left = (w - side) // 2
    top = (h - side) // 2
    return im.crop((left, top, left + side, top + side))

for path in map(Path, sys.argv[1:]):
    im = Image.open(path).convert('RGB')
    im = square_crop(im).resize((SIZE, SIZE), Image.Resampling.LANCZOS)
    im = im.convert('L').convert('RGB')
    out = OUT / f'about-{n:02d}.jpg'
    im.save(out, 'JPEG', quality=88, optimize=True)
    print('wrote', out)
    n += 1
