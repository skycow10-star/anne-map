# 사용: py -3 patchin.py <원본 png> <편집 png> <img 키> x0,y0,x1,y1 [...]  편집본에서 타원 영역만 원본에 붙임(1376x768 기준)
import os, sys
from PIL import Image, ImageDraw, ImageFilter
SP = os.path.dirname(os.path.abspath(__file__)); IMG = os.path.join(os.path.expanduser('~'), 'anne-map', 'img')
o = Image.open(sys.argv[1]).convert('RGB'); e = Image.open(sys.argv[2]).convert('RGB').resize(o.size, Image.LANCZOS); key = sys.argv[3]
m = Image.new('L', o.size, 0); d = ImageDraw.Draw(m)
for b in sys.argv[4:]: d.ellipse(tuple(map(int, b.split(','))), fill=255)
m = m.filter(ImageFilter.GaussianBlur(10))
o.paste(e, (0, 0), m); o.save(os.path.join(IMG, key + '.webp'), quality=86)
o.resize((688, 384)).save(os.path.join(SP, 'done_' + key + '.jpg'), quality=88); print('ok')
