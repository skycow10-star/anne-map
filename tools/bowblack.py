# 결말 그림 속 짧은 머리 앤의 작은 초록 리본을 검은 벨벳 리본으로(8장에서 묶은 리본과 맞추기)
import os, shutil, numpy as np
from PIL import Image
from scipy import ndimage
I = os.path.join(os.path.expanduser('~'), 'anne-map', 'img'); SP = os.path.dirname(os.path.abspath(__file__))
JOBS = {'ed_ch8_imag': (380, 262, 28), 'ed_ch8_bal': (1024, 247, 12)}
row = Image.new('RGB', (480, 240), 'white')
for n, (k, (cx, cy, th)) in enumerate(JOBS.items()):
    src = os.path.join(SP, 'orig_' + k + '.webp')
    if not os.path.exists(src): shutil.copy(os.path.join(I, k + '.webp'), src)
    im = Image.open(src).convert('RGB'); a = np.asarray(im).astype(float)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    box = np.zeros(r.shape, bool); box[cy - 45:cy + 45, cx - 50:cx + 50] = True
    m = box & (g > r - th) & (g > b + 8) & (r < 225) & (g > 90)
    lab, k2 = ndimage.label(ndimage.binary_dilation(m, iterations=2)); sz = ndimage.sum(m, lab, range(1, k2 + 1))
    keep = lab == (np.argmax(sz) + 1); m = keep & ndimage.binary_dilation(m, iterations=1)
    print(k, m.sum(), np.argwhere(m).min(0), np.argwhere(m).max(0))
    lum = (r * .3 + g * .59 + b * .11)
    soft = ndimage.gaussian_filter(m.astype(float), 1.0)
    dark = np.stack([lum * .32 + 18, lum * .3 + 16, lum * .34 + 22], -1)
    out = a * (1 - soft[..., None]) + dark * soft[..., None]
    o = Image.fromarray(np.clip(out, 0, 255).astype('uint8')); o.save(os.path.join(I, k + '.webp'), quality=88)
    row.paste(o.crop((cx - 80, cy - 80, cx + 80, cy + 80)).resize((240, 240)), (n * 240, 0))
row.save(os.path.join(SP, 'bowblack.jpg')); print('ok')
