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

/* 순서 맞추기: q, steps:[맞는 순서] */
MINI.order = (m, api) => {
  let k = 0, miss = 0; const p = panel(api, `<h3>${esc(m.q)}</h3><div class="built" id="ob"></div><div class="chips" id="oc"></div>`);
  api.hud(m.say || "알맞은 순서대로 눌러요");
  $("oc").innerHTML = shuffle(m.steps.map((s, i) => ({s, i}))).map(o => `<button data-i="${o.i}">${esc(o.s)}</button>`).join("");
  p.querySelectorAll("#oc button").forEach(b => b.onclick = () => {
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

/* 숨은 것 찾기: things:[{e|img, n:개수}], time */
MINI.find = (m, api) => {
  let left = m.time || 30, got = 0; const total = m.things.reduce((a, t) => a + (t.n || 1), 0), f = api.field;
  m.things.forEach(t => { for(let i = 0; i < (t.n || 1); i++){ const s = document.createElement("div"); s.className = "spot"; s.innerHTML = look(t);
    s.style.left = rnd(4, 90) + "%"; s.style.top = rnd(22, 80) + "%"; s.style.fontSize = rnd(26, 36) + "px"; s.style.opacity = rnd(.6, .9);
    s.querySelector("img") && (s.querySelector("img").style.cssText = "width:44px;height:44px;object-fit:contain");
    s.onclick = e => { e.stopPropagation(); if(s.classList.contains("got")) return; s.classList.add("got"); got++; popAt(api, e.clientX, e.clientY, t.say || "찾았다!"); msg(); if(got >= total) done(); };
    f.appendChild(s); } });
  const msg = () => api.hud(`${m.say || "숨은 것을 찾아요"} · ${left}초 · ${got}/${total}`); msg();
  let over = false; const done = () => { if(over) return; over = true; stop(); setTimeout(() => api.end(got >= total ? 3 : got >= total / 2 ? 2 : 1, `${total}개 중 ${got}개를 찾았어요.`), 500); };
  const stop = every(1000, () => { left--; msg(); if(left <= 0) done(); });
};

/* 물 퍼내기: time, rise(초당 %) */
MINI.bail = (m, api) => {
  let lv = 20, peak = 20, left = m.time || 20, over = false; const f = api.field;
  f.innerHTML = `<div class="water" id="wt" style="height:20%"></div><div class="mpanel" style="top:30%;background:rgba(255,251,242,.85)"><h3>${esc(m.q || "물을 퍼내요!")}</h3><button class="bigtap" id="bt">${esc(m.btn || "물 퍼내기")}</button></div>`;
  const msg = () => api.hud(`${m.say || "버텨요!"} · ${left}초 · 물 ${Math.round(lv)}%`); msg();
  $("bt").onclick = e => { e.stopPropagation(); lv = Math.max(0, lv - (m.scoop || 5)); };
  const stopW = every(100, () => { if(over) return; lv = Math.min(100, lv + (m.rise || 5) / 10); peak = Math.max(peak, lv); const w = $("wt"); if(w) w.style.height = lv + "%"; if(lv >= 100) done(); });
  const stopT = every(1000, () => { left--; msg(); if(left <= 0) done(); });
  const done = () => { if(over) return; over = true; stopW(); stopT(); api.end(lv >= 100 ? 1 : peak < 70 ? 3 : 2, lv >= 100 ? (m.sink || "앗, 물이 너무 많아요!") : "끝까지 버텼어요!"); };
};

/* 따르기: n잔, 누르고 있다가 선에서 떼기 */
MINI.pour = (m, api) => {
  let c = 0, good = 0, lv = 0, h = null, wait = false; const n = m.n || 3;
  const draw = () => { lv = 0; wait = false; const p = panel(api, `<h3>${esc(m.q || "선까지 따라요")} (${c + 1}/${n})</h3><div class="cup"><div class="ln" style="bottom:${m.lo || 70}%"></div><div class="ln" style="bottom:${m.hi || 90}%"></div><i id="cu" style="height:0"></i></div>
      <button class="bigtap" id="pb">${esc(m.btn || "꾹 눌러 따르기")}</button>`);
    api.hud(`${m.say || "초록 선 사이에서 손을 떼요"} · ${good}잔 성공`);
    const b = $("pb"); const start = e => { e.preventDefault(); if(h) return; if(wait) return; h = setInterval(() => { const cu = $("cu"); if(!cu){ clearInterval(h); h = null; return; } lv += m.speed || 1.6; cu.style.height = Math.min(100, lv) + "%"; if(lv >= 104) stop(); }, 40); };
    const stop = () => { if(!h) return; clearInterval(h); h = null; wait = true; const ok = lv >= (m.lo || 70) && lv <= (m.hi || 90); if(ok) good++;
      popAt(api, innerWidth / 2 - 50, innerHeight * .25, ok ? (m.yes || "딱 좋아요!") : lv > (m.hi || 90) ? (m.over || "넘쳤어요!") : (m.less || "조금 모자라요")); c++;
      setTimeout(() => c >= n ? api.end(good >= n ? 3 : good >= 1 ? 2 : 1, `${n}잔 중 ${good}잔을 잘 따랐어요.`) : draw(), 900); };
    b.onpointerdown = start; b.onpointerup = stop; b.onpointerleave = stop; };
  draw();
};

/* 박자 맞추기: 움직이는 표시가 초록 칸에 들어왔을 때 누르기. n번, zone 너비 % */
MINI.pace = (m, api) => {
  let ok = 0, miss = 0, x = 0, dir = 1, k = 0; const n = m.n || 5;
  const lines = m.lines || [];
  panel(api, `<h3 id="pl">${esc(lines[0] || m.q || "초록 칸에서 눌러요")}</h3><div class="meter"><div class="zone" id="pz"></div><div class="mk" id="pm"></div></div><button class="bigtap" id="pt">${esc(m.btn || "지금!")}</button>`);
  const zone = () => { const w = m.zone || 22, s = rnd(10, 90 - w); const z = $("pz"); z.style.left = s + "%"; z.style.width = w + "%"; z.dataset.s = s; z.dataset.w = w; };
  zone(); const msg = () => api.hud(`${m.say || "박자를 맞춰요"} · ${ok}/${n}`); msg();
  const stop = every(30, () => { x += dir * (m.speed || 1.4); if(x >= 100){ x = 100; dir = -1; } if(x <= 0){ x = 0; dir = 1; } const pm = $("pm"); if(pm) pm.style.left = x + "%"; });
  $("pt").onclick = e => { e.stopPropagation(); const z = $("pz"), s = +z.dataset.s, w = +z.dataset.w;
    if(x >= s && x <= s + w){ ok++; k++; popAt(api, e.clientX, e.clientY - 60, m.yes || "좋아요!"); if(lines[k]) $("pl").textContent = lines[k]; zone(); }
    else { miss++; popAt(api, e.clientX, e.clientY - 60, m.no || "앗, 조금만 더!"); }
    msg(); if(ok >= n){ stop(); setTimeout(() => api.end(miss === 0 ? 3 : miss <= 3 ? 2 : 1, miss === 0 ? "한 번도 안 틀렸어요!" : `${miss}번 빗나갔지만 해냈어요.`), 500); } };
};

/* 꾸미기: 바구니의 꽃을 끌어서 큰 그림(baseImg) 위 원하는 곳에 놓기. 놓은 것도 다시 끌어 옮기거나 밖으로 빼기.
   baseImg(그림) 또는 base(이모지), items:[{img|e, t}], max */
MINI.decorate = (m, api) => {
  const max = m.max || 8, f = api.field;
  f.innerHTML = `<div class="dz-wrap"><div class="dz" id="dz">${m.baseImg ? `<img class="dz-base" src="${IMG(m.baseImg)}" alt="" draggable="false">` : `<div class="dz-base emo">${m.base || "👒"}</div>`}</div>
    <div class="dz-side"><p class="dz-q">${esc(m.q)}</p><div class="dz-tray" id="dt">${m.items.map((o, i) => `<button data-i="${i}" aria-label="${esc(o.t)}">${look(o)}<span>${esc(o.t)}</span></button>`).join("")}</div>
    <button class="bigtap" id="dd">${esc(m.btn || "다 됐어요")}</button></div></div>`;
  const dz = $("dz"); let n = 0;
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

/* 달리기: 위·가운데·아래 길 바꾸며 피하기. time, obs:[e] */
MINI.run = (m, api) => {
  let lane = 1, hit = 0, left = m.time || 20, over = false; const f = api.field;
  f.innerHTML = `<div class="lane" style="top:22%"></div><div class="lane" style="top:44%"></div><div class="lane" style="top:66%;border:0"></div><div class="runner" id="rn" style="background-image:url(${IMG((quest() && quest().walker) || (C() && C().walker) || "walk_anne")})"></div>
    <div style="position:absolute;inset:22% 0 0 0;display:flex;flex-direction:column;z-index:7"><button class="zt" data-d="-1" style="flex:1;opacity:0">위로</button><button class="zt" data-d="1" style="flex:1;opacity:0">아래로</button></div>`;
  const place = () => { $("rn").style.top = `calc(${22 + lane * 22 + 11}% - 32px)`; }; place();
  f.querySelectorAll(".zt").forEach(b => b.onclick = e => { e.stopPropagation(); lane = Math.max(0, Math.min(2, lane + +b.dataset.d)); place(); });
  const msg = () => api.hud(`${m.say || "위·아래를 눌러 피해요"} · ${left}초 · 부딪힘 ${hit}`); msg();
  const stopS = every(m.every || 1100, () => { const L = Math.random() * 3 | 0, o = document.createElement("div"); o.className = "ob"; o.textContent = m.obs[Math.random() * m.obs.length | 0];
    o.style.left = "100vw"; o.style.top = `calc(${22 + L * 22 + 11}% - 24px)`; o.style.animationDuration = (m.speed || 3.2) + "s"; o.dataset.l = L; f.appendChild(o);
    o.addEventListener("animationend", () => o.remove()); });
  const stopC = every(60, () => { const r = $("rn"); if(!r) return; const rb = r.getBoundingClientRect();
    f.querySelectorAll(".ob").forEach(o => { if(o.dataset.hit) return; const b = o.getBoundingClientRect(); if(+o.dataset.l === lane && b.left < rb.right - 14 && b.right > rb.left + 14){ o.dataset.hit = 1; o.style.opacity = .3; hit++; msg(); popAt(api, rb.left + 40, rb.top - 30, m.ouch || "아야!"); } }); });
  const stopT = every(1000, () => { left--; msg(); if(left <= 0 && !over){ over = true; stopS(); stopC(); stopT(); api.end(hit === 0 ? 3 : hit <= 3 ? 2 : 1, hit === 0 ? "한 번도 안 부딪혔어요!" : `${hit}번 부딪혔지만 도착했어요.`); } });
};
