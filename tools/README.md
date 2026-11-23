# 그림 처리 도구

파이썬 3 + Pillow, numpy, scipy가 필요해요(`py -3 -m pip install pillow numpy scipy`).
모두 결과를 `~/anne-map/img/`에 webp로 저장해요. 미리보기 jpg는 이 폴더에 생겨요(올리지 않아도 됨).

| 도구 | 쓰는 법 | 하는 일 |
|---|---|---|
| `spritecut.py` | `py -3 spritecut.py 받은그림.png 그림키 [위 아래]` | 흰 배경 인물 그림 → 투명 747×1000 인물(머리 57, 발 960에 맞춤) |
| `boxcut.py` | `py -3 boxcut.py 시트.png 200 키:x0,y0,x1,y1 ...` | 흰 배경에 여러 물건이 있는 그림 → 하나씩 잘라 투명 정사각 webp |
| `patchin.py` | `py -3 patchin.py 원본.png 고친것.png 그림키 x0,y0,x1,y1` | 제미나이가 고친 그림에서 타원 부분만 원본에 붙임(위치 어긋남 막기) |
| `treecut.py` | `py -3 treecut.py 나무시트.png` | 4계절×3그루 나무 스티커 시트 자르기(지도에 심을 나무) |
| `mapstamp.py` | `py -3 mapstamp.py [preview]` | 계절 지도 4장에 나무 스티커와 흙길 그려 넣기. `orig_map_*.webp`와 `trees/`가 이 폴더에 있어야 함 |
| `nobow.py` | `py -3 nobow.py` | 짧은 머리 앤 그림의 작은 초록 리본 지우기(예시, `orig_` 원본 필요) |
| `bowblack.py` | `py -3 bowblack.py` | 결말 그림의 작은 초록 리본을 검은색으로(예시, `orig_` 원본 필요) |

원본 그림이 필요하면 git 기록에서 꺼내요: `git show 커밋:img/파일.webp > orig_파일.webp`
