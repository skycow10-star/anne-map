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
    tick:  () => tone(1400, 0, .04, "square", .03),
    page:  () => noise(0, .12, .05, 800, 2400)
  };
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
