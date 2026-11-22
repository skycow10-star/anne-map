/* 에이번리 마을 지도 · 엔진
   장 데이터는 js/chN.js 에서 CH[n] = {...} 로 넣는다. 형식은 맨 아래 「장 데이터 모양」 참고. */
const CH = [];
const $ = id => document.getElementById(id);
const IMG = k => `img/${k}.webp`;
const esc = s => String(s).replace(/[&<>"]/g, m => ({"&":"&amp;", "<":"&lt;", ">":"&gt;", "\"":"&quot;"}[m]));
const PORTRAIT = matchMedia("(orientation:portrait) and (max-width:1000px)");

/* ---------- 장소 (지도 그림 img/map_spring.webp 위 좌표, 1600×900 기준) ---------- */
const P = {
  station:{name:"브라이트 리버 역", x:290, y:735, bg:"ch1", bgW:"ch6_snow", from:1, say:["기차역이야. 여기서 매슈 아저씨를 처음 만났지."]},
  avenue:{name:"꽃이 핀 가로수길", x:300, y:430, bg:"ch1_avenue", bgW:"ch6_snow", from:1, say:["'{avenue}'. 언제 와도 마음이 하얘져.", "꽃잎 터널 아래를 걸으면 공주가 된 기분이야."]},
  pond:{name:"배리 씨네 연못", x:650, y:462, bg:"ch1_pond", bgW:"ch6_snow", from:1, say:["'{pond}'. 물결이 오늘도 반짝반짝해."]},
  home:{name:"초록 지붕 집", x:1110, y:445, bg:"ch1_home", from:1, say:["초록 지붕 집. 이제 진짜 내 집이야.", "다락방 창문에서 벚나무가 손을 흔들어."]},
  lynde:{name:"린드 부인 집", x:600, y:300, bg:"ch2_lynde", from:2, say:["린드 부인은 오늘도 창가에서 길을 지켜보고 계실 거야.", "린드 부인의 정원은 늘 반듯반듯해."]},
  lane:{name:"연인의 오솔길", x:1245, y:330, bg:"ch2_lane", bgW:"ch6_snow", from:2, say:["'{lane}'. 나무들이 소곤소곤 이야기하는 길이야."]},
  barry:{name:"배리 씨네 집", x:1050, y:250, bg:"ch3", from:3, say:["다이애나네 집이야. 창문에 불이 켜져 있으면 괜히 기뻐져."]},
  spring:{name:"통나무 다리 옆 샘", x:815, y:360, bg:"ch3_bridge", bgW:"ch6_snow", from:3, say:["'{spring}'. 물속에 요정이 사는 것 같아."]},
  church:{name:"교회와 목사관", x:790, y:610, bg:"church_out", bgW:"ch6_snow", from:3, say:["교회 종소리가 들리면 일요일이야."]},
  birch:{name:"자작나무 길", x:1430, y:480, bg:"ch4_birch", bgW:"ch6_snow", from:4, say:["'{birch}'. 하얀 나무들이 줄지어 서 있어."]},
  school:{name:"에이번리 학교", x:1460, y:745, bg:"ch4", from:4, say:["학교야. 칠판 냄새가 나."]},
  pasture:{name:"뒷목장", x:1195, y:215, bg:"ch10_pasture", from:10, say:["뒷목장. 저녁이면 소들이 집으로 돌아와."]},
  hill:{name:"길모퉁이 언덕", x:1450, y:205, bg:"ch10_hill", from:10, say:["길이 언덕을 넘어 굽어 가. 저 너머엔 뭐가 있을까?"]}
};

/* ---------- 길 (지도 그림 속 실제 길을 따라 걷기) ----------
   점(x,y)은 1600×900 기준. 장소는 PLACE_NODE의 점에서 길에 올라탄다. */
const NODES = {
  st:[418, 770], f1:[305, 682], av1:[268, 565], av2:[282, 455], av3:[318, 345], av4:[378, 255], t1:[432, 234], t2:[565, 238],
  ly:[640, 345], lyr:[722, 300], pn1:[705, 388], pb:[782, 418], sp:[828, 392], g1:[862, 446], g2:[962, 462], gg:[1062, 508],
  tb1:[700, 232], br1:[822, 240], br2:[930, 214], by:[1032, 280], bb:[957, 352],
  l1:[430, 716], l2:[600, 740], l3:[742, 756], ch:[765, 692], l4:[900, 772], l5:[992, 766], l6:[1150, 722], l7:[1250, 642], l8:[1312, 546],
  gs1:[975, 572], gs2:[952, 652], ln1:[1182, 470], ln2:[1292, 432], ln3:[1286, 332], ln4:[1272, 238], pa:[1225, 215],
  h1:[1380, 452], h2:[1462, 380], h5:[1487, 330], h3:[1470, 280], h4:[1422, 222], hl:[1398, 182], bi:[1425, 585], s1:[1232, 772], sc:[1398, 792]
};
const EDGES = "st-f1 f1-av1 av1-av2 av2-av3 av3-av4 av4-t1 t1-t2 lyr-ly lyr-pn1 tb1-lyr ly-pn1 pn1-pb pb-sp pb-g1 g1-g2 g2-gg t2-tb1 tb1-br1 br1-br2 br2-by by-bb bb-g2 " +
  "f1-l1 l1-l2 l2-l3 l3-ch l3-l4 l4-l5 l5-l6 l6-l7 l7-l8 gg-gs1 gs1-gs2 gs2-l5 gg-ln1 ln1-ln2 ln2-ln3 ln3-ln4 ln4-pa ln2-l8 l8-h1 h1-h2 h2-h5 h5-h3 h3-h4 h4-hl l8-bi l6-s1 s1-sc";
const PLACE_NODE = {station:"st", avenue:"av2", lynde:"ly", pond:"pn1", spring:"sp", home:"gg", barry:"by", church:"ch", birch:"bi", school:"sc", lane:"ln3", pasture:"pa", hill:"hl"};
const GRAPH = {}; EDGES.split(" ").forEach(e => { const [a, b] = e.split("-"); (GRAPH[a] = GRAPH[a] || []).push(b); (GRAPH[b] = GRAPH[b] || []).push(a); });
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
function route(fromK, toK){
  const A = PLACE_NODE[fromK], B = PLACE_NODE[toK]; const pts = [[P[fromK].x, P[fromK].y]];
  if(A && B){ const D = {[A]:0}, prev = {}, done = new Set();
    while(true){ let u = null; for(const k in D) if(!done.has(k) && (u === null || D[k] < D[u])) u = k; if(u === null || u === B) break; done.add(u);
      (GRAPH[u] || []).forEach(v => { const nd = D[u] + dist(NODES[u], NODES[v]); if(D[v] === undefined || nd < D[v]){ D[v] = nd; prev[v] = u; } }); }
    const ids = []; for(let k = B; k; k = prev[k]){ ids.unshift(k); if(k === A) break; }
    if(ids[0] === A) ids.forEach(k => pts.push(NODES[k])); }
  pts.push([P[toK].x, P[toK].y]); return pts;
}

/* ---------- 말하는 사람 ---------- */
const WHO = {anne:"앤", inner:"앤 (속마음)", matthew:"매슈 아저씨", marilla:"마릴라 아주머니", diana:"다이애나", gilbert:"길버트",
  lynde:"린드 부인", barry:"배리 부인", allan:"앨런 사모님", phillips:"필립스 선생님", station:"역장", doctor:"의사 선생님",
  minnie:"미니 메이", ruby:"루비", jane:"제인", josie:"조지", peddler:"행상인", stacy:"스테이시 선생님", nar:""};
const HEARTS = {matthew:"매슈 아저씨", marilla:"마릴라 아주머니", diana:"다이애나", gilbert:"길버트", lynde:"린드 부인", barry:"배리 부인", allan:"앨런 사모님"};
const ANNE_FACES = {anne:["happy", "dreamy", "surprised", "sad", "angry"], anne_short:["happy", "dreamy", "sad"], anne_grow:["happy", "dreamy", "surprised", "sad", "angry"]};

/* ---------- 추억 물건 ---------- */
const ITEMS = {
  carpetbag:{name:"낡은 융단 가방", img:"it_carpetbag"}, namecard:{name:"이름 카드", img:"it_namecard"}, petal:{name:"벚꽃잎", img:"it_petal"},
  auburn:{name:"희망의 한마디", img:"it_auburn"}, narcissi:{name:"흰 수선화 꽃다발", img:"it_narcissi"},
  wreath:{name:"들꽃 화관 모자", img:"it_wreath"}, vow:{name:"해와 달의 맹세", img:"it_vow"}, choco:{name:"초콜릿 반쪽", img:"it_choco"},
  slate:{name:"금 간 석판", img:"it_slate"}, candy:{name:"하트 사탕", img:"it_candy"},
  currant:{name:"빨간 병", img:"it_currant"}, lock:{name:"다이애나의 머리카락", img:"it_lock"}, pebble:{name:"이름 새긴 조약돌", img:"it_pebble"},
  jamKey:{name:"잼 찬장 열쇠", img:"it_jamKey"}, ipecac:{name:"토근 시럽 약병", img:"it_ipecac"}, star:{name:"겨울 저녁 별", img:"it_star"},
  bottle:{name:"'최고급 바닐라' 병", img:"it_bottle"}, garden:{name:"앤의 작은 꽃밭", img:"it_garden"}, rainbow:{name:"샘 위의 무지개", img:"it_rainbow"},
  dye:{name:"빈 염색약 병", img:"it_dye"}, scissors:{name:"마릴라의 가위", img:"it_scissors"}, ribbon:{name:"검은 벨벳 리본", img:"it_ribbon"},
  shawl:{name:"검은 숄", img:"it_shawl"}, iris:{name:"파란 붓꽃", img:"it_iris"}, pile:{name:"다리 기둥의 그루터기", img:"it_pile"}, oar:{name:"길버트의 노", img:"it_oar"},
  avery:{name:"에이버리 장학금", img:"it_avery"}, maple:{name:"단풍나무 가지", img:"it_maple"}, bend:{name:"길모퉁이", img:"it_bend"}
};

/* ---------- 저장 ---------- */
const FRESH = () => ({nat:{}, tips:{}, got:{}, seen:{}, v:2, ch:1, qi:0, max:1, names:{}, hearts:{matthew:1}, met:{}, items:[], hidden:[], stars:{}, tally:{canon:0, imag:0, bal:0}, res:{}, at:"station", fail:{}, over:false});
let S = FRESH();
const saveS = () => { try{ localStorage.setItem("anneMap2", JSON.stringify(S)); }catch(e){} };
try{ const d = JSON.parse(localStorage.getItem("anneMap2") || "null"); if(d && d.v === 2) S = Object.assign(FRESH(), d); }catch(e){}
if(!S.tips) S.tips = {};
if(S.qi > 0 || S.ch > 1){ S.tips.map = S.tips.talk = true; }
Object.entries(S.res || {}).forEach(([n, r]) => { S.seen[n + "_" + r.e] = true; });

const C = () => CH[S.ch];
const quest = () => C() && C().quests[S.qi];
const fill = t => String(t).replace(/\{(\w+)\}/g, (m, k) => S.names[k] || (P[k] ? P[k].name : m));

/* ---------- 작은 도구 ---------- */
function show(id){ document.querySelectorAll(".screen").forEach(s => s.classList.toggle("on", s.id === id)); $("bMap").hidden = id !== "place" || busy; $("bBag").hidden = id === "mini"; $("bBook").hidden = id !== "map"; }
function toast(m){ const t = $("toast"); t.textContent = m; t.classList.add("on"); clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove("on"), 2400); }
const toastQ = []; let toastBusy = false;
function note(m){ if(toastQ.length > 2) toastQ.shift(); toastQ.push(m); if(!toastBusy) nextNote(); }
function nextNote(){ const m = toastQ.shift(); if(!m){ toastBusy = false; return; } toastBusy = true; toast(m); setTimeout(nextNote, 2000); }
function popCard(html, ok, full){ $("popIn").innerHTML = html; $("pop").classList.toggle("full", !!full); $("pop").classList.add("on"); const b = $("pOk"); if(b) b.onclick = () => { $("pop").classList.remove("on"); ok && ok(); }; }
function closeCard(){ $("pop").classList.remove("on"); }
function hudTitle(){ $("hudT").textContent = C() ? `${S.ch}장 · ${C().title}` : "앤의 에이번리 산책"; }
function hud(){
  const h = $("hudH"), k = (C() && C().who) || "matthew";
  h.hidden = !S.met[k]; const n = S.hearts[k] || 0;
  h.innerHTML = `<img src="${IMG("av_" + k)}" alt="" onerror="this.style.display='none'"><span>${HEARTS[k]}</span> <b>${"♥".repeat(n)}${"♡".repeat(5 - n)}</b>`;
}
function heart(k, n){ S.hearts[k] = Math.max(0, Math.min(5, (S.hearts[k] || 0) + n)); S.met[k] = true; hud(); if(n > 0) note(`💗 ${HEARTS[k]}의 마음 +${n}`); }
function getItem(k){ if(S.items.includes(k)) return; S.items.push(k); (S.got[S.ch] = S.got[S.ch] || []).push(k); note(`🎒 ${ITEMS[k] ? ITEMS[k].name : k}을(를) 가방에 넣었어요`); }
function hide(id){ if(S.hidden.includes(id)) return; S.hidden.push(id); (S.got[S.ch] = S.got[S.ch] || []).push("@" + id); note("✨ 숨은 장면을 찾았어요!"); }
function eff(e){ if(!e) return; if(typeof e === "function"){ e(); return; }
  if(e.h) Object.entries(e.h).forEach(([k, n]) => heart(k, n));
  if(e.get) [].concat(e.get).forEach(getItem);
  if(e.hid) hide(e.hid);
  if(e.met) [].concat(e.met).forEach(k => { S.met[k] = true; hud(); }); }

/* ---------- 지도 ---------- */
let busy = false;
const MAPS = {spring:"map_spring", summer:"map_summer", autumn:"map_autumn", winter:"map_winter"};
function seasonPaint(){
  const s = (C() && C().season) || "spring", r = $("season"), img = $("mapImg");
  img.setAttribute("href", IMG(MAPS[s]));
  const own = MAPS[s] === "map_" + s;   // 계절 그림이 따로 있으면 덧칠하지 않음
  const look = own ? ["#fff", 0, "normal"] : {summer:["#d9e8a0", .16, "multiply"], autumn:["#f0a050", .32, "multiply"], winter:["#e8f0f8", .62, "screen"]}[s] || ["#fff", 0, "normal"];
  r.setAttribute("fill", look[0]); r.setAttribute("opacity", look[1]); r.style.mixBlendMode = look[2];
  const sn = $("snow"); if(s === "winter" && !sn.innerHTML){ let h = ""; for(let i = 0; i < 70; i++) h += `<circle cx="${Math.random() * 1600 | 0}" cy="${Math.random() * 900 | 0}" r="${2 + Math.random() * 3 | 0}" fill="#fff" opacity=".75"/>`; sn.innerHTML = h; }
  if(s !== "winter") sn.innerHTML = "";
}
function drawMap(){
  seasonPaint();
  const q = quest(), target = q ? q.at : null;
  const known = (k) => P[k].from <= S.ch || S.over;
  const open = Object.entries(P);
  $("pins").innerHTML = open.map(([k, p]) => {
    const cur = k === target, lk = !known(k) ? "unknown" : blocked(k) ? "blocked" : "";
    if(lk) return `<g class="pin ${lk}" data-k="${k}" transform="translate(${p.x} ${p.y})" tabindex="0" role="button" aria-label="${lk === "unknown" ? "아직 모르는 곳" : "지금은 갈 수 없는 곳"}">
      <g class="dot"><path d="M0 0C-24-28-28-44-28-55A28 28 0 0 1 28-55C28-44 24-28 0 0Z" fill="#9a8a78" stroke="#fff" stroke-width="4"/>
      <rect x="-10" y="-58" width="20" height="16" rx="3" fill="#fff"/><path d="M-6-58v-5a6 6 0 0 1 12 0v5" stroke="#fff" stroke-width="3.5" fill="none"/></g></g>`;
    return `<g class="pin ${cur ? "new" : ""}" data-k="${k}" transform="translate(${p.x} ${p.y})" tabindex="0" role="button" aria-label="${esc(S.names[k] || p.name)}">
      <g class="dot"><path d="M0 0C-24-28-28-44-28-55A28 28 0 0 1 28-55C28-44 24-28 0 0Z" fill="${cur ? "#c8552f" : "#6b8a4e"}" stroke="#fff" stroke-width="4"/>
      <text y="-45" text-anchor="middle" font-size="28" fill="#fff" font-weight="700">${cur ? "!" : "·"}</text></g></g>`;
  }).join("");
  $("names").innerHTML = open.map(([k, p]) => `<text x="${p.x}" y="${p.y + 36}" font-size="${k === target ? 28 : 22}" opacity="${known(k) ? (blocked(k) ? .6 : 1) : .55}">${known(k) ? esc(S.names[k] || p.name) : "???"}</text>`).join("");
  const at = P[S.at] || P.station; if(!walking){ $("me").setAttribute("transform", `translate(${at.x + 40} ${at.y + 6})`); $("meBody").setAttribute("transform", ""); }
  $("trail").setAttribute("d", "");
  $("guide").setAttribute("d", target && target !== S.at && P[S.at] ? pathD(route(S.at, target)) : "");
  const wk = (q && q.walker) || (C() && C().walker) || "walk_anne", mi = $("meImg"); if(mi.dataset.k !== wk){ mi.dataset.k = wk; mi.onerror = () => mi.setAttribute("href", IMG("walk_anne")); mi.setAttribute("href", IMG(wk)); }
  const mw = $("mw"), sv = mw.firstElementChild, focus = P[target] || at;
  requestAnimationFrame(() => { const sc = sv.clientWidth / 1600; mw.scrollTo({left:Math.max(0, focus.x * sc - mw.clientWidth / 2), behavior:"smooth"}); });
  $("quest").innerHTML = q ? `<b>📒 할 일 ${S.qi + 1}/${C().quests.length}</b> · ${esc(fill(q.label))}` : S.over ? `<b>📒 이야기 끝!</b> 마을을 마음껏 돌아다녀 보세요` : "";
  document.querySelectorAll(".pin").forEach(g => { g.onclick = () => go(g.dataset.k); g.onkeydown = e => { if(e.key === "Enter") go(g.dataset.k); }; });
  hudTitle(); hud(); natureDraw();
  // 처음 하는 아이 안내: 다음 장소 핀 아래 손가락
  const hand = $("hand"), tp = P[target];
  if(!S.tips.map && tp){ hand.style.display = ""; hand.setAttribute("transform", `translate(${tp.x + 62} ${tp.y - 22})`); } else hand.style.display = "none";
}
const pathD = pts => "M" + pts.map(p => p.map(Math.round).join(" ")).join("L");
let walking = false;
function walk(pts, done){
  // 길을 따라 앤 얼굴을 걷게 하고, 지나온 길에 발자국 점선을 남긴다
  const seg = []; let total = 0; for(let i = 1; i < pts.length; i++){ const d = dist(pts[i - 1], pts[i]); seg.push(d); total += d; }
  const dur = Math.max(700, Math.min(2600, total * 2.4)); let t0 = null; walking = true; $("guide").setAttribute("d", "");
  const me = $("me"), tr = $("trail");
  const tick = t => { if(t0 === null) t0 = t; const f = Math.min(1, (t - t0) / dur), e = f < .5 ? 2 * f * f : 1 - Math.pow(-2 * f + 2, 2) / 2;
    let left = e * total, i = 0; while(i < seg.length - 1 && left > seg[i]){ left -= seg[i]; i++; }
    const a = pts[i], b = pts[i + 1] || a, r = seg[i] ? Math.min(1, left / seg[i]) : 1, x = a[0] + (b[0] - a[0]) * r, y = a[1] + (b[1] - a[1]) * r;
    const dir = b[0] < a[0] - 1 ? -1 : 1, ph = (t - t0) / 1000 * 9, hop = Math.abs(Math.sin(ph)) * 7;
    me.setAttribute("transform", `translate(${x} ${y})`);
    $("meBody").setAttribute("transform", `translate(0 ${-hop}) rotate(${Math.sin(ph) * 5}) scale(${dir} 1)`);
    tr.setAttribute("d", pathD(pts.slice(0, i + 1).concat([[x, y]])));
    if(f < 1) requestAnimationFrame(tick); else { walking = false; done(); } };
  requestAnimationFrame(tick);
}
/* 이야기 때문에 잠깐 못 가는 곳: 지금 할 일의 lock:{only:[장소], except:[장소], why:"이유"} */
function blocked(k){ const q = quest(), L = q && q.lock; if(!L || k === q.at) return false;
  if(L.only) return L.only.includes(k); if(L.except) return !L.except.includes(k); return false; }
function go(k){
  if(busy) return;
  if(!(P[k].from <= S.ch || S.over)){ toast(`아직 가 본 적 없는 곳이에요. ${P[k].from}장에서 열려요`); return; }
  if(blocked(k)){ toast(quest().lock.why); return; }
  if(!S.tips.map){ S.tips.map = true; $("hand").style.display = "none"; } const p = P[k], q = quest(); busy = true;
  const pts = S.at && P[S.at] && S.at !== k ? route(S.at, k) : null;
  const arrive = () => { S.at = k; saveS(); drawMap();
  setTimeout(() => { busy = false;
    if(q && q.at === k) playScene(q.nodes, q.bg || p.bg, q.stage, true);
    else { const own = typeof SAY !== "undefined" && SAY[S.ch] && SAY[S.ch][k];
      const lines = p.say || ["여기도 좋은 곳이야."];
      const first = own ? own : [{w:"inner", f:"happy", t:lines[Math.random() * lines.length | 0]}];
      playScene([...first, ...(q ? [{w:"inner", f:"dreamy", t:`이제 할 일을 하러 가 볼까?\n「${fill(q.label)}」`}] : [])], (C().season === "winter" && P[k].bgW) || p.bg, null, false); }
  }, 350); };
  if(pts) walk(pts, arrive); else arrive();
}

/* ---------- 대사 엔진 ---------- */
let Q = [], qi = 0, curBg = "", curStage = null, isQuest = false, typing = null, waitMini = false;
function anneKey(f){
  const set = (C() && C().anne) || "anne";
  if(!f) return null; if(f.includes("_") || !ANNE_FACES.anne.includes(f)) return f;
  const ok = ANNE_FACES[set] || ANNE_FACES.anne; const g = ok.includes(f) ? f : (f === "surprised" ? "happy" : f === "angry" ? "sad" : "happy");
  return `${set}_${g}`;
}
const norm = n => Array.isArray(n) ? Object.assign({w:n[0], f:n[1], o:n[2], t:n[3]}, n[4] || {}) : n;
function playScene(nodes, bg, stage, quest){ Q = nodes.map(norm); qi = 0; curBg = bg; curStage = stage; isQuest = quest; setBg(bg); show("place"); step(); }
function setBg(k){ const el = $("bg"); el.style.backgroundImage = k ? `url(${IMG(k)})` : "none"; }
function step(){
  $("duel").classList.remove("on");
  const n = Q[qi]; if(!n){ endScene(); return; }
  if(n.do){ n.do(); qi++; step(); return; }
  if(n.when && !n.when()){ qi++; step(); return; }
  if(n.eff && !n.opts){ eff(n.eff); saveS(); qi++; step(); return; }
  if(n.bg && n.t === undefined && !n.opts && !n.name){ curBg = n.bg; qi++; step(); return; }
  if(n.mini){ runMini(n); return; }
  if(n.duel){ runDuel(n); return; }
  if(n.bg) curBg = n.bg;
  const still = n.still || null;
  setBg(still || curBg);
  $("place").classList.toggle("dream", !!n.dream);
  stage(curStage);
  const sp = n.w === "anne" || n.w === "inner", nar = n.w === "nar" || !n.w;
  setSpr($("sL"), still ? null : anneKey(n.f), !sp && !nar); setSpr($("sR"), still ? null : n.o, sp);
  $("place").classList.toggle("solo", !still && !!n.f && !n.o && !curStage);
  const who = $("who"), nm = n.as || WHO[n.w];
  who.className = "who " + (HEARTS[n.w] || n.w === "inner" ? n.w : n.w === "anne" ? "" : "other"); who.textContent = nm == null ? n.w : nm;
  $("ch").innerHTML = ""; $("nx").hidden = false;
  if(n.opts) return choice(n);
  if(n.name) return naming(n);
  typeText(fill(n.t));
  if(!S.tips.talk){ $("nx").textContent = "▼ 화면을 누르면 다음 이야기"; $("nx").classList.add("tip"); }
}
function choice(n){
  const who = $("who"); who.className = "who sys"; who.textContent = n.lab || "선택의 순간"; $("txt").textContent = fill(n.q); $("nx").hidden = true;
  $("ch").innerHTML = `<div class="opts">${n.opts.map((o, i) => `<button data-i="${i}">${esc(fill(o.t))}</button>`).join("")}</div>`;
  $("ch").querySelectorAll("button").forEach(b => b.onclick = e => { e.stopPropagation(); const o = n.opts[+b.dataset.i];
    if(o.type){ S.tally[o.type]++; note({canon:"📖 원작 속 앤과 같은 선택이에요", imag:"✨ 상상의 날개를 펼쳤어요", bal:"⚖️ 따뜻한 선택이에요"}[o.type]); }
    eff(o.eff); Q = (o.then || []).map(norm).concat(Q.slice(qi + 1)); qi = 0; saveS(); step(); });
}
function naming(n){
  const who = $("who"); who.className = "who sys"; who.textContent = "이름 짓기"; $("txt").textContent = fill(n.q); $("nx").hidden = true;
  $("ch").innerHTML = `<div class="opts">${n.pick.map(o => `<button data-v="${esc(o)}">${esc(o)}</button>`).join("")}</div>
    <div class="namein"><input id="nmIn" maxlength="14" placeholder="직접 지어도 돼요" aria-label="직접 지을 이름"><button id="nmOk">짓기</button></div>`;
  const done = v => { v = v.replace(/[<>]/g, "").trim().slice(0, 14); if(!v) return; S.names[n.name] = v; const same = v === n.pick[0];
    S.tally[same ? "canon" : "imag"]++; note(same ? "📖 원작과 똑같은 이름이에요" : "✍️ 나만의 이름이 생겼어요 · 지도에 이름이 붙어요"); if(n.after) n.after(v); saveS(); qi++; step(); };
  $("ch").querySelectorAll("button[data-v]").forEach(b => b.onclick = e => { e.stopPropagation(); done(b.dataset.v); });
  $("nmOk").onclick = e => { e.stopPropagation(); done($("nmIn").value); };
  $("nmIn").onclick = e => e.stopPropagation(); $("nmIn").onkeydown = e => { if(e.key === "Enter") done($("nmIn").value); };
}
function typeText(t){ const el = $("txt"); clearInterval(typing); let i = 0; el.textContent = ""; el.dataset.full = t;
  typing = setInterval(() => { el.textContent = t.slice(0, ++i); if(i >= t.length){ clearInterval(typing); typing = null; } }, 30); }
function stage(st){ const L = $("sL").style, R = $("sR").style;
  if(st && innerWidth > innerHeight){ L.left = st.l[0] + "%"; L.bottom = st.l[1] + "%"; L.height = st.l[2] + "%"; R.left = st.r[0] + "%"; R.right = "auto"; R.bottom = st.r[1] + "%"; R.height = st.r[2] + "%"; }
  else ["left", "bottom", "height", "right"].forEach(k => { L[k] = ""; R[k] = ""; }); }
function setSpr(img, k, dim){ if(!k){ img.classList.add("off"); return; } img.onerror = () => img.classList.add("off"); img.src = IMG(k); img.classList.remove("off"); img.classList.toggle("dim", !!dim); }
function advance(){ if(!S.tips.talk && qi >= 2){ S.tips.talk = true; $("nx").textContent = "▼"; $("nx").classList.remove("tip"); saveS(); } const n = Q[qi]; if(!n || n.opts || n.name || n.mini || n.duel || $("pop").classList.contains("on")) return;
  if(typing){ clearInterval(typing); typing = null; $("txt").textContent = $("txt").dataset.full; return; } qi++; step(); }

function endScene(){
  if(!isQuest){ show("map"); drawMap(); return; }
  isQuest = false; S.qi++; saveS();
  if(S.qi >= C().quests.length){ chapterEnd(); return; }
  show("map"); drawMap(); setTimeout(() => note(`📒 새 할 일: ${fill(quest().label)}`), 300);
}

/* ---------- 미니게임 연결 ---------- */
function runMini(n){
  const m = n.mini; show("mini"); $("hudT").textContent = "미니게임 · " + m.title;
  const mini = $("mini"); mini.style.backgroundImage = m.bg === false ? "none" : `url(${IMG(m.bg || curBg)})`; mini.classList.toggle("roll", !!m.roll);
  $("field").innerHTML = ""; $("mh").textContent = "";
  let rollOn = !!m.roll, rx = 0, last = 0;
  const roll = t => { if(!rollOn) return; if(last && !PORTRAIT.matches && !$("pop").classList.contains("on")) rx -= (t - last) * .09; last = t; $("road").style.backgroundPositionX = rx + "px"; requestAnimationFrame(roll); };
  if(rollOn) requestAnimationFrame(roll);
  popCard(`<span class="lab">미니게임</span><h2>${esc(m.title)}</h2><p>${esc(m.how)}</p><button class="big-btn sub" id="pOk">시작!</button>`, () => {
    MINI[m.kind](m, {
      hud: t => { $("mh").textContent = t; }, field: $("field"),
      end: (st, msg) => {
        $("field").innerHTML = ""; rollOn = false; mini.classList.remove("roll");
        st = Math.max(1, Math.min(3, st)); const id = m.id || ("m" + S.ch + "_" + S.qi); S.stars[id] = Math.max(S.stars[id] || 0, st); saveS();
        const line = (m.res && m.res[st]) || msg || "";
        popCard(`<span class="lab">미니게임 끝</span><h2>${"⭐".repeat(st)}${"☆".repeat(3 - st)}</h2>${msg && m.res ? `<p>${esc(msg)}</p>` : ""}<p>${esc(line)}</p><button class="big-btn sub" id="pOk">이야기 계속하기</button>`, () => {
          hudTitle(); const add = st >= 2 ? n.good : n.bad; if(n.eff2 && st >= 2) eff(n.eff2);
          Q = (add || []).map(norm).concat(Q.slice(qi + 1)); qi = 0; show("place"); step(); });
      }});
  });
}

/* ---------- 마음 대결 ---------- */
function runDuel(n){
  const d = n.duel; if(!d._s) d._s = {melt:0, turn:0, used:[]};
  const s = d._s, need = d.need || 5;
  $("duel").classList.add("on"); $("duelN").textContent = `${WHO[d.who]}의 마음`; $("duelBar").style.width = (s.melt / need * 100) + "%";
  setBg(curBg); stage(curStage); setSpr($("sL"), anneKey(d.f || "sad"), true); setSpr($("sR"), d.o, false);
  const who = $("who"); who.className = "who " + (HEARTS[d.who] ? d.who : "other"); who.textContent = WHO[d.who]; $("nx").hidden = true;
  $("txt").textContent = fill(s.turn === 0 ? d.open : s.last);
  const left = d.cards.filter((c, i) => !s.used.includes(i));
  $("ch").innerHTML = `<div class="opts">${d.cards.map((c, i) => s.used.includes(i) ? "" : `<button data-i="${i}"><small>${esc(c.k)}</small>${esc(c.t)}</button>`).join("")}</div>`;
  $("ch").querySelectorAll("button").forEach(b => b.onclick = e => { e.stopPropagation(); const i = +b.dataset.i, c = d.cards[i];
    s.used.push(i); s.turn++; s.melt = Math.max(0, Math.min(need, s.melt + (c.d || 0))); s.last = c.r;
    $("duelBar").style.width = (s.melt / need * 100) + "%";
    if((c.d || 0) < 0 && d.hint) setTimeout(() => note("💡 " + d.hint), 1200);
    const after = [];
    after.push({w:"anne", f:c.f || "happy", o:d.o, t:c.say || c.t});
    if(s.melt >= need && !d.never){ after.push({w:d.who, f:"happy", o:d.o, t:c.r}); after.push(...d.win.map(norm)); d._s = null; }
    else if(s.turn >= (d.turns || 4) || s.used.length >= d.cards.length){
      after.push({w:d.who, f:"sad", o:d.o, t:c.r});
      const id = d.id || ("d" + S.ch); S.fail[id] = (S.fail[id] || 0) + 1; d._s = null;
      if(d.never || S.fail[id] >= 2) after.push(...(d.lose || d.win).map(norm));
      else { after.push({w:"inner", f:"sad", t:"마음이 아직 꽁꽁 얼어 있어.\n다른 말을 골라서 다시 해 보자."}, {do:() => note("💡 " + (d.hint || "상대의 마음을 생각해 봐요"))}, n); }
      saveS();
    } else after.push({w:d.who, f:"sad", o:d.o, t:c.r}, n);
    Q = after.map(norm).concat(Q.slice(qi + 1)); qi = 0; step();
  });
}

/* ---------- 장 시작·끝 ---------- */
function chapterIntro(){
  const c = C(); hudTitle(); music(); toastQ.length = 0;
  popCard(`<img class="big" src="${IMG(c.img)}" alt="" onerror="this.style.visibility='hidden'"><span class="lab">${S.ch}장 · ${esc(c.when)}</span><h2>${esc(c.title)}</h2><p>${esc(c.intro)}</p>
    <button class="big-btn" id="pOk">지도로 가기</button>`, () => { show("map"); drawMap(); setTimeout(() => note(`📒 할 일: ${fill(quest().label)}`), 500); }, true);
}
function endingOf(t){ return t.canon >= t.imag && t.canon >= t.bal ? (t.canon > t.imag && t.canon > t.bal ? "canon" : t.imag === t.canon ? "imag" : "bal") : t.imag > t.bal ? "imag" : "bal"; }
function chapterEnd(){
  const c = C(), t = S.tally, e = endingOf(t), E = c.end[e];
  S.res[S.ch] = {e, title:E[0], t:{...t}}; S.seen[S.ch + "_" + e] = true; saveS();
  const got = (S.got[S.ch] || []).map(x => x[0] === "@" ? `<img src="${IMG("sc_" + x.slice(1))}" alt="" title="${esc(HID[x.slice(1)] || "숨은 장면")}" class="sc" onerror="this.replaceWith(Object.assign(document.createElement('span'),{className:'sc nopic',textContent:'✨'}))">` : ITEMS[x] ? `<img src="${IMG(ITEMS[x].img)}" alt="" title="${esc(ITEMS[x].name)}" onerror="this.style.display='none'">` : "").join("");
  const hidAll = countHidden(c), hidGot = S.hidden.filter(h => hidAll.includes(h)).length;
  const stars = Object.entries(S.stars).filter(([k]) => (c.minis || []).includes(k)).map(([, v]) => v);
  const names = (c.names || []).map(k => S.names[k]).filter(Boolean);
  const k = c.who || "matthew", hn = S.hearts[k] || 0;
  popCard(`<img class="big" src="${IMG(`ed_ch${S.ch}_${e}`)}" alt="" onerror="this.style.visibility='hidden'">
    <span class="lab">${{canon:"원작 결말", imag:"상상 결말", bal:"균형 결말"}[e]}</span><h2>${esc(E[0])}</h2><p>${esc(E[1])}</p>
    <dl class="sum"><dt>📖 원작 · ✨ 상상 · ⚖️ 균형</dt><dd>${t.canon} · ${t.imag} · ${t.bal}</dd>
    ${names.length ? `<dt>✍️ 내가 지은 이름</dt><dd>${names.map(esc).join(", ")}</dd>` : ""}
    <dt>💗 ${HEARTS[k]}</dt><dd style="color:#d9645c">${"♥".repeat(hn)}${"♡".repeat(5 - hn)}</dd>
    ${stars.length ? `<dt>⭐ 미니게임</dt><dd>${stars.map(v => "⭐".repeat(v)).join(" · ")}</dd>` : ""}
    ${hidAll.length ? `<dt>✨ 숨은 장면</dt><dd>${hidGot}/${hidAll.length}</dd>` : ""}</dl>
    ${got ? `<div class="gotrow"><span>이번 장에서 모은 것</span><div>${got}</div></div>` : ""}
    <p style="font-size:14px">${esc(c.teaser)}</p>
    <div class="btns"><button class="big-btn" id="pOk">${S.ch < 10 ? "다음 장으로" : "이야기를 마치며"}</button><button class="big-btn ghost" id="pAl">앨범</button></div>`, () => {
      if(S.ch >= 10){ finale(); return; }
      S.ch++; S.qi = 0; S.max = Math.max(S.max, S.ch); S.tally = {canon:0, imag:0, bal:0}; saveS(); chapterIntro(); }, true);
  $("pAl").onclick = () => album(S.ch);
}
function countHidden(c){ const out = []; const walk = a => (a || []).forEach(n => { if(!n || typeof n !== "object") return; if(Array.isArray(n)){ if(n[4]) walk([n[4]]); return; }
  if(n.eff && n.eff.hid) out.push(n.eff.hid); if(n.hid) out.push(n.hid); (n.opts || []).forEach(o => { if(o.eff && o.eff.hid) out.push(o.eff.hid); walk(o.then); });
  walk(n.good); walk(n.bad); if(n.duel){ walk(n.duel.win); walk(n.duel.lose); } });
  c.quests.forEach(q => walk(q.nodes)); return [...new Set(out)]; }
function finale(){
  S.over = true; saveS();
  const ends = CH.slice(1).map((c, i) => S.res[i + 1] ? `<dt>${i + 1}장</dt><dd>${esc(S.res[i + 1].title)}</dd>` : "").join("");
  const total = Object.values(S.stars).reduce((a, b) => a + b, 0), hid = S.hidden.length, all = CH.slice(1).reduce((a, c) => a + countHidden(c).length, 0);
  const named = Object.entries(S.names).map(([k, v]) => `${esc(v)}`).join(", ");
  const tl = Object.values(S.res).reduce((a, r) => (a[r.e]++, a), {canon:0, imag:0, bal:0}), big = endingOf(tl);
  const word = {canon:"원작 속 앤의 마음을 가장 잘 읽은 친구예요.", imag:"앤처럼 상상력으로 세상을 반짝이게 만든 친구예요.", bal:"모두의 마음을 함께 생각한 따뜻한 친구예요."}[big];
  popCard(`<img class="big" src="${IMG("ed_ch10_" + big)}" alt="" onerror="this.style.visibility='hidden'"><span class="lab">이야기 끝</span><h2>앤과 함께한 한 해</h2>
    <p>${word}<br>"하느님은 하늘에 계시고, 세상은 모두 평안하도다."</p>
    <dl class="sum">${ends}<dt>✍️ 이름 지은 곳</dt><dd>${named || "-"}</dd><dt>⭐ 모은 별</dt><dd>${total}개</dd><dt>✨ 숨은 장면</dt><dd>${hid}/${all}</dd><dt>📗 자연 도감</dt><dd>${Object.keys(S.nat || {}).length}/${NATURE.length}</dd></dl>
    <div class="btns"><button class="big-btn sub" id="pOk">지도에서 마음껏 놀기</button><button class="big-btn ghost" id="pRe">처음부터</button></div>`, () => { show("map"); drawMap(); }, true);
  $("pRe").onclick = restart;
}
function restart(){ S = FRESH(); saveS(); closeCard(); location.reload(); }

/* ---------- 가방·장 고르기 ---------- */
function bag(){
  const its = S.items.map(k => ITEMS[k] ? `<div><img src="${IMG(ITEMS[k].img)}" alt="" onerror="this.style.visibility='hidden'">${esc(ITEMS[k].name)}</div>` : "").join("");
  const hs = Object.keys(HEARTS).filter(k => S.met[k]).map(k => `<dt>${HEARTS[k]}</dt><dd style="color:#d9645c">${"♥".repeat(S.hearts[k] || 0)}${"♡".repeat(5 - (S.hearts[k] || 0))}</dd>`).join("");
  popCard(`<h2>🎒 앤의 가방</h2>${its ? `<div class="bag">${its}</div>` : "<p>아직 비어 있어요.</p>"}${hs ? `<h2 style="font-size:20px">💗 마음</h2><dl class="sum">${hs}</dl>` : ""}
    <div class="btns"><button class="big-btn ghost" id="pAl">나의 앨범</button><button class="big-btn sub" id="pOk">닫기</button></div>`);
  $("pAl").onclick = () => { closeCard(); album(); };
}

/* ---------- 나의 앨범: 결말 그림과 숨은 장면 ---------- */
const HID = {cherry:"벚나무 위 대리석 궁전", mirror:"노을 거울 연못", castle:"탑이 일곱 개인 성",
  sunsetHair:"노을빛 머리의 노래", curse:"빨간 머리 마녀의 저주", quietHurt:"떨리는 목소리", rehearsal:"매슈 아저씨의 린드 부인 연기", biggerPerson:"더 큰 사람",
  flowerQueen:"들꽃 나라의 여왕", askFirst:"다음엔 먼저 여쭤볼게요", withE:"끝에 e가 붙는 앤", cordelia:"다시 나타난 코델리아", lilyCrown:"참나리 왕관의 맹세", pinky:"새끼손가락 약속", starSisters:"같은 별에서 온 자매", treasure:"우정의 보석 상자",
  rival:"1등을 걸고", knight:"길버트 경의 전설", fair:"만나 보고 판단하기", dragon:"불을 뿜는 용", sayIt:"\"당장 사과해!\"", glassWall:"보이지 않는 유리벽", returned:"돌려준 하트 사탕", needTime:"아직은 시간이 필요해", starQuest:"별 백 개의 시험",
  careful:"꼼꼼한 안주인", banquet:"여왕의 연회장", appleFace:"얼굴 그린 사과", rubyPotion:"마법의 루비 물약", oddTaste:"어딘가 이상한 맛", factsOnly:"있는 그대로", silence:"백 일의 침묵", mailbox:"통나무 다리 비밀 우체통", pebble:"이름 새긴 조약돌",
  rescueTeam:"겨울밤 구조대", braveTale:"용감한 공주 이야기", teamwork:"셋이 나눈 일",
  farewellTragedy:"비극의 작별 연설", dryadScarf:"요정의 무지개 스카프", lessonLearned:"다음엔 꼭 냄새부터",
  magicPotion:"까마귀 물약", testStrand:"한 가닥 먼저 시험", spaRumor:"샘물 요정의 장난", ravenPrincess:"까마귀 머리 공주",
  sunsetElaine:"노을빛 일레인", ladyOfLake:"호수의 여인", lancelotHorse:"백마 탄 랜슬롯",
  restMatthew:"\"오늘은 제가 몰게요\"", starLetter:"별에게 쓴 편지", namedMap:"이름 지은 길들의 지도"};
let alCh = 1;
function album(ch){
  const tot = {e:0, eg:0, h:0, hg:0};
  CH.slice(1).forEach((c, i) => { tot.e += 3; tot.eg += ["canon", "imag", "bal"].filter(e => S.seen[(i + 1) + "_" + e]).length; const hs = countHidden(c); tot.h += hs.length; tot.hg += hs.filter(h => S.hidden.includes(h)).length; });
  $("alCount").textContent = `결말 ${tot.eg}/${tot.e} · 숨은 장면 ${tot.hg}/${tot.h}`;
  alCh = ch || alCh || S.ch;
  $("alTabs").innerHTML = CH.slice(1).map((c, i) => `<button data-n="${i + 1}" class="${i + 1 === alCh ? "on" : ""}" ${i + 1 > S.max && !S.over ? "disabled" : ""}>${i + 1}장</button>`).join("");
  $("alTabs").querySelectorAll("button").forEach(b => b.onclick = () => album(+b.dataset.n));
  const c = CH[alCh], L = {canon:"원작 결말", imag:"상상 결말", bal:"균형 결말"};
  const ends = ["canon", "imag", "bal"].map(e => { const ok = S.seen[alCh + "_" + e];
    return `<button class="al-it ${ok ? "" : "lock"}" ${ok ? `data-img="ed_ch${alCh}_${e}" data-cap="${esc(L[e] + " · " + c.end[e][0])}"` : ""}>${ok ? `<img src="${IMG(`ed_ch${alCh}_${e}`)}" alt="" onerror="this.style.visibility='hidden'">` : "<i>?</i>"}<b>${L[e]}</b><span>${ok ? esc(c.end[e][0]) : "아직 못 봤어요"}</span></button>`; }).join("");
  const hids = countHidden(c).map(h => { const ok = S.hidden.includes(h);
    return `<button class="al-it ${ok ? "" : "lock"}" ${ok ? `data-img="sc_${h}" data-cap="${esc(HID[h] || "숨은 장면")}"` : ""}>${ok ? `<img src="${IMG("sc_" + h)}" alt="" onerror="this.replaceWith(Object.assign(document.createElement('i'),{textContent:'✨'}))">` : "<i>?</i>"}<b>숨은 장면</b><span>${ok ? esc(HID[h] || "") : "상상의 길을 골라 보세요"}</span></button>`; }).join("");
  $("alBody").innerHTML = `<h3>${alCh}장 · ${esc(c.title)}</h3><div class="al-grid">${ends}${hids}</div>`;
  $("alBody").querySelectorAll(".al-it[data-img]").forEach(b => b.onclick = () => { $("alImg").src = IMG(b.dataset.img); $("alImg").onerror = () => { $("alImg").removeAttribute("src"); }; $("alCap").textContent = b.dataset.cap; $("alView").classList.add("on"); });
  $("album").classList.add("on");
}

function chapterPick(){
  const list = CH.slice(1).map((c, i) => `<button data-n="${i + 1}" ${i + 1 > S.max ? "disabled" : ""}><b>${i + 1}장 · ${esc(c.title)}</b>${S.res[i + 1] ? esc(S.res[i + 1].title) : i + 1 > S.max ? "아직 못 가요" : "하는 중"}</button>`).join("");
  popCard(`<h2>장 고르기</h2><p>지난 장을 다시 할 수 있어요. 이름·가방·마음은 그대로 남아요.</p><div class="chlist">${list}</div><button class="big-btn ghost" id="pOk">닫기</button>`);
  document.querySelectorAll(".chlist button").forEach(b => b.onclick = () => { S.ch = +b.dataset.n; S.qi = 0; S.tally = {canon:0, imag:0, bal:0}; S.at = C().quests[0].at; saveS(); closeCard(); $("cover").classList.remove("on"); chapterIntro(); });
}

/* ---------- 음악 ---------- */
let bgm = null, bgmSrc = "", musicOn = true;
async function music(){
  const src = (C() && C().bgm) || "bgm_ch1.mp3"; if(!musicOn) return;
  try{ if(bgm && bgmSrc !== src){ bgm.pause(); bgm = null; }
    if(!bgm){ bgmSrc = src; bgm = new Audio(src); bgm.loop = true; bgm.volume = .35; } await bgm.play(); }catch(e){}
}

/* ---------- 시작 ---------- */
/* 화면 높이 맞추기: 휴대폰에서 껐다 켜거나 돌렸을 때 위에 빈 띠가 생기지 않게 */
function fitScreen(){ const h = (window.visualViewport && visualViewport.height) || innerHeight;
  document.documentElement.style.setProperty("--vh", Math.round(h) + "px"); if(scrollY || scrollX) scrollTo(0, 0); }
["resize", "orientationchange", "pageshow", "focus"].forEach(ev => addEventListener(ev, () => { fitScreen(); setTimeout(fitScreen, 300); }));
document.addEventListener("visibilitychange", () => { if(!document.hidden){ fitScreen(); setTimeout(fitScreen, 300); } });
if(window.visualViewport) visualViewport.addEventListener("resize", fitScreen);
fitScreen();
const GAME = {boot(){
  $("cover").querySelector(".cv-petals").innerHTML = Array.from({length:14}, () => `<i style="left:${Math.random() * 110 | 0}%;animation-duration:${7 + Math.random() * 7}s;animation-delay:-${Math.random() * 12}s"></i>`).join("");
  $("box").onclick = advance;
  $("place").onclick = e => { if(e.target === $("bg") || e.target.classList.contains("spr")) advance(); };
  $("bMusic").onclick = () => { musicOn = !musicOn; $("bMusic").style.opacity = musicOn ? 1 : .45; if(musicOn) music(); else if(bgm) bgm.pause(); };
  $("bMap").onclick = () => { clearInterval(typing); if(isQuest){ isQuest = false; } show("map"); drawMap(); };
  $("bBag").onclick = bag;
  $("bBook").onclick = () => natureBook();
  $("bkClose").onclick = () => $("book").classList.remove("on");
  $("alClose").onclick = () => $("album").classList.remove("on");
  $("alView").onclick = () => $("alView").classList.remove("on");
  const started = S.qi > 0 || S.ch > 1 || S.over;
  if(started){ $("bStart").textContent = "이어서 하기";
    $("coverMore").innerHTML = `<button id="bAlbum">나의 앨범</button><button id="bNat">자연 도감</button><button id="bPick">장 고르기</button><button id="bNew">처음부터</button>`;
    $("bAlbum").onclick = () => album(1); $("bNat").onclick = () => natureBook();
    $("bPick").onclick = chapterPick; $("bNew").onclick = () => { if(confirmNew()) restart(); }; }
  $("bStart").onclick = () => { $("cover").classList.remove("on"); hud();
    if(!started){ chapterIntro(); return; }
    // 장의 할 일을 다 끝내고 '다음 장으로'를 누르기 전에 나갔으면, 장 끝 화면부터 다시 보여 줌
    if(!S.over && S.qi >= C().quests.length){ music(); chapterEnd(); return; }
    note(`${S.ch}장 · ${C().title}에서 이어서 해요`);
    music(); show("map"); drawMap(); };
  if(location.hash === "#test") window.__S = () => S;
}};
function confirmNew(){ return true; }

/* ---------- 장 데이터 모양 ----------
CH[n] = {
  title, when:"초여름", season:"spring|summer|autumn|winter", img:"장 시작 그림", bgm:"bgm_chN.mp3", walker:"지도 위를 걷는 꼬마 앤 그림(없으면 walk_anne)",
  anne:"anne|anne_short|anne_grow", who:"하트를 보여 줄 인물",
  intro:"장 시작 카드 글", teaser:"장 끝 다음 이야기 예고",
  end:{canon:["제목","설명"], imag:[...], bal:[...]},   // 결말 그림은 img/ed_chN_canon|imag|bal.webp
  names:["이 장에서 이름 짓는 장소 key"], minis:["이 장 미니게임 id"],
  quests:[{at:"장소 key", label:"할 일", bg:"배경", walker:"걷는 앤", lock:{only|except:[장소], why:"잠긴 이유"}, stage:{l:[x,바닥,키], r:[...]}, nodes:[...]}]
}
대사 노드: [말하는사람, 앤표정, 오른쪽인물그림, "대사", {덧붙임}]   예) ["marilla","sad","marilla_strict","앤, 방으로 올라가거라."]
  앤 표정은 happy|dreamy|surprised|sad|angry (장의 anne 그림 묶음에 맞춰 바뀜)
  덧붙임: still(장면 그림), bg(배경 바꾸기), dream(상상 장면), as(이름표 바꾸기)
선택: {q, opts:[{t, type:"canon|imag|bal", eff:{h:{marilla:1}, get:"auburn", hid:"id"}, then:[노드...]}]}
이름 짓기: {name:"장소key", q, pick:["원작 이름", ...]}
효과만: {eff:{...}}
미니게임: {mini:{kind, title, how, id, ...}, good:[2별 이상일 때 노드], bad:[1별일 때 노드]}
마음 대결: {duel:{who, o, f, need, turns, open, hint, cards:[{k:"사과", t, say, d, r}], win:[...], lose:[...], never:false}}
*/
