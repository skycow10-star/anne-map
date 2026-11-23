# 사용: py -3 boxcut.py <png> <크기> 키:x0,y0,x1,y1 ...  흰 배경 -> 투명 정사각 webp
import os, sys, numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage
IMG = os.path.join(os.path.expanduser('~'), 'anne-map', 'img')
im = Image.open(sys.argv[1]).convert('RGB'); S = int(sys.argv[2])
for arg in sys.argv[3:]:
    k, b = arg.split(':'); x0, y0, x1, y1 = map(int, b.split(','))
    c = im.crop((x0 - 20, y0 - 20, x1 + 20, y1 + 20)); a = np.asarray(c).astype(int)
    fg = a.min(2) < 236; fg = ndimage.binary_closing(fg, iterations=3); fg = ndimage.binary_fill_holes(fg)
    al = Image.fromarray((fg * 255).astype('uint8')).filter(ImageFilter.GaussianBlur(1.2))
    t = c.convert('RGBA'); t.putalpha(al); t = t.crop(al.getbbox()); t.thumbnail((int(S * .92), int(S * .92)), Image.LANCZOS)
    out = Image.new('RGBA', (S, S), (0, 0, 0, 0)); out.paste(t, ((S - t.width) // 2, (S - t.height) // 2), t)
    out.save(os.path.join(IMG, k + '.webp'), quality=90); print('ok', k)
