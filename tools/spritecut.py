# 사용: py -3 spritecut.py <흰 배경 png> <img 키> [top bottom]  흰 배경을 지우고 747x1000 인물 그림으로(다른 인물과 같은 높이)
import os, sys, numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage
I = os.path.join(os.path.expanduser('~'), 'anne-map', 'img'); SP = os.path.dirname(os.path.abspath(__file__))
im = Image.open(sys.argv[1]).convert('RGB'); a = np.asarray(im).astype(int)
white = (a.min(2) > 232) & ((a.max(2) - a.min(2)) < 18)
lab, n = ndimage.label(white)
edge = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
bg = np.isin(lab, list(edge))
fg = ~bg; fg = ndimage.binary_opening(fg, iterations=2)
lab2, n2 = ndimage.label(fg); sz = ndimage.sum(fg, lab2, range(1, n2 + 1)); fg = lab2 == (np.argmax(sz) + 1)
fg = ndimage.binary_fill_holes(fg)
al = Image.fromarray((fg * 255).astype('uint8')).filter(ImageFilter.GaussianBlur(1.2))
t = im.convert('RGBA'); t.putalpha(al); t = t.crop(al.getbbox())
top, bot = (int(sys.argv[3]), int(sys.argv[4])) if len(sys.argv) > 4 else (57, 960)
h = bot - top; w = round(t.width * h / t.height); t = t.resize((w, h), Image.LANCZOS)
out = Image.new('RGBA', (747, 1000), (0, 0, 0, 0)); out.paste(t, ((747 - w) // 2, top), t)
out.save(os.path.join(I, sys.argv[2] + '.webp'), quality=90)
pv = Image.new('RGB', (747, 1000), (200, 220, 200)); pv.paste(out, (0, 0), out); pv.resize((374, 500)).save(os.path.join(SP, 'v_' + sys.argv[2] + '.jpg'))
print('ok', w, h)
