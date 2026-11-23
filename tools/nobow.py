# 짧은 머리 앤 그림 3장에서 작은 초록 리본을 지우고 둘레 머리카락으로 채우기(원본은 orig_로 보관)
import os, shutil, numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage
I = os.path.join(os.path.expanduser('~'), 'anne-map', 'img'); SP = os.path.dirname(os.path.abspath(__file__))
row = Image.new('RGB', (1200, 300), 'white')
for n, k in enumerate(['anne_short_sad', 'anne_short_happy', 'anne_short_dreamy']):
    src = os.path.join(SP, 'orig_' + k + '.webp')
    if not os.path.exists(src): shutil.copy(os.path.join(I, k + '.webp'), src)
    im = Image.open(src).convert('RGBA'); a = np.asarray(im).astype(float)
    r, g, b, al = a[..., 0], a[..., 1], a[..., 2], a[..., 3]
    box = np.zeros(al.shape, bool); box[130:230, 230:340] = True
    m = box & (g > r - 8) & (al > 100)            # 머리(주황)는 r이 훨씬 큼, 리본(연두)은 g가 비슷하거나 큼
    m = ndimage.binary_dilation(m, iterations=4) & box
    lab, k2 = ndimage.label(m); sz = ndimage.sum(m, lab, range(1, k2 + 1)); m = lab == (np.argmax(sz) + 1)
    m = ndimage.binary_dilation(m, iterations=3)
    print(k, m.sum(), np.argwhere(m).min(0), np.argwhere(m).max(0))
    rgb = a[..., :3].copy(); known = ~m
    # 바깥에서 안으로 번지듯 채우기
    for it in range(200):
        if known.all(): break
        acc = np.zeros_like(rgb); cnt = np.zeros(known.shape)
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1), (1, 1), (-1, -1), (1, -1), (-1, 1)):
            sk = np.roll(np.roll(known, dy, 0), dx, 1); sv = np.roll(np.roll(rgb, dy, 0), dx, 1)
            acc += sv * sk[..., None]; cnt += sk
        new = (~known) & (cnt >= 2)
        rgb[new] = acc[new] / cnt[new][:, None]; known = known | new
    # 붓결 느낌: 주변 머리의 결(고주파)을 옮겨 붙임
    hp = a[..., :3] - ndimage.gaussian_filter(a[..., :3], (3, 3, 0))
    tex = np.roll(hp, -42, 0)
    rgb[m] += tex[m] * .9
    out = a.copy(); out[..., :3] = np.clip(rgb, 0, 255); out[m, 3] = np.maximum(a[m, 3], 255 * (al[m] > 20))
    o = Image.fromarray(out.astype('uint8'), 'RGBA'); o.save(os.path.join(I, k + '.webp'), quality=90)
    bg = Image.new('RGBA', o.size, (255, 255, 255, 255)); bg.alpha_composite(o)
    row.paste(bg.convert('RGB').crop((150, 50, 650, 425)).resize((400, 300)), (n * 400, 0))
row.save(os.path.join(SP, 'heads_nobow.jpg')); print('ok')
