const PM_AUDIO = (() => {
  let ctx = null, masterGain = null, sfxGain = null, musicGain = null, ambientGain = null;
  let sfxOn = true, musicOn = true, ambientOn = true, volume = 0.5;
  let currentMusic = null, currentZone = null;
  let ambientInterval = null;

  function init() {
    if (ctx) return;
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      masterGain = ctx.createGain();
      masterGain.gain.value = volume;
      masterGain.connect(ctx.destination);
      sfxGain = ctx.createGain();
      sfxGain.gain.value = 0.6;
      sfxGain.connect(masterGain);
      musicGain = ctx.createGain();
      musicGain.gain.value = 0.25;
      musicGain.connect(masterGain);
      ambientGain = ctx.createGain();
      ambientGain.gain.value = 0.15;
      ambientGain.connect(masterGain);

      try {
        const s = JSON.parse(localStorage.getItem('pm_audio') || '{}');
        if (s.sfx === false) { sfxOn = false; sfxGain.gain.value = 0; }
        if (s.music === false) { musicOn = false; musicGain.gain.value = 0; }
        if (s.ambient === false) { ambientOn = false; ambientGain.gain.value = 0; }
        if (typeof s.vol === 'number') { volume = s.vol; masterGain.gain.value = volume; }
      } catch {}
    } catch {}
  }

  function resume() { if (ctx && ctx.state === 'suspended') ctx.resume(); }

  function savePrefs() {
    try { localStorage.setItem('pm_audio', JSON.stringify({ sfx: sfxOn, music: musicOn, ambient: ambientOn, vol: volume })); } catch {}
  }

  function toggleSfx() {
    sfxOn = !sfxOn;
    if (sfxGain) sfxGain.gain.value = sfxOn ? 0.6 : 0;
    savePrefs();
    return sfxOn;
  }

  function toggleMusic() {
    musicOn = !musicOn;
    if (musicGain) musicGain.gain.value = musicOn ? 0.25 : 0;
    savePrefs();
    return musicOn;
  }

  function toggleAmbient() {
    ambientOn = !ambientOn;
    if (ambientGain) ambientGain.gain.value = ambientOn ? 0.15 : 0;
    savePrefs();
    return ambientOn;
  }

  function setVolume(v) {
    volume = Math.max(0, Math.min(1, v));
    if (masterGain) masterGain.gain.value = volume;
    savePrefs();
  }

  function setSfxVolume(v) {
    const vol = Math.max(0, Math.min(1, v));
    if (sfxGain) sfxGain.gain.value = sfxOn ? vol * 0.6 : 0;
    savePrefs();
  }

  function setMusicVolume(v) {
    const vol = Math.max(0, Math.min(1, v));
    if (musicGain) musicGain.gain.value = musicOn ? vol * 0.25 : 0;
    savePrefs();
  }

  function setAmbientVolume(v) {
    const vol = Math.max(0, Math.min(1, v));
    if (ambientGain) ambientGain.gain.value = ambientOn ? vol * 0.15 : 0;
    savePrefs();
  }

  function playTone(freq, dur, type, vol, detune) {
    if (!ctx || !sfxOn) return;
    resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type || 'square';
    osc.frequency.value = freq;
    if (detune) osc.detune.value = detune;
    gain.gain.setValueAtTime((vol || 0.15) * 0.6, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    osc.connect(gain).connect(sfxGain);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + dur);
  }

  function playNoise(dur, vol) {
    if (!ctx || !sfxOn) return;
    resume();
    const bufSize = Math.floor(ctx.sampleRate * dur);
    const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = (Math.random() * 2 - 1);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime((vol || 0.1) * 0.6, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    src.connect(gain).connect(sfxGain);
    src.start();
  }

  function sweep(freqStart, freqEnd, dur, type, vol) {
    if (!ctx || !sfxOn) return;
    resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freqStart, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(Math.max(20, freqEnd), ctx.currentTime + dur);
    gain.gain.setValueAtTime((vol || 0.12) * 0.6, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    osc.connect(gain).connect(sfxGain);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + dur);
  }

  const sfx = {
    jump() { sweep(300, 800, 0.12, 'sine', 0.12); playTone(600, 0.06, 'triangle', 0.08); },
    doubleJump() { sweep(400, 1000, 0.14, 'sine', 0.14); sweep(600, 1200, 0.1, 'triangle', 0.08, 100); },
    wallJump() { sweep(350, 700, 0.1, 'sine', 0.1); playNoise(0.04, 0.04); },
    dash() { sweep(200, 100, 0.2, 'sawtooth', 0.1); playNoise(0.15, 0.06); },
    attack() { sweep(800, 200, 0.08, 'square', 0.1); playNoise(0.05, 0.08); },
    attackHit() { sweep(1200, 100, 0.12, 'sawtooth', 0.15); playNoise(0.08, 0.1); },
    palou() { sweep(600, 1200, 0.2, 'sine', 0.1); sweep(800, 400, 0.15, 'triangle', 0.06); },
    collect() { sweep(800, 1400, 0.08, 'sine', 0.1); playTone(1200, 0.06, 'triangle', 0.06); },
    collectBig() { sweep(800, 1600, 0.12, 'sine', 0.14); sweep(1200, 1800, 0.1, 'triangle', 0.08); },
    hurt() { sweep(400, 100, 0.2, 'sawtooth', 0.12); playNoise(0.1, 0.08); },
    death() { sweep(600, 50, 0.5, 'sawtooth', 0.15); sweep(400, 30, 0.4, 'square', 0.08); playNoise(0.3, 0.06); },
    checkpoint() { sweep(600, 1000, 0.1, 'sine', 0.1); setTimeout(() => sweep(800, 1200, 0.1, 'sine', 0.1), 100); },
    portal() { sweep(300, 600, 0.3, 'sine', 0.1); sweep(500, 900, 0.25, 'triangle', 0.06); },
    npcTalk() { playTone(500, 0.04, 'square', 0.06); },
    combo(n) { sweep(600 + n * 100, 1000 + n * 150, 0.08, 'sine', 0.08); },
    victory() {
      sweep(400, 800, 0.15, 'sine', 0.12);
      setTimeout(() => sweep(600, 1000, 0.15, 'sine', 0.12), 150);
      setTimeout(() => sweep(800, 1400, 0.2, 'sine', 0.14), 300);
      setTimeout(() => sweep(1000, 1600, 0.3, 'triangle', 0.1), 500);
    },
    menuSelect() { sweep(500, 800, 0.06, 'sine', 0.08); },
    menuConfirm() { sweep(600, 1200, 0.1, 'sine', 0.1); },
    land() { sweep(600, 200, 0.08, 'sine', 0.08); playNoise(0.05, 0.04); },
    glide() { sweep(300, 450, 0.15, 'sine', 0.06); },
    wallSlide() { playNoise(0.03, 0.02); },
    enemyHit() { sweep(700, 300, 0.1, 'square', 0.1); playNoise(0.06, 0.05); },
    enemyDeath() { sweep(500, 150, 0.2, 'sawtooth', 0.12); sweep(400, 100, 0.15, 'square', 0.08); },
    bossSpawn() { sweep(200, 600, 0.4, 'sawtooth', 0.15); playNoise(0.2, 0.08); },
    levelUp() { sweep(600, 1200, 0.15, 'sine', 0.12); sweep(800, 1600, 0.12, 'triangle', 0.1); setTimeout(() => sweep(1000, 2000, 0.2, 'sine', 0.14), 150); },
    unlockSkill() { sweep(500, 1000, 0.2, 'sine', 0.12); sweep(700, 1400, 0.15, 'triangle', 0.1); sweep(900, 1800, 0.25, 'sine', 0.1); },
    step() { playNoise(0.02, 0.015); },
    chainClimb() { playNoise(0.03, 0.02); },
    wind() { sweep(200, 400, 0.5, 'sine', 0.04); },
    heal() { sweep(400, 800, 0.15, 'sine', 0.1); sweep(600, 1000, 0.1, 'triangle', 0.08); },
    pickup() { sweep(800, 1200, 0.1, 'sine', 0.1); playTone(1000, 0.05, 'triangle', 0.06); },
  };

  const ZONE_SCALES = {
    ciudad_alta:     [220, 261, 293, 329, 392, 440, 523],
    alcantarillas:   [196, 233, 261, 293, 349, 392, 466],
    parque_palomas:  [261, 293, 329, 392, 440, 523, 587],
    torre_reloj:     [233, 261, 311, 349, 415, 466, 523],
    bosque_encantado:[220, 246, 293, 329, 369, 440, 493],
    tejado_gansos:   [196, 220, 261, 329, 392, 440, 523],
  };

  const ZONE_BPM = {
    ciudad_alta: 90, alcantarillas: 65, parque_palomas: 100,
    torre_reloj: 75, bosque_encantado: 80, tejado_gansos: 85,
  };

  let musicInterval = null;

  function stopMusic() {
    if (musicInterval) { clearInterval(musicInterval); musicInterval = null; }
    if (ambientInterval) { clearInterval(ambientInterval); ambientInterval = null; }
    currentZone = null;
  }

  function startAmbient(zoneId) {
    if (!ctx || !ambientOn || currentZone === zoneId) return;
    resume();
    if (ambientInterval) { clearInterval(ambientInterval); ambientInterval = null; }
    
    const ambientSounds = {
      ciudad_alta: { wind: true, distantTraffic: true, birds: false },
      alcantarillas: { wind: false, water: true, rats: true },
      parque_palomas: { wind: true, birds: true, water: true },
      torre_reloj: { wind: true, gears: true, clock: true },
      bosque_encantado: { wind: true, magic: true, creatures: true },
      tejado_gansos: { wind: true, geese: true, distantCity: true },
    };
    
    const ambient = ambientSounds[zoneId] || ambientSounds.ciudad_alta;
    let ambientStep = 0;
    
    ambientInterval = setInterval(() => {
      if (!ctx || !ambientOn || ctx.state !== 'running') return;
      const t = ctx.currentTime;
      
      if (ambient.wind && Math.random() > 0.7) {
        const windFreq = 150 + Math.random() * 100;
        const windOsc = ctx.createOscillator();
        const windGain = ctx.createGain();
        windOsc.type = 'sine';
        windOsc.frequency.value = windFreq;
        windGain.gain.setValueAtTime(0, t);
        windGain.gain.linearRampToValueAtTime(0.03, t + 0.5);
        windGain.gain.linearRampToValueAtTime(0, t + 1.5);
        windOsc.connect(windGain).connect(ambientGain);
        windOsc.start(t);
        windOsc.stop(t + 1.5);
      }
      
      if (ambient.water && Math.random() > 0.8) {
        const waterOsc = ctx.createOscillator();
        const waterGain = ctx.createGain();
        waterOsc.type = 'sine';
        waterOsc.frequency.value = 200 + Math.random() * 50;
        waterGain.gain.setValueAtTime(0, t);
        waterGain.gain.linearRampToValueAtTime(0.02, t + 0.3);
        waterGain.gain.linearRampToValueAtTime(0, t + 0.8);
        waterOsc.connect(waterGain).connect(ambientGain);
        waterOsc.start(t);
        waterOsc.stop(t + 0.8);
      }
      
      if (ambient.birds && Math.random() > 0.85) {
        const birdFreq = 800 + Math.random() * 400;
        const birdOsc = ctx.createOscillator();
        const birdGain = ctx.createGain();
        birdOsc.type = 'sine';
        birdOsc.frequency.setValueAtTime(birdFreq, t);
        birdOsc.frequency.linearRampToValueAtTime(birdFreq * 1.2, t + 0.1);
        birdOsc.frequency.linearRampToValueAtTime(birdFreq * 0.8, t + 0.2);
        birdGain.gain.setValueAtTime(0.01, t);
        birdGain.gain.linearRampToValueAtTime(0.02, t + 0.1);
        birdGain.gain.linearRampToValueAtTime(0, t + 0.3);
        birdOsc.connect(birdGain).connect(ambientGain);
        birdOsc.start(t);
        birdOsc.stop(t + 0.3);
      }
      
      if (ambient.gears && Math.random() > 0.9) {
        const gearOsc = ctx.createOscillator();
        const gearGain = ctx.createGain();
        gearOsc.type = 'sawtooth';
        gearOsc.frequency.value = 100 + Math.random() * 50;
        gearGain.gain.setValueAtTime(0, t);
        gearGain.gain.linearRampToValueAtTime(0.015, t + 0.1);
        gearGain.gain.linearRampToValueAtTime(0, t + 0.3);
        gearOsc.connect(gearGain).connect(ambientGain);
        gearOsc.start(t);
        gearOsc.stop(t + 0.3);
      }
      
      if (ambient.magic && Math.random() > 0.88) {
        const magicOsc = ctx.createOscillator();
        const magicGain = ctx.createGain();
        magicOsc.type = 'sine';
        magicOsc.frequency.setValueAtTime(400, t);
        magicOsc.frequency.linearRampToValueAtTime(600, t + 0.2);
        magicOsc.frequency.linearRampToValueAtTime(400, t + 0.4);
        magicGain.gain.setValueAtTime(0, t);
        magicGain.gain.linearRampToValueAtTime(0.025, t + 0.2);
        magicGain.gain.linearRampToValueAtTime(0, t + 0.5);
        magicOsc.connect(magicGain).connect(ambientGain);
        magicOsc.start(t);
        magicOsc.stop(t + 0.5);
      }
      
      ambientStep++;
    }, 200);
  }

  function startMusic(zoneId) {
    if (!ctx || !musicOn || currentZone === zoneId) return;
    resume();
    stopMusic();
    currentZone = zoneId;
    const scale = ZONE_SCALES[zoneId] || ZONE_SCALES.ciudad_alta;
    const bpm = ZONE_BPM[zoneId] || 80;
    const beatMs = 60000 / bpm;
    let step = 0;
    let chordIdx = 0;

    musicInterval = setInterval(() => {
      if (!ctx || !musicOn || ctx.state !== 'running') return;
      const t = ctx.currentTime;

      if (step % 16 === 0) {
        const root = scale[chordIdx % scale.length];
        const third = scale[(chordIdx + 2) % scale.length];
        const fifth = scale[(chordIdx + 4) % scale.length];
        [root * 0.5, third * 0.5, fifth * 0.5].forEach(freq => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.value = freq;
          gain.gain.setValueAtTime(0, t);
          gain.gain.linearRampToValueAtTime(0.04, t + beatMs * 8 / 1000);
          gain.gain.linearRampToValueAtTime(0, t + beatMs * 16 / 1000);
          osc.connect(gain).connect(musicGain);
          osc.start(t);
          osc.stop(t + beatMs * 16 / 1000);
        });
        chordIdx = (chordIdx + 1) % scale.length;
      }

      if (step % 4 === 0 && Math.random() > 0.4) {
        const note = scale[Math.floor(Math.random() * scale.length)];
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = step % 8 === 0 ? 'triangle' : 'sine';
        osc.frequency.value = note * (step % 32 < 16 ? 1 : 2);
        gain.gain.setValueAtTime(0.06, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + beatMs * 3 / 1000);
        osc.connect(gain).connect(musicGain);
        osc.start(t);
        osc.stop(t + beatMs * 3 / 1000);
      }

      if (step % 8 === 0) {
        const bass = scale[chordIdx % scale.length] * 0.25;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = bass;
        gain.gain.setValueAtTime(0.08, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + beatMs * 6 / 1000);
        osc.connect(gain).connect(musicGain);
        osc.start(t);
        osc.stop(t + beatMs * 6 / 1000);
      }

      step++;
    }, beatMs / 4);
    
    startAmbient(zoneId);
  }

  return {
    init,
    resume,
    sfx,
    startMusic,
    stopMusic,
    toggleSfx,
    toggleMusic,
    toggleAmbient,
    setVolume,
    setSfxVolume,
    setMusicVolume,
    setAmbientVolume,
    get sfxOn() { return sfxOn; },
    get musicOn() { return musicOn; },
    get ambientOn() { return ambientOn; },
  };
})();

window.PM_AUDIO = PM_AUDIO;
