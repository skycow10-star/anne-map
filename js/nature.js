/* 앤의 반짝이 수첩 (자연 모으기)
   계절마다 지도 곳곳에 반짝이(✨)가 숨어 있고, 누르면 자연을 발견해 도감에 담는다.
   발견할 때 아이가 앤처럼 이름을 붙인다(진짜 이름은 아래에 작게).
   그림은 img/<img>.webp, 없으면 이모지 e로 대신한다. 장의 season과 같은 계절 것만 나온다. */
const SEASON_KO = {spring:"봄", summer:"여름", autumn:"가을", winter:"겨울"};
const NATURE = [
  // 봄
  {id:"apple", s:"spring", img:"fl_apple", e:"🌸", name:"사과꽃", say:"하얀 꽃잎이 레이스 같아. 가을엔 이 자리에 사과가 열린대.", pick:["하얀 레이스 꽃", "눈송이 나무", "신부의 면사포"]},
  {id:"cherry", s:"spring", img:"fl_cherry", e:"🌸", name:"벚꽃", say:"바람이 불면 꽃잎이 눈처럼 흩날려.", pick:["눈의 여왕", "분홍 꽃비", "봄의 리본"]},
  {id:"daffodil", s:"spring", img:"fl_daffodil", e:"🌼", name:"수선화", say:"노란 나팔을 불며 봄이 왔다고 알려 주는 꽃이야.", pick:["햇살 나팔", "봄의 종", "노란 왕관"]},
  {id:"violet", s:"spring", img:"fl_violet", e:"🪻", name:"제비꽃", say:"수줍은 보랏빛. 앤이 '제비꽃 골짜기'라고 부른 곳에 잔뜩 피어.", pick:["수줍은 요정", "보랏빛 별", "골짜기 공주"]},
  {id:"dandelion", s:"spring", img:"fl_dandelion", e:"🌼", name:"민들레 홀씨", say:"후 불면 작은 낙하산들이 하늘로 날아가.", pick:["바람의 우산", "소원 씨앗", "하얀 불꽃놀이"]},
  {id:"mayflower", s:"spring", img:"na_mayflower", e:"🌺", name:"메이플라워", say:"봄에 가장 먼저 피는 분홍 꽃. 에이번리 아이들이 제일 좋아해.", pick:["봄의 첫 인사", "숲속 분홍 별", "향기 상자"]},
  {id:"butterfly", s:"spring", img:"fl_butterfly", e:"🦋", name:"부전나비", say:"하늘빛 날개를 팔랑팔랑. 손톱만큼 작아.", pick:["하늘 조각", "꽃 편지", "파란 춤꾼"]},
  {id:"bluebird", s:"spring", img:"fl_bird", e:"🐦", name:"파랑새", say:"등은 하늘색, 배는 노을색. 행복을 데려온대.", pick:["행복 배달부", "노을 가슴 새", "하늘 노래꾼"]},
  // 여름
  {id:"rose", s:"summer", img:"fl_rose", e:"🌹", name:"들장미", say:"길가에 핀 분홍 장미. 향기가 바람을 타고 와.", pick:["길가의 공주", "분홍 향기", "가시 요정"]},
  {id:"tigerlily", s:"summer", img:"na_tigerlily", e:"🌺", name:"참나리", say:"주황 꽃잎에 까만 점이 콕콕. 다이애나와 맹세할 때 쓴 꽃이야.", pick:["불꽃 왕관", "점박이 공주", "맹세의 꽃"]},
  {id:"iris", s:"summer", img:"it_iris", e:"💐", name:"붓꽃", say:"물가에 피는 보랏빛 꽃. 일레인 놀이 때 손에 쥐었던 꽃이야.", pick:["물의 기사", "보랏빛 깃발", "일레인의 꽃"]},
  {id:"waterlily", s:"summer", img:"na_waterlily", e:"🪷", name:"수련", say:"연못 위에 하얀 접시처럼 둥둥 떠 있어.", pick:["물 위의 별", "요정의 접시", "연못 왕관"]},
  {id:"firefly", s:"summer", img:"na_firefly", e:"✨", name:"반딧불이", say:"여름밤 풀숲에 작은 등불이 반짝반짝.", pick:["풀숲의 별", "작은 등불", "밤의 요정"]},
  {id:"dragonfly", s:"summer", img:"na_dragonfly", e:"💠", name:"잠자리", say:"유리처럼 투명한 날개로 연못 위를 쌩쌩.", pick:["유리 날개", "연못 비행사", "여름 화살"]},
  {id:"frog", s:"summer", img:"na_frog", e:"🐸", name:"청개구리", say:"수련 잎 위에서 개굴개굴 노래해.", pick:["연못 가수", "초록 왕자", "개굴 신사"]},
  {id:"clover", s:"summer", img:"na_clover", e:"🍀", name:"네잎클로버", say:"찾으면 행운이 온대! 앤은 정말 찾았을까?", pick:["행운의 열쇠", "요정의 부채", "초록 소원"]},
  // 가을
  {id:"maple", s:"autumn", img:"na_maple", e:"🍁", name:"단풍잎", say:"빨갛고 노랗고 주황빛. 앤이 방을 꾸미려고 한 아름 주워 온 잎이야.", pick:["불꽃 손바닥", "가을 편지", "노을 조각"]},
  {id:"acorn", s:"autumn", img:"na_acorn", e:"🌰", name:"도토리", say:"작은 모자를 쓴 숲속 열매.", pick:["숲속 모자", "다람쥐 보물", "꼬마 신사"]},
  {id:"squirrel", s:"autumn", img:"na_squirrel", e:"🐿️", name:"다람쥐", say:"볼이 빵빵하게 도토리를 모으고 있어.", pick:["볼빵빵 요리사", "꼬리 우산", "숲속 우체부"]},
  {id:"apples", s:"autumn", img:"na_apples", e:"🍎", name:"빨간 사과", say:"봄에 하얀 꽃이 피던 그 나무에 사과가 열렸어!", pick:["루비 열매", "가을 등불", "꽃의 선물"]},
  {id:"aster", s:"autumn", img:"na_aster", e:"🌼", name:"들국화", say:"보랏빛과 하얀빛. 가을 들판을 수놓는 별 모양 꽃.", pick:["들판의 별", "가을 단추", "보랏빛 미소"]},
  {id:"mushroom", s:"autumn", img:"na_mushroom", e:"🍄", name:"버섯", say:"자작나무 아래 동그란 지붕. 요정의 집일지도 몰라.", pick:["요정의 지붕", "빨간 우산", "숲속 오두막"]},
  {id:"geese", s:"autumn", img:"na_geese", e:"🪿", name:"기러기 떼", say:"V자로 줄지어 남쪽으로 날아가. 끼룩끼룩 작별 인사.", pick:["하늘의 화살", "가을 여행단", "작별 행렬"]},
  {id:"pinecone", s:"autumn", img:"na_pinecone", e:"🌲", name:"솔방울", say:"가문비나무 숲에 떨어진 작은 비늘 열매.", pick:["숲의 종", "나무 비늘", "요정의 등불"]},
  // 겨울
  {id:"snowflake", s:"winter", img:"na_snowflake", e:"❄️", name:"눈송이", say:"장갑 위에 내려앉은 눈송이. 하나도 같은 모양이 없대.", pick:["하늘의 레이스", "별 조각", "겨울 편지"]},
  {id:"icicle", s:"winter", img:"na_icicle", e:"🧊", name:"고드름", say:"처마 끝에 매달린 유리 칼. 햇빛에 반짝여.", pick:["얼음 피리", "유리 종", "겨울 촛대"]},
  {id:"chickadee", s:"winter", img:"na_chickadee", e:"🐦", name:"박새", say:"추운 날에도 '치카디디' 하고 노래하는 작은 새.", pick:["눈 속 가수", "까만 모자 새", "겨울 친구"]},
  {id:"hare", s:"winter", img:"na_hare", e:"🐇", name:"눈토끼", say:"겨울이 되면 털이 하얗게 바뀌어. 눈밭에 발자국만 남겨.", pick:["눈의 왕자", "솜뭉치", "발자국 요정"]},
  {id:"holly", s:"winter", img:"na_holly", e:"🔴", name:"빨간 열매", say:"하얀 눈 위에 빨간 구슬처럼 콕콕 박혀 있어.", pick:["눈 위의 루비", "겨울 구슬", "산타의 단추"]},
  {id:"spruce", s:"winter", img:"na_spruce", e:"🌲", name:"눈 덮인 가문비", say:"가지마다 하얀 눈을 소복이 이고 있어.", pick:["눈 모자 나무", "겨울 성의 기둥", "하얀 숲지기"]},
  {id:"frost", s:"winter", img:"na_frost", e:"🌨️", name:"서리꽃", say:"아침 창문에 얼음이 그린 꽃 그림.", pick:["창문 그림", "얼음 고사리", "요정의 낙서"]},
  {id:"star", s:"winter", img:"na_star", e:"⭐", name:"겨울 별", say:"맑은 겨울밤, 하늘 가득 쏟아질 듯한 별.", pick:["밤의 등불", "하늘의 보석", "소원 별"]}
];
const NAT = Object.fromEntries(NATURE.map(n => [n.id, n]));
const natLook = (n, cls = "") => `<img class="${cls}" src="${IMG(n.img)}" alt="" onerror="this.outerHTML='<i class=\\'${cls} emo\\'>${n.e}</i>'">`;

/* 지도에 반짝이 놓기: 지금 계절의 아직 못 찾은 것 중 3개까지, 열린 장소 근처에 */
let natSpots = null, natKey = "";
function natureDraw(){
  const g = $("nature"); if(!g) return; S.nat = S.nat || {};
  const season = (C() && C().season) || "spring", key = S.ch + season + Object.keys(S.nat).length;
  if(natKey !== key){ natKey = key;
    const left = NATURE.filter(n => n.s === season && !S.nat[n.id]);
    const places = Object.keys(P).filter(k => P[k].from <= S.ch || S.over);
    const pick = left.slice().sort(() => Math.random() - .5).slice(0, 3);
    const used = places.slice().sort(() => Math.random() - .5);
    natSpots = pick.map((n, i) => { const p = P[used[i % used.length]], side = Math.random() < .5 ? -1 : 1;
      return {id:n.id, x:p.x + side * (58 + Math.random() * 30), y:p.y - 40 - Math.random() * 30}; });
  }
  g.innerHTML = (natSpots || []).map(s => `<g class="nat" data-id="${s.id}" transform="translate(${s.x | 0} ${s.y | 0}) scale(1.3)" role="button" aria-label="반짝이는 무언가">
    <circle class="halo" r="30" fill="url(#natGlow)"/><path class="tw" d="M0-24C3-6 6-3 24 0 6 3 3 6 0 24-3 6-6 3-24 0-6-3-3-6 0-24Z" fill="#fff6c8" stroke="#e7b84a" stroke-width="2.5"/><circle class="tw2" cx="17" cy="-16" r="4" fill="#fff"/></g>`).join("");
  g.querySelectorAll(".nat").forEach(el => el.onclick = e => { e.stopPropagation(); if(busy) return; natFound(el.dataset.id); });
}

/* 발견! 이름 붙이기 */
function natFound(id){
  const n = NAT[id]; if(!n) return;
  popCard(`<span class="lab">${SEASON_KO[n.s]}의 자연 발견!</span>
    <div class="natbig">${natLook(n, "nb")}</div>
    <h2>${esc(n.name)}</h2><p>${esc(n.say)}</p>
    <p style="font-size:14px;margin-top:6px"><b>앤처럼 이름을 붙여 볼까요?</b></p>
    <div class="chips">${n.pick.map(p => `<button data-v="${esc(p)}">${esc(p)}</button>`).join("")}</div>
    <div class="namein"><input id="natIn" maxlength="12" placeholder="직접 지어도 돼요" aria-label="직접 지을 이름"><button id="natOk">짓기</button></div>
    <button class="big-btn ghost" id="pOk">이름 없이 담기</button>`, () => natSave(id, ""));
  const done = v => { v = (v || "").replace(/[<>]/g, "").trim().slice(0, 12); closeCard(); natSave(id, v); };
  document.querySelectorAll("#popIn .chips button").forEach(b => b.onclick = () => done(b.dataset.v));
  $("natOk").onclick = () => done($("natIn").value); $("natIn").onkeydown = e => { if(e.key === "Enter") done($("natIn").value); };
}
function natSave(id, nm){
  S.nat = S.nat || {}; S.nat[id] = {nm, ch:S.ch}; saveS();
  const all = NATURE.filter(x => x.s === NAT[id].s), got = all.filter(x => S.nat[x.id]).length;
  note(`📔 반짝이 수첩에 담았어요 · ${SEASON_KO[NAT[id].s]} ${got}/${all.length}`);
  if(got === all.length) setTimeout(() => note(`🎉 ${SEASON_KO[NAT[id].s]} 수첩을 다 채웠어요!`), 2100);
  natKey = ""; drawMap();
}

/* 도감 보기 */
let bookS = null;
function natureBook(season){
  S.nat = S.nat || {};
  bookS = season || bookS || (C() && C().season) || "spring";
  const total = Object.keys(S.nat).length;
  $("bkCount").textContent = `${total}/${NATURE.length}`;
  $("bkTabs").innerHTML = Object.entries(SEASON_KO).map(([k, v]) => { const a = NATURE.filter(n => n.s === k), g = a.filter(n => S.nat[n.id]).length;
    return `<button data-s="${k}" class="${k === bookS ? "on" : ""}">${v} ${g}/${a.length}</button>`; }).join("");
  $("bkTabs").querySelectorAll("button").forEach(b => b.onclick = () => natureBook(b.dataset.s));
  $("bkBody").innerHTML = `<div class="bk-grid">${NATURE.filter(n => n.s === bookS).map(n => { const f = S.nat[n.id];
    return f ? `<button class="bk-it" data-id="${n.id}">${natLook(n, "bi")}<b>${esc(f.nm || n.name)}</b><span>${f.nm ? esc(n.name) : "이름을 붙여 줄래요?"}</span></button>`
             : `<div class="bk-it lock"><i class="bi emo">?</i><b>???</b><span>${SEASON_KO[n.s]}에 찾을 수 있어요</span></div>`; }).join("")}</div>`;
  $("bkBody").querySelectorAll(".bk-it[data-id]").forEach(b => b.onclick = () => natRename(b.dataset.id));
  $("book").classList.add("on");
}
function natRename(id){
  const n = NAT[id], f = S.nat[id];
  popCard(`<div class="natbig">${natLook(n, "nb")}</div><h2>${esc(f.nm || n.name)}</h2><p style="font-size:13px">진짜 이름: ${esc(n.name)}</p><p>${esc(n.say)}</p>
    <div class="namein"><input id="natIn" maxlength="12" placeholder="새 이름 짓기" value="${esc(f.nm || "")}"><button id="natOk">바꾸기</button></div>
    <button class="big-btn ghost" id="pOk">닫기</button>`);
  $("natOk").onclick = () => { const v = $("natIn").value.replace(/[<>]/g, "").trim().slice(0, 12); S.nat[id].nm = v; saveS(); closeCard(); natureBook(); };
}
