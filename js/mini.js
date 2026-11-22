/* 미니게임 모음. 엔진이 MINI[kind](설정, api) 로 부른다.
   api.hud(글), api.field(놀이판 div), api.end(별 1~3, 한 줄 결과)
   그림이 없으면 이모지로 대신 보여 준다(e). 세로 화면 안내가 뜨면 시간이 멈춘다. */
const MINI = {};
const rnd = (a, b) => a + Math.random() * (b - a);
const shuffle = a => { a = a.slice(); for(let i = a.length - 1; i > 0; i--){ const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };
const look = t => t.img ? `<img src="${IMG(t.img)}" alt="" onerror="this.replaceWith(document.createTextNode('${t.e || "✿"}'))">` : (t.e || "✿");
const FAST = /fast/.test(location.hash) ? 6 : 1;  // 시험용: 주소 끝에 #fast
function every(ms, fn){ const h = setInterval(() => { if(!PORTRAIT.matches) fn(); }, ms / FAST); return () => clearInterval(h); }
function panel(api, html){ api.field.innerHTML = `<div class="mpanel">${html}</div>`; return api.field.firstElementChild; }
function popAt(api, x, y, txt){ const p = document.createElement("div"); p.className = "pop"; p.textContent = txt;
  p.style.left = Math.min(innerWidth - 180, Math.max(8, x - 40)) + "px"; p.style.top = y + "px"; api.field.appendChild(p); setTimeout(() => p.remove(), 1200); }

/* 날아오는 것 잡기: items:[{img|e, say}], time, goal:[2별,3별] */
MINI.catch = (m, api) => {
  let got = 0, left = m.time || 20; const g = m.goal || [5, 10];
  const msg = () => api.hud(`${m.say || "예쁜 것을 톡!"} · ${left}초 · ${got}개`); msg();
  const stopS = every(m.every || 900, () => {
    const t = m.items[Math.random() * m.items.length | 0], d = document.createElement("div"); d.className = "thing"; d.style.zIndex = 5;
    d.style.left = "100vw"; d.style.top = rnd(...(m.top || [14, 64])) + "%"; d.style.animationDuration = rnd(4.2, 6.8) + "s"; d.innerHTML = look(t);
    d.onclick = e => { e.stopPropagation(); if(t.bad){ got = Math.max(0, got - 1); popAt(api, e.clientX, e.clientY, t.say || "앗!"); }
      else { got++; popAt(api, e.clientX, e.clientY, t.say || "찾았다!"); } d.remove(); msg(); };
    d.addEventListener("animationend", () => d.remove()); api.field.appendChild(d);
  });
  const stopT = every(1000, () => { left--; msg(); if(left <= 0){ stopS(); stopT(); api.end(got >= g[1] ? 3 : got >= g[0] ? 2 : 1, `${got}개를 찾았어요!`); } });
};

/* 화 꾹 참기: 날아오는 말을 눌러 흘려보낸다. 앤에게 닿으면 화 게이지가 오른다. words:[] */
MINI.calm = (m, api) => {
  // flood:true 이면 마지막에 말이 쏟아져 결국 "펑!" 터진다(원작대로). 별은 앞부분에서 참은 만큼.
  let anger = 0, peak = 0, sent = 0, left = m.words.length, phase = 1; const f = api.field;
  f.innerHTML = `<div class="mpanel" style="top:auto;bottom:4%;transform:translateX(-50%);padding:8px 14px"><b>${m.gauge || "화 게이지"}</b><div class="meter"><i id="cg" style="width:0"></i></div></div>`;
  const msg = () => api.hud(phase === 2 ? (m.floodSay || "말이 쏟아져요!") : `${m.say || "말을 눌러 흘려보내요!"} · 남은 말 ${left}`); msg();
  const words = shuffle(m.words); let i = 0, over = false, stopF = () => {};
  const bar = () => { const cg = $("cg"); if(cg) cg.style.width = anger + "%"; };
  const bubble = (w, dur) => { const d = document.createElement("div");
    d.className = "thing"; d.style.cssText = `left:100vw;top:${rnd(14, 58)}%;width:auto;height:auto;font-size:18px;font-family:'Jua',sans-serif;font-weight:700;background:#fff;border:2px solid #d9645c;border-radius:14px;padding:6px 12px;white-space:nowrap;animation-duration:${dur}s`;
    d.textContent = w;
    d.onclick = e => { e.stopPropagation(); popAt(api, e.clientX, e.clientY, phase === 2 ? "너무 많아!" : (m.ok || "후—")); d.remove(); if(phase === 1){ sent++; left--; msg(); if(left <= 0) next(); } };
    d.addEventListener("animationend", () => { d.remove(); anger = Math.min(100, anger + (phase === 2 ? 14 : (m.hit || 30))); if(phase === 1){ peak = Math.max(peak, anger); left--; } bar(); msg();
      if(anger >= 100) boom(); else if(phase === 1 && left <= 0) next(); });
    f.appendChild(d); };
  const stars = () => phase === 1 && anger >= 100 && !m.flood ? 1 : peak < 45 ? 3 : peak < 100 ? 2 : 1;
  const finish = text => { if(over) return; over = true; stopS(); stopD(); stopF(); setTimeout(() => api.end(stars(), text), 900); };
  const next = () => { if(!m.flood){ finish(`${sent}개의 말을 흘려보냈어요.`); return; }
    if(phase === 2) return; phase = 2; stopS(); msg();
    const flood = shuffle((m.floodWords || m.words).concat(m.floodWords || m.words)); let k = 0;
    stopF = every(230, () => { if(k < flood.length){ bubble(flood[k++], rnd(2.2, 3)); anger = Math.min(99, anger + 4); bar(); } else if(k++ > flood.length + 6) boom(); }); };
  const boom = () => { if(over) return;
    if(m.flood && phase === 1){ next(); return; }
    anger = 100; bar(); f.querySelectorAll(".thing").forEach(t => t.remove());
    const mini = $("mini"); mini.classList.remove("boom"); void mini.offsetWidth; mini.classList.add("boom");
    f.insertAdjacentHTML("beforeend", `<div class="boomtxt">${esc(m.boomWord || "펑!")}</div>`);
    finish(m.flood ? `${m.boom || "결국 화가 터져 버렸어요."} 그래도 앞에서 ${sent}개의 말을 꾹 참았어요.` : (m.boom || "펑! 참지 못했어요.")); };
  const stopS = every(m.every || 1500, () => { if(i < words.length) bubble(words[i++], rnd(4.5, 5.5)); });
  const stopD = every(400, () => { if(over || phase === 2) return; anger = Math.max(0, anger - 1); bar(); });
};

/* 순서 맞추기: q, steps:[맞는 순서], decoys:[끼어든 엉뚱한 말] (누르면 틀린 것) */
MINI.order = (m, api) => {
  let k = 0, miss = 0; const p = panel(api, `<h3>${esc(m.q)}</h3><div class="built" id="ob"></div><div class="chips" id="oc"></div>`);
  api.hud(m.say || "알맞은 순서대로 눌러요");
  $("oc").innerHTML = shuffle(m.steps.map((s, i) => ({s, i})).concat((m.decoys || []).map(s => ({s, i:-1})))).map(o => `<button data-i="${o.i}">${esc(o.s)}</button>`).join("");
  p.querySelectorAll("#oc button").forEach(b => b.onclick = e => {
    if(+b.dataset.i < 0){ miss++; b.classList.add("no"); popAt(api, e.clientX - 40, e.clientY - 70, m.decoyNo || "그 말은 어울리지 않아요"); setTimeout(() => b.classList.add("used"), 450); return; }
    if(+b.dataset.i === k){ b.classList.add("used"); $("ob").insertAdjacentHTML("beforeend", `<span>${esc(m.steps[k])}</span>`); k++;
      if(k >= m.steps.length) setTimeout(() => api.end(miss === 0 ? 3 : miss <= 2 ? 2 : 1, miss === 0 ? "한 번에 다 맞혔어요!" : `${miss}번 헷갈렸지만 해냈어요.`), 500); }
    else { miss++; b.classList.add("no"); setTimeout(() => b.classList.remove("no"), 400); }
  });
};

/* 고르기(여러 판): rounds:[{q, opts:[{t, img|e, ok}], yes, no}], rival:{name, sec} 이 있으면 대결 */
MINI.pick = (m, api) => {
  let r = 0, me = 0, them = 0, stopR = null; const rounds = typeof m.rounds === "function" ? m.rounds() : m.rounds; m = Object.assign({}, m, {rounds});
  const draw = () => {
    if(stopR) stopR();
    if(r >= m.rounds.length){ const n = m.rounds.length;
      if(m.rival) return api.end(me > them ? 3 : me === them ? 2 : 1, `앤 ${me} : ${them} ${m.rival.name}`);
      return api.end(me >= n ? 3 : me >= Math.ceil(n / 2) ? 2 : 1, `${n}개 중 ${me}개를 맞혔어요.`); }
    const R = m.rounds[r];
    const p = panel(api, `${m.rival ? `<div class="score"><span>앤 ${me}</span><span>${esc(m.rival.name)} ${them}</span></div>` : ""}<h3>${esc(R.q)}</h3>
      <div class="chips">${shuffle(R.opts.map((o, i) => ({o, i}))).map(({o, i}) => `<button data-i="${i}">${o.img || o.e ? look(o) : ""}<span>${esc(o.t)}</span></button>`).join("")}</div>
      ${m.rival ? `<div class="rival"><i id="rv"></i></div>` : ""}`);
    api.hud(`${m.say || "알맞은 것을 골라요"} · ${r + 1}/${m.rounds.length}`);
    let done = false;
    const res = (ok, b, why) => { if(done) return; done = true; if(stopR) stopR();
      if(b) b.classList.add(ok ? "ok" : "no"); if(ok) me++; else if(m.rival && why !== "slow") them++;
      if(why === "slow") them++;
      const line = ok ? R.yes : R.no; if(line) popAt(api, innerWidth / 2 - 60, innerHeight * .2, line);
      setTimeout(() => { r++; draw(); }, line ? 1300 : 700); };
    p.querySelectorAll(".chips button").forEach(b => b.onclick = () => res(!!R.opts[+b.dataset.i].ok, b));
    if(m.rival){ let t = 0; const sec = (m.rival.sec || 7) * 10; stopR = every(100, () => { t++; const rv = $("rv"); if(rv) rv.style.width = (t / sec * 100) + "%"; if(t >= sec) res(false, null, "slow"); }); }
  };
  draw();
};

/* 숨은그림 찾기: 그림(bg) 속에 작고 흐리게 섞인 것들을 찾는다. 오른쪽에 찾을 것 목록.
   things:[{img|e, name, n}], fakes:[{img|e}] (목록에 없는 가짜, 누르면 -3초), time, size(화면 너비 %), hide(0~1 흐림 정도) */
MINI.find = (m, api) => {
  let left = m.time || 40, got = 0, over = false, hintUsed = false; const f = api.field;
  const total = m.things.reduce((a, t) => a + (t.n || 1), 0), sz = m.size || 4.2, hide = m.hide ?? .35;
  f.innerHTML = `<div class="hf-board" id="hb"></div><div class="hf-list"><b>찾을 것</b>${m.things.map((t, i) =>
      `<div class="hf-row" id="hr${i}">${look(t)}<span>${esc(t.name)}</span><em id="hc${i}">0/${t.n || 1}</em></div>`).join("")}
    <button class="hf-hint" id="hh" disabled>힌트 (20초 뒤)</button></div>`;
  const hb = $("hb"), cnt = m.things.map(() => 0), used = [];
  const spot = () => { for(let k = 0; k < 60; k++){ const x = 3 + Math.random() * 90, y = 16 + Math.random() * 74;
      if(used.every(([a, b]) => Math.hypot(a - x, (b - y) * .55) > sz * 1.5)){ used.push([x, y]); return [x, y]; } } return [Math.random() * 90, 20 + Math.random() * 70]; };
  const put = (t, cls) => { const [x, y] = spot(), d = document.createElement("div"); d.className = "hf-it " + cls; d.innerHTML = look(t);
    d.style.cssText = `left:${x}%;top:${y}%;width:max(${(sz * (0.8 + Math.random() * .45)).toFixed(2)}%, ${28 + Math.random() * 8 | 0}px);transform:translate(-50%,-50%) rotate(${(Math.random() * 70 - 35) | 0}deg) scaleX(${Math.random() < .5 ? -1 : 1});opacity:${(1 - hide * (0.6 + Math.random() * .6)).toFixed(2)}`;
    hb.appendChild(d); return d; };
  m.things.forEach((t, i) => { for(let k = 0; k < (t.n || 1); k++){ const d = put(t, "real"); d.onclick = e => { e.stopPropagation(); if(over || d.classList.contains("got")) return;
    d.classList.add("got"); got++; cnt[i]++; $("hc" + i).textContent = `${cnt[i]}/${t.n || 1}`; if(cnt[i] >= (t.n || 1)) $("hr" + i).classList.add("done");
    popAt(api, e.clientX - 30, e.clientY - 60, t.say || "찾았다!"); msg(); if(got >= total) done(); }; } });
  (m.fakes || []).forEach(t => { const d = put(t, "fake"); d.onclick = e => { e.stopPropagation(); if(over) return; left = Math.max(1, left - 3); d.classList.add("nope"); setTimeout(() => d.classList.remove("nope"), 500);
    popAt(api, e.clientX - 30, e.clientY - 60, "목록에 없어요! -3초"); msg(); }; });
  hb.onclick = e => { if(over) return; const r = document.createElement("span"); r.className = "hf-miss"; r.style.left = e.clientX + "px"; r.style.top = e.clientY + "px"; document.body.appendChild(r); setTimeout(() => r.remove(), 500); };
  $("hh").onclick = () => { if(hintUsed) return; hintUsed = true; $("hh").disabled = true; $("hh").textContent = "힌트 다 썼어요";
    const t = [...hb.querySelectorAll(".hf-it.real:not(.got)")][0]; if(t){ t.classList.add("hint"); setTimeout(() => t.classList.remove("hint"), 2500); } };
  const msg = () => api.hud(`${m.say || "숨은 것을 찾아요"} · ${left}초 · ${got}/${total}`); msg();
  const done = () => { if(over) return; over = true; stop(); hb.querySelectorAll(".hf-it.real:not(.got)").forEach(d => d.classList.add("show"));
    setTimeout(() => api.end(got >= total ? (hintUsed ? 2 : 3) : got >= total * .6 ? 2 : 1, `${total}개 중 ${got}개를 찾았어요.`), 1300); };
  const stop = every(1000, () => { left--; msg(); if(left === (m.time || 40) - 20 && !hintUsed){ $("hh").disabled = false; $("hh").textContent = "힌트 한 번"; } if(left <= 0) done(); });
};

/* 물 퍼내기: time, rise(처음 초당 %), grow(끝날 때 몇 배로 빨리 새는지), scoop(한 번에 퍼내는 %) */
MINI.bail = (m, api) => {
  let lv = 20, peak = 20, left = m.time || 20, over = false; const f = api.field;
  f.innerHTML = `<div class="water" id="wt" style="height:20%"></div><div class="mpanel" style="top:30%;background:rgba(255,251,242,.85)"><h3>${esc(m.q || "물을 퍼내요!")}</h3><button class="bigtap" id="bt">${esc(m.btn || "물 퍼내기")}</button></div>`;
  const msg = () => api.hud(`${m.say || "버텨요!"} · ${left}초 · 물 ${Math.round(lv)}%`); msg();
  $("bt").onclick = e => { e.stopPropagation(); lv = Math.max(0, lv - (m.scoop || 5)); };
  const stopW = every(100, () => { if(over) return; const T = m.time || 20; lv = Math.min(100, lv + (m.rise || 5) * (1 + (T - left) / T * ((m.grow || 1.8) - 1)) / 10); peak = Math.max(peak, lv); const w = $("wt"); if(w) w.style.height = lv + "%"; if(lv >= 100) done(); });
  const stopT = every(1000, () => { left--; msg(); if(left <= 0) done(); });
  const done = () => { if(over) return; over = true; stopW(); stopT(); api.end(lv >= 100 ? 1 : peak < 70 ? 3 : 2, lv >= 100 ? (m.sink || "앗, 물이 너무 많아요!") : "끝까지 버텼어요!"); };
};

/* 따르기: 크기가 다른 갈색 찻잔 3개에 빨간 주전자로 차례로 따른다. 꾹 누르면 주전자가 기울며 졸졸,
   손을 떼도 주둥이에 남은 몇 방울이 더 떨어진다(drip). 금빛 띠 안에서 멈추면 성공.
   cups:[{size(0.7~1.2), lo, hi, rate(%/초)}], q, btn, drip(ms) */
MINI.pour = (m, api) => {
  const cups = shuffle(m.cups || [{size:.72, lo:66, hi:84, rate:58}, {size:.95, lo:70, hi:86, rate:42}, {size:1.18, lo:72, hi:86, rate:32}]);
  const n = cups.length, lv = cups.map(() => 0); let c = 0, good = 0, pouring = false, wait = true, drip = 0, over = false;
  const CUP = (k, cp) => `<svg viewBox="0 0 130 104" class="tp-cup"><defs><clipPath id="tc${k}"><path d="M14 22H104Q102 80 59 92Q16 80 14 22Z"/></clipPath></defs>
    <ellipse cx="59" cy="97" rx="56" ry="6" fill="#c9a77e" stroke="#7a5638" stroke-width="2.5"/>
    <path d="M100 34c26-2 26 34-6 36" fill="none" stroke="#7a5638" stroke-width="8" stroke-linecap="round"/><path d="M100 34c26-2 26 34-6 36" fill="none" stroke="#a87b55" stroke-width="4" stroke-linecap="round"/>
    <g clip-path="url(#tc${k})"><rect x="0" y="0" width="130" height="104" fill="#f6ead2"/><rect id="tl${k}" x="0" y="92" width="130" height="80" fill="#a8423a"/>
      <rect x="0" y="${92 - cp.hi * .7}" width="130" height="${(cp.hi - cp.lo) * .7}" fill="#e6c25a" fill-opacity=".28"/>
      <line x1="0" x2="130" y1="${92 - cp.hi * .7}" y2="${92 - cp.hi * .7}" stroke="#c49a2c" stroke-width="2" stroke-dasharray="5 4"/>
      <line x1="0" x2="130" y1="${92 - cp.lo * .7}" y2="${92 - cp.lo * .7}" stroke="#c49a2c" stroke-width="2" stroke-dasharray="5 4"/></g>
    <path d="M14 22H104Q102 80 59 92Q16 80 14 22Z" fill="#9a6a45" fill-opacity=".38" stroke="#6e4c32" stroke-width="3.5"/>
    <path d="M24 40Q28 70 48 82" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="5" stroke-linecap="round"/>
    <ellipse cx="59" cy="22" rx="45" ry="5" fill="none" stroke="#6e4c32" stroke-width="3"/></svg>`;
  const POT = `<svg viewBox="0 0 150 110" class="tp-pot"><path d="M38 58Q10 50 4 30" fill="none" stroke="#7a3328" stroke-width="13" stroke-linecap="round"/><path d="M38 58Q10 50 4 30" fill="none" stroke="#b4483c" stroke-width="8" stroke-linecap="round"/>
    <path d="M112 42c34 0 34 44 0 44" fill="none" stroke="#7a3328" stroke-width="10"/><ellipse cx="78" cy="66" rx="44" ry="38" fill="#b4483c" stroke="#7a3328" stroke-width="4"/>
    <path d="M36 62q42 14 84 0" fill="none" stroke="#f3dcb4" stroke-width="9" stroke-opacity=".75"/><g fill="#f7e9cf"><circle cx="66" cy="68" r="3"/><circle cx="78" cy="70" r="3.5"/><circle cx="90" cy="68" r="3"/></g><path d="M60 44q6-6 12-2" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="5" stroke-linecap="round"/>
    <path d="M52 30h52l-6-10H58Z" fill="#9c3d33" stroke="#7a3328" stroke-width="3"/><circle cx="78" cy="15" r="7" fill="#9c3d33" stroke="#7a3328" stroke-width="3"/>
    <path d="M58 82Q66 96 60 100" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="5" stroke-linecap="round"/></svg>`;
  api.field.innerHTML = `<div class="tp"><h3 class="tp-q">${esc(m.q || "다이애나의 잔 세 개를 채워요")}</h3><div class="tp-row">${cups.map((cp, k) =>
      `<div class="tp-slot" id="ts${k}" style="--s:${cp.size}"><div class="tp-potbox">${POT}</div><i class="tp-stream"></i>${CUP(k, cp)}<b class="tp-mark"></b></div>`).join("")}</div>
    <button class="bigtap" id="pb">${esc(m.btn || "꾹 눌러 따르기")}</button></div>`;
  const slot = k => $("ts" + k), set = k => { const el = $("tl" + k); if(el) el.setAttribute("y", 92 - Math.min(104, lv[k]) * .7); };
  const msg = () => api.hud(`${m.say || "금빛 띠 안에서 손을 떼요"} · ${Math.min(c + 1, n)}/${n}잔 · 성공 ${good}`);
  const go = k => { [...api.field.querySelectorAll(".tp-slot")].forEach((s, j) => s.classList.toggle("on", j === k)); wait = false; msg(); };
  const stop = every(40, () => { if(over || wait) return;
    const cp = cups[c]; if(!cp) return;
    if(pouring || drip > 0){ lv[c] += cp.rate * .04 * (pouring ? 1 : .55); if(!pouring) drip -= 40; set(c);
      if(lv[c] >= 100){ lv[c] = 100; set(c); pouring = false; drip = 0; slot(c).classList.remove("pour"); slot(c).classList.add("spill"); judge(); }
      else if(!pouring && drip <= 0) judge(); } });
  const start = e => { e.preventDefault(); if(wait || pouring || over || drip > 0) return; pouring = true; slot(c).classList.add("pour"); };
  const end = () => { if(!pouring) return; pouring = false; slot(c).classList.remove("pour"); drip = m.drip || 380; };
  const judge = () => { wait = true; const cp = cups[c], v = lv[c], ok = v >= cp.lo && v <= cp.hi; if(ok) good++;
    const r = slot(c).getBoundingClientRect(); slot(c).querySelector(".tp-mark").textContent = ok ? "♥" : v > cp.hi ? "넘침" : "조금";
    slot(c).classList.add(ok ? "ok" : "no"); popAt(api, r.left + r.width / 2 - 50, r.top + 10, ok ? (m.yes || "딱 좋아요!") : v > cp.hi ? (m.over || "넘쳤어요!") : (m.less || "조금 모자라요"));
    c++; msg(); setTimeout(() => { if(c >= n){ over = true; stop(); removeEventListener("keydown", kd); removeEventListener("keyup", ku);
      api.end(good >= n ? 3 : good >= n - 1 ? 2 : 1, `${n}잔 중 ${good}잔을 잘 따랐어요.`); } else go(c); }, 1000); };
  const b = $("pb"); b.onpointerdown = start; b.onpointerup = end; b.onpointerleave = end; b.onpointercancel = end;
  const kd = e => { if(e.code === "Space" && !e.repeat) start(e); }, ku = e => { if(e.code === "Space") end(); };
  addEventListener("keydown", kd); addEventListener("keyup", ku);
  setTimeout(() => go(0), 200);
};

/* 박자 맞추기: 하트 표시가 분홍 리본 칸(움직이고 점점 작아짐)에 들어왔을 때 누르기.
   n번 성공, zone 처음 너비 %, speed 처음 속도. 성공할 때마다 칸이 작아지고 빨라짐 */
MINI.pace = (m, api) => {
  let ok = 0, miss = 0, x = 0, dir = 1, k = 0, zs = 0, zw = m.zone || 16, zd = 1, sp = m.speed || 1.4, lock = false;
  const n = m.n || 5, lines = m.lines || [];
  panel(api, `<h3 id="pl">${esc(lines[0] || m.q || "분홍 칸에서 눌러요")}</h3>
    <div class="pg"><div class="pg-zone" id="pz"><i>♥</i></div><div class="pg-mk" id="pm">♥</div></div>
    <div class="pg-dots" id="pd">${Array.from({length:n}, () => "<i>♡</i>").join("")}</div>
    <button class="bigtap pink" id="pt">${esc(m.btn || "지금!")}</button>`);
  const pz = $("pz"), pm = $("pm"), pd = $("pd");
  const newZone = () => { zw = Math.max(m.minZone || 7, (m.zone || 16) - ok * 2.2); zs = 8 + Math.random() * (84 - zw); zd = Math.random() < .5 ? -1 : 1; };
  newZone(); const msg = () => api.hud(`${m.say || "박자를 맞춰요"} · ${ok}/${n}`); msg();
  const stop = every(30, () => {
    x += dir * sp; if(x >= 100){ x = 100; dir = -1; } if(x <= 0){ x = 0; dir = 1; }
    zs += zd * (m.drift || .25) * (1 + ok * .25); if(zs <= 2){ zs = 2; zd = 1; } if(zs + zw >= 98){ zs = 98 - zw; zd = -1; }   // 칸도 이리저리
    if(pm) pm.style.left = x + "%"; if(pz){ pz.style.left = zs + "%"; pz.style.width = zw + "%"; }
  });
  const burst = (good) => { const r = (good ? pz : pm).getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const fx = good ? ["♥", "✿", "♥", "❀", "♥", "✦", "♥", "✿"] : ["·", "·", "·"];
    fx.forEach((c, i) => { const s = document.createElement("span"); s.className = "pg-fx" + (good ? "" : " bad"); s.textContent = c;
      const a = (i / fx.length) * Math.PI * 2, d = good ? 70 + Math.random() * 40 : 24;
      s.style.left = cx + "px"; s.style.top = cy + "px"; s.style.setProperty("--dx", Math.cos(a) * d + "px"); s.style.setProperty("--dy", Math.sin(a) * d - (good ? 20 : 0) + "px");
      document.body.appendChild(s); setTimeout(() => s.remove(), 900); });
    if(good){ pz.classList.remove("hit"); void pz.offsetWidth; pz.classList.add("hit"); }
    else { const g = pz.parentElement; g.classList.remove("miss"); void g.offsetWidth; g.classList.add("miss"); } };
  $("pt").onclick = e => { e.stopPropagation(); if(lock) return;
    if(x >= zs - 1 && x <= zs + zw + 1){
      burst(true); ok++; k++; pd.children[ok - 1].textContent = "♥"; pd.children[ok - 1].classList.add("on");
      popAt(api, e.clientX - 30, e.clientY - 80, m.yes || "딱 맞아요!"); if(lines[k]) $("pl").textContent = lines[k];
      sp = (m.speed || 1.4) * (1 + ok * .18); lock = true; setTimeout(() => { lock = false; newZone(); }, 260);
    } else { burst(false); miss++; popAt(api, e.clientX - 30, e.clientY - 80, m.no || "앗, 조금만 더!"); }
    msg(); if(ok >= n){ stop(); setTimeout(() => api.end(miss === 0 ? 3 : miss <= 3 ? 2 : 1, miss === 0 ? "한 번도 안 틀렸어요!" : `${miss}번 빗나갔지만 해냈어요.`), 700); } };
};

/* 꾸미기: 바구니의 꽃을 끌어서 큰 그림(baseImg) 위 원하는 곳에 놓기. 놓은 것도 다시 끌어 옮기거나 밖으로 빼기.
   baseImg(그림) 또는 base(이모지), items:[{img|e, t}], max */
MINI.decorate = (m, api) => {
  const max = m.max || 8, f = api.field;
  f.innerHTML = `<div class="dz-wrap"><div class="dz" id="dz">${m.baseImg ? `<img class="dz-base" src="${IMG(m.baseImg)}" alt="" draggable="false" onerror="this.outerHTML='<div class=&quot;dz-base emo&quot;>${m.base || "👒"}</div>'">` : `<div class="dz-base emo">${m.base || "👒"}</div>`}</div>
    <div class="dz-side"><p class="dz-q">${esc(m.q)}</p><div class="dz-tray" id="dt">${m.items.map((o, i) => `<button data-i="${i}" aria-label="${esc(o.t)}">${look(o)}<span>${esc(o.t)}</span></button>`).join("")}</div>
    <button class="bigtap" id="dd">${esc(m.btn || "다 됐어요")}</button></div></div>`;
  const dz = $("dz"); let n = 0; if(m.size) dz.style.setProperty("--dzs", m.size + "vh");
  const msg = () => api.hud(`${m.say || "꽃을 끌어다 모자 위에 놓아요"} · ${n}/${max}`); msg();
  const inZone = (x, y) => { const r = dz.getBoundingClientRect(); return x > r.left && x < r.right && y > r.top && y < r.bottom; };
  const drag = (ghost, x0, y0, onDrop) => {
    ghost.classList.add("dz-drag"); document.body.appendChild(ghost);
    const mv = e => { ghost.style.left = e.clientX + "px"; ghost.style.top = e.clientY + "px"; dz.classList.toggle("hot", inZone(e.clientX, e.clientY)); };
    mv({clientX:x0, clientY:y0});
    const up = e => { removeEventListener("pointermove", mv); removeEventListener("pointerup", up); removeEventListener("pointercancel", up); dz.classList.remove("hot"); ghost.remove(); onDrop(e.clientX, e.clientY); };
    addEventListener("pointermove", mv); addEventListener("pointerup", up); addEventListener("pointercancel", up);
  };
  const place = (o, x, y) => { const r = dz.getBoundingClientRect(), d = document.createElement("div");
    d.className = "dz-it"; d.innerHTML = look(o); d.style.left = ((x - r.left) / r.width * 100) + "%"; d.style.top = ((y - r.top) / r.height * 100) + "%";
    d.style.transform = `translate(-50%,-50%) rotate(${(Math.random() * 40 - 20) | 0}deg)`; d.dataset.t = o.t;
    d.onpointerdown = e => { e.preventDefault(); const g = d.cloneNode(true); d.style.visibility = "hidden";
      drag(g, e.clientX, e.clientY, (X, Y) => { if(inZone(X, Y)){ const r2 = dz.getBoundingClientRect(); d.style.left = ((X - r2.left) / r2.width * 100) + "%"; d.style.top = ((Y - r2.top) / r2.height * 100) + "%"; d.style.visibility = ""; }
        else { d.remove(); n--; msg(); } }); };
    dz.appendChild(d); n++; msg(); };
  f.querySelectorAll("#dt button").forEach(b => {
    b.onpointerdown = e => { e.preventDefault(); if(n >= max){ api.hud(`이제 더 놓을 자리가 없어요 · ${n}/${max}`); return; }
      const o = m.items[+b.dataset.i], g = document.createElement("div"); g.className = "dz-it"; g.innerHTML = look(o);
      let moved = false; const sx = e.clientX, sy = e.clientY;
      drag(g, sx, sy, (X, Y) => { if(inZone(X, Y)) place(o, X, Y);
        else if(Math.hypot(X - sx, Y - sy) < 8){ const r = dz.getBoundingClientRect(); place(o, r.left + r.width * (.25 + Math.random() * .5), r.top + r.height * (.25 + Math.random() * .4)); } }); };
  });
  $("dd").onclick = () => { const put = [...dz.querySelectorAll(".dz-it")].map(d => d.dataset.t);
    api.end(n >= Math.min(5, max) ? 3 : n >= 2 ? 2 : 1, n ? `${[...new Set(put)].join(", ")}(으)로 꾸몄어요.` : "아무것도 안 달았어요."); };
};

/* 눈길 달리기: ▲▼ 단추로 세 길을 오가며 장애물 피하기. 에너지(하트 5칸), 하트를 먹으면 회복.
   뒤로 갈수록 빨라지고 장애물이 많아진다. time, obs:[이모지], goods:[이모지] */
MINI.run = (m, api) => {
  let lane = 1, energy = 5, hit = 0, ate = 0, left = m.time || 35, over = false, t0 = 0; const f = api.field, T = m.time || 35;
  f.innerHTML = `<div class="lane" style="top:22%"></div><div class="lane" style="top:44%"></div><div class="lane" style="top:66%;border:0"></div>
    <div class="runner" id="rn" style="background-image:url(${IMG((quest() && quest().walker) || (C() && C().walker) || "walk_anne")})"></div>
    <div class="rn-en" id="en"></div>
    <div class="rn-pad"><button id="rUp" aria-label="위로">▲</button><button id="rDn" aria-label="아래로">▼</button></div>`;
  const place = () => { $("rn").style.top = `calc(${22 + lane * 22 + 11}% - 32px)`; }; place();
  const mv = d => { if(over) return; lane = Math.max(0, Math.min(2, lane + d)); place(); };
  $("rUp").onpointerdown = e => { e.preventDefault(); e.stopPropagation(); mv(-1); };
  $("rDn").onpointerdown = e => { e.preventDefault(); e.stopPropagation(); mv(1); };
  const key = e => { if(e.key === "ArrowUp") mv(-1); if(e.key === "ArrowDown") mv(1); }; addEventListener("keydown", key);
  const bar = () => { $("en").innerHTML = "<b>힘</b>" + Array.from({length:5}, (_, i) => `<i class="${i < energy ? "on" : ""}">♥</i>`).join(""); };
  const msg = () => api.hud(`${m.say || "▲▼로 길을 바꿔요"} · ${left}초`); bar(); msg();
  const level = () => 1 + (T - left) / T * 1.2;     // 1 → 2.2배
  let spawnT = 0;
  const stopS = every(100, () => { if(over) return; spawnT += 100 * level();
    if(spawnT < (m.every || 1100)) return; spawnT = 0;
    const good = Math.random() < (energy < 3 ? .22 : .12), L = Math.random() * 3 | 0, o = document.createElement("div");
    o.className = "ob" + (good ? " good" : ""); o.textContent = good ? (m.goods || ["♥"])[Math.random() * (m.goods || ["♥"]).length | 0] : m.obs[Math.random() * m.obs.length | 0];
    o.style.left = "100vw"; o.style.top = `calc(${22 + L * 22 + 11}% - 24px)`; o.style.animationDuration = ((m.speed || 3.4) / level()).toFixed(2) + "s"; o.dataset.l = L; f.appendChild(o);
    o.addEventListener("animationend", () => o.remove());
    if(level() > 1.6 && !good && Math.random() < .35){ const o2 = o.cloneNode(true); o2.dataset.l = (L + 1 + (Math.random() * 2 | 0)) % 3; o2.style.top = `calc(${22 + o2.dataset.l * 22 + 11}% - 24px)`; f.appendChild(o2); o2.addEventListener("animationend", () => o2.remove()); } });
  const stopC = every(50, () => { const r = $("rn"); if(!r || over) return; const rb = r.getBoundingClientRect();
    f.querySelectorAll(".ob").forEach(o => { if(o.dataset.hit) return; const b = o.getBoundingClientRect();
      if(+o.dataset.l === lane && b.left < rb.right - 12 && b.right > rb.left + 12){ o.dataset.hit = 1;
        if(o.classList.contains("good")){ o.remove(); if(energy < 5) energy++; ate++; popAt(api, rb.left + 30, rb.top - 30, m.yum || "따뜻해!"); }
        else { o.style.opacity = .3; energy--; hit++; r.classList.remove("ouch"); void r.offsetWidth; r.classList.add("ouch"); popAt(api, rb.left + 30, rb.top - 30, m.ouch || "아야!"); }
        bar(); if(energy <= 0) end(); } }); });
  const stopT = every(1000, () => { if(over) return; left--; msg(); if(left <= 0) end(); });
  const end = () => { if(over) return; over = true; stopS(); stopC(); stopT(); removeEventListener("keydown", key);
    setTimeout(() => api.end(energy <= 0 ? 1 : energy >= 4 ? 3 : 2, energy <= 0 ? `힘이 다 떨어졌어요. 그래도 ${T - left}초나 달렸어요!` : `힘 ${energy}칸을 남기고 도착했어요! 하트 ${ate}개를 먹었어요.`), 600); };
};

/* 순서 카드 놓기: 그림 카드를 1번~N번 칸에 차례로 놓고, 다 채우면 맞는지 확인.
   steps:[{t, img|e}] (맞는 순서), decoys:[{t, img|e}] (엉뚱한 카드). 카드를 누르면 빈 칸으로, 칸의 카드를 누르면 되돌아옴 */
MINI.slots = (m, api) => {
  const n = m.steps.length; let miss = 0, busy2 = false;
  const cards = shuffle(m.steps.map((c, i) => Object.assign({k:i}, c)).concat((m.decoys || []).map(c => Object.assign({k:-1}, c))));
  const p = panel(api, `<h3>${esc(m.q)}</h3><div class="sl-row" id="sr">${Array.from({length:n}, (_, i) => `<div class="sl-slot" data-s="${i}"><em>${i + 1}</em></div>`).join("")}</div>
    <div class="sl-hand" id="sh">${cards.map((c, j) => `<button class="sl-card" data-j="${j}">${look(c)}<span>${esc(c.t)}</span></button>`).join("")}</div>`);
  p.classList.add("sl-panel");
  const slots = [...p.querySelectorAll(".sl-slot")], fill = Array(n).fill(null);
  const msg = () => api.hud(`${m.say || "카드를 순서대로 놓아요"} · ${fill.filter(x => x !== null).length}/${n}`); msg();
  const back = i => { const j = fill[i]; if(j === null) return; fill[i] = null; slots[i].querySelector(".sl-card")?.remove(); p.querySelector(`#sh [data-j="${j}"]`).classList.remove("used"); msg(); };
  slots.forEach((sl, i) => sl.onclick = () => { if(!busy2) back(i); });
  p.querySelectorAll("#sh .sl-card").forEach(b => b.onclick = () => { if(busy2 || b.classList.contains("used")) return;
    const i = fill.indexOf(null); if(i < 0) return; const j = +b.dataset.j; fill[i] = j; b.classList.add("used");
    const c = b.cloneNode(true); c.classList.remove("used"); slots[i].appendChild(c); msg();
    if(fill.every(x => x !== null)) check(); });
  const check = () => { busy2 = true; const wrong = fill.map((j, i) => cards[j].k !== i);
    if(!wrong.some(Boolean)){ slots.forEach(s => s.classList.add("ok")); setTimeout(() => api.end(miss === 0 ? 3 : miss <= 2 ? 2 : 1, miss === 0 ? "한 번에 맞혔어요!" : `${miss}번 고쳐서 해냈어요.`), 900); return; }
    miss++; wrong.forEach((w, i) => w && slots[i].classList.add("no"));
    popAt(api, innerWidth / 2 - 80, innerHeight * .25, m.no || "순서가 조금 달라요. 다시 생각해 봐요");
    setTimeout(() => { wrong.forEach((w, i) => { slots[i].classList.remove("no"); if(w) back(i); }); busy2 = false; }, 1100); };
};

/* 병 그림(찬장 병 찾기·케이크 만들기): 모양 round|tall|square|jug, 색 이름 또는 #색 */
const BOTTLE_SHAPES = {
  round:`<path d="M26 6h12v14c10 4 16 12 16 24 0 13-9 22-22 22S10 57 10 44c0-12 6-20 16-24Z"/>`,
  tall:`<path d="M27 2h10v18c4 3 6 7 6 12v34H21V32c0-5 2-9 6-12Z"/>`,
  square:`<path d="M27 6h10v8h8c3 0 5 2 5 5v47H14V19c0-3 2-5 5-5h8Z"/>`,
  jug:`<path d="M24 8h16v8c8 4 12 12 12 22v28H12V38c0-10 4-18 12-22Z"/><path d="M50 26c9 0 9 18 0 18" fill="none" stroke-width="5"/>`
  };
const BOTTLE_COL = {red:"#b4483c", amber:"#c99a4a", green:"#7f9c6a", blue:"#7d9fb5", plum:"#8a6a8e", cream:"#e6d8b8"};
const bottleSvg = b => `<svg viewBox="0 0 64 70" aria-hidden="true"><g fill="${BOTTLE_COL[b.c] || b.c}" stroke="#5a4030" stroke-width="2.5" stroke-linejoin="round">${BOTTLE_SHAPES[b.s]}</g>
    <rect x="${b.s === "tall" ? 25 : 24}" y="${b.s === "tall" ? 0 : 3}" width="${b.s === "tall" ? 14 : 16}" height="7" rx="2" fill="#a67c52" stroke="#5a4030" stroke-width="2"/>
    <path d="M20 40c0-6 3-10 7-12" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="4" stroke-linecap="round"/></svg>`;

/* 찬장 병 찾기(기억력): 문이 잠깐 열려 찬장을 보여 준 뒤 닫히고, 다시 열리면 병이 뒤섞여 있다.
   '둘째 칸(shelf)의 빨간 병'을 모양까지 기억해서 골라야 한다. 빨간 병이 여러 개 섞여 헷갈림.
   peek(초, 함수도 됨), tries(기회), per(한 칸 병 수), say1(볼 때 말풍선) */
MINI.shelf = (m, api) => {
  const per = m.per || 5, tries = m.tries || 3, SH = m.shelf ?? 1, NM = ["첫째", "둘째", "셋째"];
  const peek = (typeof m.peek === "function" ? m.peek() : m.peek) || 3;
  const SHAPES = BOTTLE_SHAPES, COL = BOTTLE_COL, svg = bottleSvg;
  const others = Object.keys(COL).filter(c => c !== "red"), kinds = Object.keys(SHAPES);
  const pickO = () => others[Math.random() * others.length | 0];
  const goal = kinds[Math.random() * kinds.length | 0], alt = shuffle(kinds.filter(k => k !== goal));
  // 처음 보여 주는 찬장: 둘째 칸에는 빨간 병이 '목표' 하나뿐. 다른 칸에는 다른 모양 빨간 병.
  const filler = (n, ban) => Array.from({length:n}, () => { let s; do s = kinds[Math.random() * kinds.length | 0]; while(ban && s === ban && Math.random() < .5); return {c:pickO(), s}; });
  const first = [0, 1, 2].map(i => shuffle(i === SH ? [{c:"red", s:goal, goal:1}].concat(filler(per - 1)) : [{c:"red", s:alt[i % alt.length]}].concat(filler(per - 1))));
  // 다시 열면: 둘째 칸에 빨간 병 2개(목표 + 다른 모양), 다른 칸에도 목표와 같은 모양 빨간 병.
  const mixed = () => { const fake = [0, 1, 2].filter(i => i !== SH)[Math.random() * 2 | 0];
    return [0, 1, 2].map(i => { let row = i === SH ? [{c:"red", s:goal, goal:1}, {c:"red", s:alt[0]}] : i === fake ? [{c:"red", s:goal}] : [{c:"red", s:alt[1]}];
      return shuffle(row.concat(filler(per - row.length))); }); };
  const f = api.field; let miss = 0, busy = true, over = false, stopP = () => {};
  f.innerHTML = `<div class="cb-wrap"><div class="cb-say" id="cbs">${esc(m.say1 || "거실 찬장 둘째 칸, 빨간 병이란다.")}</div>
    <div class="cb" id="cb">${[0, 1, 2].map(i => `<div class="cb-row"><em>${NM[i]} 칸</em><div class="cb-bs" id="cr${i}"></div></div>`).join("")}
    <div class="cb-door l"></div><div class="cb-door r"></div></div></div>`;
  const cb = $("cb"), door = open => cb.classList.toggle("shut", !open);
  const fillRows = rows => rows.forEach((row, i) => { $("cr" + i).innerHTML = row.map((b, j) =>
    `<button class="cb-b" data-i="${i}" data-j="${j}" aria-label="${NM[i]} 칸 병">${svg(b)}</button>`).join(""); });
  let cur = first;
  const show = (rows, sec, then) => { cur = rows; fillRows(rows); door(true); $("cbs").classList.add("on"); let t = sec * 10;
    api.hud(`잘 봐 두세요 · ${Math.ceil(t / 10)}`);
    stopP = every(100, () => { t--; if(t > 0){ api.hud(`잘 봐 두세요 · ${Math.ceil(t / 10)}`); return; }
      stopP(); door(false); $("cbs").classList.remove("on"); api.hud("찬장 문이 닫혀요…"); setTimeout(then, 900 / FAST); }); };
  const ask = () => { fillRows(cur = mixed()); door(true); busy = false; api.hud(`${m.say || "아주머니가 말씀하신 병을 골라요"} · 기회 ${tries - miss}번`); };
  f.querySelectorAll(".cb-bs").forEach(row => row.onclick = e => { const b = e.target.closest(".cb-b"); if(!b || busy || over) return;
    const i = +b.dataset.i, o = cur[i][+b.dataset.j];
    if(o.goal){ over = true; b.classList.add("ok"); popAt(api, e.clientX - 40, e.clientY - 80, m.yes || "이 병이에요!");
      setTimeout(() => api.end(miss === 0 ? 3 : miss === 1 ? 2 : 1, miss === 0 ? "한 번에 찾았어요!" : `${miss}번 헷갈렸지만 찾았어요.`), 1100); return; }
    miss++; busy = true; b.classList.add("no");
    popAt(api, e.clientX - 60, e.clientY - 80, o.c !== "red" ? "빨간 병이 아니에요" : i !== SH ? `여긴 ${NM[i]} 칸이에요` : "아까 본 모양과 달라요");
    if(miss >= tries){ over = true; setTimeout(() => { const g = cb.querySelector(`#cr${SH} .cb-b:nth-child(${cur[SH].findIndex(x => x.goal) + 1})`); if(g) g.classList.add("hint");
      setTimeout(() => api.end(1, "아주머니가 말씀하신 병은 이거였어요."), 1600); }, 700); return; }
    setTimeout(() => { door(false); api.hud("한 번 더 보여 줄게요"); setTimeout(() => show(first, Math.max(1.5, peek * .6), ask), 700 / FAST); }, 900); });
  setTimeout(() => show(first, peek, ask), 300);
};

/* 케이크 만들기: 요리책 순서대로 선반의 재료를 누른다. 하얀 통들은 생김새가 같아서 이름표를 읽어야 한다.
   steps:[{t, n(누를 횟수)}], decoys:[이름], ask:{q, ok, no} 바닐라 차례에 묻는 질문 */
MINI.recipe = (m, api) => {
  const JAR = `<path d="M12 16h40v5c4 2 6 5 6 9v33c0 3-2 5-5 5H11c-3 0-5-2-5-5V30c0-4 2-7 6-9Z"/><rect x="10" y="8" width="44" height="9" rx="3" fill="#a67c52"/>`;
  const LOOK = {
    "밀가루":["jar", "#efe6d2"], "설탕":["jar", "#efe6d2"], "소금":["jar", "#efe6d2"], "비누 가루":["jar", "#efe6d2"], "베이킹소다":["jar", "#efe6d2"],
    "달걀":["eggs"], "버터":["butter"], "우유":["jug", "#e9eef0"], "바닐라":["tall", "#7a5638"], "식초":["tall", "#c99a4a"], "후추":["square", "#5a4a3e"]
  };
  const draw = name => { const [k, c] = LOOK[name] || ["jar", "#efe6d2"];
    if(k === "eggs") return `<svg viewBox="0 0 64 70"><ellipse cx="22" cy="38" rx="9" ry="12" fill="#f6ead6" stroke="#8a6a4a" stroke-width="2"/><ellipse cx="42" cy="38" rx="9" ry="12" fill="#f3e2c6" stroke="#8a6a4a" stroke-width="2"/><ellipse cx="32" cy="32" rx="9" ry="12" fill="#faf2e2" stroke="#8a6a4a" stroke-width="2"/>
      <path d="M4 42h56l-6 22H10Z" fill="#b98a5a" stroke="#6e4c32" stroke-width="2.5"/><path d="M8 50h48M10 57h44" stroke="#8a6440" stroke-width="2"/></svg>`;
    if(k === "butter") return `<svg viewBox="0 0 64 70"><ellipse cx="32" cy="58" rx="28" ry="8" fill="#e9dcc4" stroke="#7a5638" stroke-width="2.5"/><path d="M14 38l30-6 8 6v14l-30 6-8-6Z" fill="#f2d27a" stroke="#a8823a" stroke-width="2.5"/><path d="M14 38l8 6 30-6" fill="none" stroke="#a8823a" stroke-width="2"/></svg>`;
    if(k === "jar") return `<svg viewBox="0 0 64 70"><g fill="${c}" stroke="#6e4c32" stroke-width="2.5" stroke-linejoin="round">${JAR}</g></svg>`;
    return bottleSvg({c, s:k === "square" ? "square" : k === "jug" ? "jug" : "tall"}); };
  const names = shuffle(m.steps.map(x => x.t).concat(m.decoys || []));
  let k = 0, cnt = 0, miss = 0, asked = null, busy = false;
  api.field.innerHTML = `<div class="rc"><div class="rc-left"><div class="rc-book"><b>${esc(m.book || "레이어 케이크 만드는 법")}</b><ol id="rcl">${m.steps.map((x, i) =>
      `<li id="rs${i}">${esc(x.t)}${x.n > 1 ? ` ${x.n}개` : ""}</li>`).join("")}</ol></div>
      <svg class="rc-bowl" viewBox="0 0 120 70"><clipPath id="rbc"><path d="M8 20h104Q108 64 60 66Q12 64 8 20Z"/></clipPath><g clip-path="url(#rbc)"><rect width="120" height="70" fill="#f8efe0"/><rect id="rbf" x="0" y="66" width="120" height="60" fill="#ecd9a8"/></g>
      <path d="M8 20h104Q108 64 60 66Q12 64 8 20Z" fill="none" stroke="#6e4c32" stroke-width="3.5"/><ellipse cx="60" cy="20" rx="52" ry="6" fill="none" stroke="#6e4c32" stroke-width="3"/></svg></div>
    <div class="rc-shelf">${names.map((nm, i) => `<button class="rc-it" data-n="${esc(nm)}">${draw(nm)}<span>${esc(nm)}</span></button>`).join("")}</div></div>`;
  const msg = () => api.hud(`${m.say || "요리책 순서대로 재료를 눌러요"} · ${Math.min(k + 1, m.steps.length)}/${m.steps.length}${m.steps[k] && m.steps[k].n > 1 ? ` · ${cnt}/${m.steps[k].n}개` : ""}`);
  const mark = () => { m.steps.forEach((x, i) => { const li = $("rs" + i); li.classList.toggle("done", i < k); li.classList.toggle("now", i === k); });
    $("rbf").setAttribute("y", 66 - k / m.steps.length * 44); msg(); };
  const finish = () => { const st = (miss === 0 ? 3 : miss <= 2 ? 2 : 1) - (asked === false && miss === 0 ? 1 : 0);
    setTimeout(() => api.end(Math.max(1, st), miss === 0 ? "재료를 하나도 안 틀렸어요!" : `${miss}번 헷갈렸지만 다 넣었어요.`), 700); };
  const askNow = after => { busy = true; const box = document.createElement("div"); box.className = "mpanel rc-ask";
    box.innerHTML = `<h3>${esc(m.ask.q)}</h3><div class="chips"><button data-a="1">${esc(m.ask.ok)}</button><button data-a="0">${esc(m.ask.no)}</button></div>`;
    api.field.appendChild(box);
    box.querySelectorAll("button").forEach(b => b.onclick = e => { e.stopPropagation(); asked = b.dataset.a === "1"; box.remove(); busy = false;
      popAt(api, innerWidth / 2 - 90, innerHeight * .3, asked ? (m.ask.yes || "모를 땐 여쭤보기!") : (m.ask.nope || "이름표만 믿고 넣었어요…")); after(); }); };
  api.field.querySelectorAll(".rc-it").forEach(b => b.onclick = e => { if(busy || k >= m.steps.length) return;
    const nm = b.dataset.n, want = m.steps[k];
    if(nm !== want.t){ miss++; b.classList.remove("no"); void b.offsetWidth; b.classList.add("no");
      popAt(api, e.clientX - 60, e.clientY - 70, want.n > 1 && cnt > 0 ? `${want.t} ${want.n}개를 먼저 다 넣어요` : m.steps.some(x => x.t === nm) ? "요리책 순서가 아니에요" : "요리책에 없는 재료예요"); return; }
    const go = () => { cnt++; b.classList.remove("ok"); void b.offsetWidth; b.classList.add("ok"); popAt(api, e.clientX - 30, e.clientY - 70, want.n > 1 ? `${cnt}개!` : "넣었어요!");
      if(cnt >= (want.n || 1)){ k++; cnt = 0; } mark(); if(k >= m.steps.length) finish(); };
    if(want.ask && m.ask && asked === null) askNow(go); else go(); });
  mark();
};
