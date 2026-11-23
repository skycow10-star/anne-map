# 지도 4계절에 같은 자리로: 꽃길 왼쪽에 나무 심기 + 역에서 큰길로 가는 흙길
# 사용: py -3 mapstamp.py [preview]  (preview면 미리보기만, 아니면 img/map_*.webp 덮어씀 — 원본은 orig_map_*.webp 로 보관)
import os, sys, math, numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance
SP = os.path.dirname(os.path.abspath(__file__)); IMG = os.path.join(os.path.expanduser('~'), 'anne-map', 'img')
K = 2400 / 1600
TREES = [(324, 390, 1.0), (306, 438, .95), (336, 598, 1.0), (373, 628, .95), (414, 650, .9)]   # 나무 밑동(1600 기준), 크기
PATH0 = [(296, 690), (334, 694), (370, 689), (402, 677), (430, 664), (458, 653), (484, 646)]
def _cr(P, n=12):
    P = [P[0]] + P + [P[-1]]; out = []
    for i in range(1, len(P) - 2):
        p0, p1, p2, p3 = P[i - 1], P[i], P[i + 1], P[i + 2]
        for k in range(n):
            t = k / n; t2, t3 = t * t, t * t * t
            out.append(tuple(.5 * ((2 * p1[j]) + (-p0[j] + p2[j]) * t + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * t2 + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * t3) for j in (0, 1)))
    return out + [P[-2]]
PATH = _cr(PATH0)
TREE_W = 118   # 2400 기준 나무 폭
ROADPATCH = (641, 901, 663, 923)  # 2400 기준, 큰길 위 질감 조각 (꽃길 구간)
def place(key, se, preview):
    src = os.path.join(SP, 'orig_' + key + '.webp')
    if not os.path.exists(src): Image.open(os.path.join(IMG, key + '.webp')).save(src, lossless=True)
    im = Image.open(src).convert('RGB')
    # 1) 흙길: 큰길 색 질감으로 채우고 양쪽 가장자리에 연한 갈색 선
    pts = [(x * K, y * K) for x, y in PATH]
    m = Image.new('L', im.size, 0); d = ImageDraw.Draw(m); n = len(pts)
    for i, p in enumerate(pts):
        r = 11 + 5 * i / n; d.ellipse([p[0] - r, p[1] - r, p[0] + r, p[1] + r], fill=255)
    ImageDraw.Draw(m).rectangle([0, 0, 456, im.height], fill=0)   # 역 벽 위로는 안 그림
    m = m.filter(ImageFilter.GaussianBlur(.9))
    tex = np.asarray(im.crop(ROADPATCH)).reshape(-1, 3); col = np.median(tex, 0)
    rng = np.random.default_rng(1); nz = rng.normal(0, 5, (im.height // 24 + 1, im.width // 24 + 1))
    nz = np.asarray(Image.fromarray(nz.astype('float32')).resize(im.size, Image.BICUBIC))
    tile = Image.fromarray(np.clip(col[None, None, :] + nz[..., None], 0, 255).astype('uint8'))
    # 길 안쪽 결(가는 갈색 줄 몇 개)
    td = ImageDraw.Draw(tile)
    for off in ():
        q = [(x, y + off + (3 if i % 2 else -2)) for i, (x, y) in enumerate(pts)]
        td.line(q[1:-1], fill=tuple(int(v * .86) for v in col), width=3)
    tile = tile.filter(ImageFilter.GaussianBlur(1.3))
    # 가장자리 잉크 선: 끝(큰길과 만나는 곳, 역 벽)은 빼고
    edge = m.filter(ImageFilter.FIND_EDGES).point(lambda v: 255 if v > 40 else 0).filter(ImageFilter.GaussianBlur(.6))
    cut = Image.new('L', im.size, 255); cd = ImageDraw.Draw(cut)
    for p in (pts[-1],): cd.ellipse([p[0] - 34, p[1] - 34, p[0] + 34, p[1] + 34], fill=0)
    cut = cut.filter(ImageFilter.GaussianBlur(10))
    edge = Image.fromarray((np.asarray(edge).astype(int) * np.asarray(cut).astype(int) // 255).astype('uint8'))
    line = (78, 60, 44)
    im.paste(tile, (0, 0), m); im.paste(Image.new('RGB', im.size, line), (0, 0), edge.point(lambda v: int(v * .75)))
    # 2) 나무 (아래쪽 나무가 앞에 오게 y 순서)
    for i, (x, y, s) in enumerate(sorted(TREES, key=lambda t: t[1])):
        t = Image.open(os.path.join(SP, 'trees', f"{'spring' if se == 'winter' else se}{i % 3}.png")).convert('RGBA')
        ta = np.asarray(t).copy(); hh = ta.shape[0]; low = ta[int(hh * .82):]; light = low[..., :3].min(2) > 130
        low[..., 3] = np.where(light, 0, low[..., 3]); ta[int(hh * .82):] = low; t = Image.fromarray(ta)
        w = int(TREE_W * s); h = int(t.height * w / t.width); t = t.resize((w, h), Image.LANCZOS)
        if se == 'summer': t = Image.merge('RGBA', (*ImageEnhance.Brightness(ImageEnhance.Color(t.convert('RGB')).enhance(1.15)).enhance(.78).split(), t.getchannel('A')))
        if se == 'winter':
            g = np.asarray(t.convert('L')).astype(float); rgb = Image.fromarray(np.clip(np.stack([g * .93, g * .96, g * 1.04 + 4], 2), 0, 255).astype('uint8')); t = Image.merge('RGBA', (*rgb.split(), t.getchannel('A')))
        bx, by = int(x * K), int(y * K)
        sh = Image.new('L', (int(w * .8), int(w * .22)), 0); ImageDraw.Draw(sh).ellipse([0, 0, sh.width - 1, sh.height - 1], fill=70); sh = sh.filter(ImageFilter.GaussianBlur(4))
        if 0: im.paste(Image.new('RGB', sh.size, (60, 70, 40)), (bx - sh.width // 2 + 6, by - sh.height // 2), sh)
        im.paste(t, (bx - w // 2, by - h + 4), t)
    if preview:
        im.crop((int(40 * K), int(330 * K), int(720 * K), int(870 * K))).resize((680, 540)).save(os.path.join(SP, 'stamp_' + key + '.jpg'), quality=86)
    else:
        im.save(os.path.join(IMG, key + '.webp'), quality=86)
pv = len(sys.argv) > 1 and sys.argv[1] == 'preview'
for se in ['spring', 'summer', 'autumn', 'winter']: place('map_' + se, se, pv)
print('ok')
