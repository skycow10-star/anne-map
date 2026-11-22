/* 효과음(파일 없이 브라우저가 직접 만드는 부드러운 소리)과 반짝이 효과.
   ♪ 단추로 음악을 끄면 효과음도 함께 꺼져요(engine.js의 musicOn). */
const SFX = (() => {
  let ac = null, master = null;
  const ctx = () => { if(typeof musicOn !== "undefined" && !musicOn) return null;
    try{ if(!ac){ ac = new (window.AudioContext || window.webkitAudioContext)(); master = ac.createGain(); master.gain.value = .5; master.connect(ac.destination); }
      if(ac.state === "suspended") ac.resume(); return ac; }catch(e){ return null; } };
  /* 음 하나: f(Hz), 시작 지연 d(초), 길이 len, 모양 type, 크기 v, 끝 음 f2(미끄러지기) */
  const tone = (f, d = 0, len = .18, type = "sine", v = .25, f2) => { const a = ctx(); if(!a) return; const t = a.currentTime + d;
    const o = a.createOscillator(), g = a.createGain(); o.type = type; o.frequency.setValueAtTime(f, t); if(f2) o.frequency.exponentialRampToValueAtTime(f2, t + len);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + .012); g.gain.exponentialRampToValueAtTime(.001, t + len);
    o.connect(g); g.connect(master); o.start(t); o.stop(t + len + .02); };
  /* 바람·물·가위 같은 '쉬익' 소리 */
  const noise = (d = 0, len = .2, v = .2, lo = 400, hi = 3000) => { const a = ctx(); if(!a) return; const t = a.currentTime + d;
    const b = a.createBuffer(1, Math.ceil(a.sampleRate * len), a.sampleRate), ch = b.getChannelData(0); for(let i = 0; i < ch.length; i++) ch[i] = Math.random() * 2 - 1;
    const s = a.createBufferSource(), fl = a.createBiquadFilter(), g = a.createGain(); s.buffer = b; fl.type = "bandpass"; fl.frequency.setValueAtTime(lo, t); fl.frequency.exponentialRampToValueAtTime(hi, t + len); fl.Q.value = 1.2;
    g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(.001, t + len); s.connect(fl); fl.connect(g); g.connect(master); s.start(t); s.stop(t + len); };
  const S = {
    tap:   () => tone(880, 0, .06, "triangle", .08),
    pop:   () => { tone(520, 0, .1, "sine", .18, 900); },
    ok:    () => { tone(784, 0, .16, "triangle", .2); tone(1175, .08, .22, "triangle", .18); },
    found: () => { tone(1047, 0, .14, "triangle", .18); tone(1319, .07, .14, "triangle", .16); tone(1568, .14, .3, "sine", .16); },
    no:    () => { tone(330, 0, .14, "sine", .16, 260); tone(262, .1, .2, "sine", .14, 220); },
    thud:  () => { tone(140, 0, .18, "sine", .3, 70); noise(0, .08, .12, 200, 400); },
    snip:  () => { noise(0, .05, .14, 2500, 6000); tone(2400, 0, .03, "square", .03); },
    splash:() => noise(0, .22, .16, 300, 1600),
    whoosh:() => noise(0, .3, .1, 300, 2400),
    moo:   () => { tone(150, 0, .55, "sawtooth", .05, 120); tone(151.5, 0, .55, "triangle", .12, 118); },
    step:  () => tone(220, 0, .07, "triangle", .1, 180),
    chime: () => [1047, 1319, 1568, 2093].forEach((f, i) => tone(f, i * .07, .5, "sine", .12)),
    heart: () => { tone(659, 0, .18, "sine", .18); tone(988, .1, .35, "sine", .16); },
    stars: n => { [523, 659, 784].slice(0, n).forEach((f, i) => tone(f, .1 + i * .22, .35, "triangle", .2)); if(n >= 3) [1047, 1319, 1568, 2093].forEach((f, i) => tone(f, .8 + i * .06, .5, "sine", .12)); },
    tick:  () => tone(1200, 0, .035, "sine", .025),
    page:  () => noise(0, .12, .05, 800, 2400)
  };
  S.note = tone; S.hiss = noise; S.ctx = ctx;
  return S;
})();

/* 반짝이 터지기: 화면 좌표 (x, y)에 작은 별·꽃잎이 퍼져요 */
function burst(x, y, n = 10, kind){
  const box = document.body, set = kind === "heart" ? ["💗", "✨"] : ["✦", "✧", "•"];
  for(let i = 0; i < n; i++){ const s = document.createElement("i"); s.className = "fx-spark"; s.textContent = set[i % set.length];
    const a = Math.PI * 2 * i / n + Math.random() * .5, r = 30 + Math.random() * 40;
    s.style.cssText = `left:${x}px;top:${y}px;--dx:${Math.cos(a) * r}px;--dy:${Math.sin(a) * r}px;color:${["#f2c14e", "#fff6c8", "#e98aa0", "#9fd3a0"][i % 4]};font-size:${10 + Math.random() * 10}px`;
    box.appendChild(s); setTimeout(() => s.remove(), 750); }
}

/* 미니게임 안에서 무엇이든 "ok"(맞음)·"no"(틀림) 표시가 붙으면 저절로 소리와 반짝이(놀이마다 따로 안 달아도 되게) */
(() => { let last = 0;
  const watch = () => { const box = document.getElementById("mini"); if(!box) return;
    new MutationObserver(list => { const now = Date.now(); if(now - last < 120) return;
      for(const r of list){ const el = r.target, was = (r.oldValue || "").split(/\s+/);
        if(el.classList && el.classList.contains("ok") && !was.includes("ok")){ last = now; SFX.ok(); const b = el.getBoundingClientRect(); if(b.width) burst(b.left + b.width / 2, b.top + b.height / 2, 8); return; }
        if(el.classList && el.classList.contains("no") && !was.includes("no")){ last = now; SFX.no(); return; } } })
      .observe(box, {subtree:true, attributes:true, attributeFilter:["class"], attributeOldValue:true}); };
  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", watch); else watch(); })();

/* 미니게임 음악: 이야기 음악 대신 통통 튀는 오르골·실로폰 놀이 음악(파일 없이 만들어 계속 되풀이).
   MUSIC.start() / MUSIC.stop() — engine.js runMini에서 부름 */
const MUSIC = (() => {
  const N = n => 440 * Math.pow(2, (n - 69) / 12);   // 미디 번호 -> Hz
  const BPM = 126, E = 60 / BPM / 2;                   // 8분음표 길이(초)
  // 4마디씩 두 줄(8분음표 8칸 = 한 마디), 0은 쉼
  const MEL = [
    [72,0,76,79, 77,76,74,0], [72,74,76,0, 79,0,76,0], [77,0,81,79, 77,76,74,72], [74,0,76,74, 71,0,67,0],
    [72,0,76,79, 84,0,81,79], [77,79,81,0, 79,77,76,74], [76,77,79,0, 74,76,77,74], [72,0,79,0, 72,0,0,0]];
  const BASS = [[48,55],[45,52],[41,48],[43,50],[48,55],[41,48],[43,50],[48,43]];
  let timer = null, step = 0, next = 0;
  const tick = () => { const a = SFX.ctx(); if(!a){ stop(); return; }
    while(next < a.currentTime + .25){ const bar = (step >> 3) % 8, k = step & 7, d = Math.max(0, next - a.currentTime);
      const m = MEL[bar][k]; if(m){ SFX.note(N(m), d, E * 1.6, "triangle", .07); SFX.note(N(m + 12), d, E * .9, "sine", .025); }
      if(k === 0 || k === 4){ const b = BASS[bar][k ? 1 : 0]; SFX.note(N(b), d, E * 1.8, "sine", .11); }
      if(k % 2 === 1) SFX.hiss(d, .04, .02, 5000, 8000);
      if(k === 2 || k === 6) SFX.note(N([64, 67, 72][bar % 3]), d, E, "sine", .03);
      step++; next += E; } };
  const start = () => { stop(); const a = SFX.ctx(); if(!a) return; step = 0; next = a.currentTime + .15; tick(); timer = setInterval(tick, 90); };
  const stop = () => { if(timer){ clearInterval(timer); timer = null; } };
  return {start, stop, on:() => !!timer};
})();
