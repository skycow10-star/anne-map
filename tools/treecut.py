# 나무 스티커 시트(4줄x3) -> trees/<계절><번호>.png (투명)
import os, sys, numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage
SP = os.path.dirname(os.path.abspath(__file__)); OUT = os.path.join(SP, 'trees'); os.makedirs(OUT, exist_ok=True)
im = Image.open(sys.argv[1]).convert('RGB'); W, H = im.size
seasons = ['spring', 'summer', 'autumn', 'winter']
for r, se in enumerate(seasons):
    for c in range(3):
        cell = im.crop((c * W // 3, r * H // 4, (c + 1) * W // 3, (r + 1) * H // 4)); a = np.asarray(cell).astype(int)
        fg = a.min(axis=2) < 238
        fg = ndimage.binary_closing(fg, iterations=4); fg = ndimage.binary_fill_holes(fg)
        lab, n = ndimage.label(fg); sz = ndimage.sum(fg, lab, range(1, n + 1)); fg = lab == (np.argmax(sz) + 1)
        fg = ndimage.binary_fill_holes(fg)
        al = Image.fromarray((fg * 255).astype('uint8')).filter(ImageFilter.GaussianBlur(1.5))
        t = cell.convert('RGBA'); t.putalpha(al); t = t.crop(al.getbbox()); t.save(os.path.join(OUT, f'{se}{c}.png'))
pv = Image.new('RGB', (900, 1000), (120, 160, 90))
for r, se in enumerate(seasons):
    for c in range(3):
        t = Image.open(os.path.join(OUT, f'{se}{c}.png')); t.thumbnail((240, 240)); pv.paste(t, (c * 300 + 20, r * 250 + 5), t)
pv.save(os.path.join(SP, 'trees_cut.jpg')); print('ok')
