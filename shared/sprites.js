const ASSETS = {
  root: '../assets/',
  imgs: {},
  ready: false,
  progress: 0,
  listeners: [],
};

function resolveAsset(path) {
  return ASSETS.root + path.split('/').pop();
}

function loadAssets() {

  const files = ['gato.gif', 'haduken.gif', 'Doble Salto.gif'];
  let loaded = 0;
  ASSETS.progress = 0;
  if (files.length === 0) { ASSETS.ready = true; notifyReady(); return; }

  files.forEach(f => {
    const img = new Image();
    img.onload = () => {
      ASSETS.imgs[f] = img;
      loaded++;
      ASSETS.progress = Math.round(loaded / files.length * 100);
      if (loaded === files.length) { ASSETS.ready = true; notifyReady(); }
    };
    img.onerror = () => {
      ASSETS.imgs[f] = null;
      loaded++;
      ASSETS.progress = Math.round(loaded / files.length * 100);
      if (loaded === files.length) { ASSETS.ready = true; notifyReady(); }
    };
    img.src = resolveAsset(f);
  });
}

function onAssetsReady(fn) {
  if (ASSETS.ready) fn();
  else ASSETS.listeners.push(fn);
}
function notifyReady() {
  ASSETS.listeners.forEach(fn => { try { fn(); } catch {} });
  ASSETS.listeners = [];
}

function getImg(name) { return ASSETS.imgs[name] || null; }

const PALETTE = {
  pigeonBody:  '#e8e8f8',
  pigeonBelly: '#f4f4ff',
  pigeonWing:  '#c0c0e0',
  pigeonWingDark:'#9098c8',
  beak:        '#e8c040',
  beakDark:    '#c09020',
  feet:        '#e0b030',
  eye:         '#101018',

  cat:         '#605868',
  catHead:     '#787088',
  catDark:     '#484050',
  catEar:      '#c06060',
  catEye:      '#ff7070',
  catAggro:    '#ff3030',

  rat:         '#3a301e',
  ratHead:     '#4a3828',
  ratDark:     '#2a2012',
  ratTail:     '#5a4030',
  ratEye:      '#ff4040',

  crow:        '#101018',
  crowBody:    '#181822',
  crowWing:    '#202028',
  crowBeak:    '#a08020',
  crowBeakDark:'#806018',
  crowEye:     '#8040c0',
  crowEyeAggro:'#c060ff',

  bossCrowWing:'#1a1a28',
  bossCrowBody:'#0e0e16',
  bossCrown:   ['#303040','#1a1828'],
  bossEye:     '#c040ff',
};

function makeCanvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  return c;
}

function pxRect(c, x, y, w, h, color) {
  const ctx = c.getContext('2d');
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function genPigeonSprite(state, facing, wing2) {
  const c = makeCanvas(30, 28);
  const ctx = c.getContext('2d');
  const flip = facing < 0;
  const M = (x) => flip ? 30 - x : x;
  const O = '#26263a';

  const fly    = state === 'fly' || state === 'glide' || state === 'fly2' || state === 'glide2';
  const attack = state === 'attack';
  const jump   = state === 'jump' || state === 'fall';
  const dash   = state === 'dash';

  ctx.fillStyle = O;
  ctx.fillRect(M(1) - 1, 12, 9, 6);
  ctx.fillRect(M(13) - 1, 19, 6, 8);
  ctx.fillRect(M(7) - 1, 6, 18, 15);
  ctx.fillRect(M(11) - 1, -2, 15, 11);
  ctx.fillRect(M(12) - 1, 5, 11, 3);

  const tailLift = fly ? 1 : (jump ? -4 : 0);
  ctx.fillStyle = '#7a80b4';
  ctx.fillRect(M(2) - 1, 13 + tailLift, 7, 4);
  ctx.fillStyle = '#5a6090';
  ctx.fillRect(M(2) - 1, 13 + tailLift, 7, 1);
  ctx.fillStyle = 'rgba(255,255,255,0.18)';
  ctx.fillRect(M(2) - 1, 15 + tailLift, 7, 1);

  if (fly) {
    ctx.fillStyle = '#8a90c0';
    ctx.fillRect(M(9) + 1, 7, 5, 8);
  } else if (jump || state === 'wallslide') {
    ctx.fillStyle = '#8a90c0';
    ctx.fillRect(M(9) + 1, 8, 4, 8);
  } else {
    ctx.fillStyle = '#8a90c0';
    ctx.fillRect(M(9) + 1, 10, 4, 5);
  }

  if (fly || jump) {
    ctx.fillStyle = '#e0a838';
    ctx.fillRect(M(13) - 1, 20, 2, 3);
    ctx.fillRect(M(19) - 1, 20, 2, 3);
  } else {
    ctx.fillStyle = '#e0a838';
    ctx.fillRect(M(13) - 1, 20, 2, 5);
    ctx.fillRect(M(19) - 1, 20, 2, 5);
  }
  ctx.fillStyle = '#c08020';
  ctx.fillRect(M(12) - 1, 25, 4, 2);
  ctx.fillRect(M(18) - 1, 25, 4, 2);

  const bodyGrad = ctx.createLinearGradient(0, 8, 0, 20);
  bodyGrad.addColorStop(0, '#f6f6ff');
  bodyGrad.addColorStop(0.55, '#eaeaf8');
  bodyGrad.addColorStop(1, '#c4c6e6');
  ctx.fillStyle = bodyGrad;
  ctx.fillRect(M(8) - 1, 7, 15, 13);

  ctx.fillStyle = 'rgba(60,60,110,0.18)';
  ctx.fillRect(M(8) - 1, 7, 5, 12);

  ctx.fillStyle = 'rgba(40,130,100,0.55)';
  ctx.fillRect(M(20) - 1, 8, 4, 3);
  ctx.fillStyle = 'rgba(130,60,160,0.5)';
  ctx.fillRect(M(21) - 1, 10, 3, 3);
  ctx.fillStyle = 'rgba(30,110,140,0.4)';
  ctx.fillRect(M(22) - 1, 11, 2, 2);

  ctx.fillStyle = '#eef0ff';
  ctx.fillRect(M(12) - 1, 1, 12, 7);
  ctx.fillStyle = '#e2e2f6';
  ctx.fillRect(M(11) - 1, 0, 9, 3);

  ctx.fillStyle = '#d2d4ee';
  ctx.fillRect(M(13) - 1, -2, 3, 3);
  ctx.fillRect(M(16) - 1, -1, 2, 2);

  ctx.fillStyle = '#14141e';
  ctx.fillRect(M(21) - 1, 2, 3, 3);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(M(22) - 1, 2, 1, 1);
  ctx.fillStyle = 'rgba(40,40,80,0.5)';
  ctx.fillRect(M(20) - 1, 1, 5, 1);

  if (attack) {

    ctx.fillStyle = '#e8c040';
    ctx.fillRect(M(23) - 1, 2, 5, 2);
    ctx.fillStyle = '#c09020';
    ctx.fillRect(M(23) - 1, 6, 5, 2);
    ctx.fillStyle = '#d8a828';
    ctx.fillRect(M(23) - 1, 4, 4, 2);
    ctx.fillStyle = 'rgba(60,30,10,0.5)';
    ctx.fillRect(M(25) - 1, 3, 1, 4);
  } else {
    ctx.fillStyle = '#e8c040';
    ctx.fillRect(M(23) - 1, 2, 6, 2);
    ctx.fillStyle = '#c09020';
    ctx.fillRect(M(23) - 1, 4, 5, 2);
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.fillRect(M(23) - 1, 2, 2, 1);
  }

  if (state === 'glide' || state === 'glide2') {

    const lift = state === 'glide2' ? -2 : 0;
    ctx.fillStyle = O;
    ctx.fillRect(M(13) - 3, 6 + lift, 13, 8);
    ctx.fillStyle = '#c4cae8';
    ctx.fillRect(M(14) - 3, 7 + lift, 11, 6);
    for (let i = 0; i < 4; i++) {
      ctx.fillStyle = '#8a90c0';
      ctx.fillRect(M(17) + 1 - 3, 8 + lift + i, 6, 1);
    }
    ctx.fillStyle = '#dcdef4';
    ctx.fillRect(M(12) - 3, 9 + lift, 3, 3);
    ctx.fillRect(M(24) - 3, 7 + lift, 2, 5);
  } else if (state === 'fly' || state === 'fly2') {

    const lift = state === 'fly2' ? 3 : 0;
    ctx.fillStyle = O;
    ctx.fillRect(M(15) - 1, 6 + lift, 9, 7);
    ctx.fillStyle = '#b8c0e4';
    ctx.fillRect(M(16) - 1, 7 + lift, 7, 5);
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.fillRect(M(16) - 1, 7 + lift, 7, 1);
  } else if (state === 'wallslide') {
    ctx.fillStyle = O;
    ctx.fillRect(M(15) - 1, 6, 6, 8);
    ctx.fillStyle = '#b8c0e4';
    ctx.fillRect(M(16) - 1, 7, 4, 6);
  } else if (jump) {
    ctx.fillStyle = O;
    ctx.fillRect(M(14) - 1, 5, 6, 8);
    ctx.fillStyle = '#c0c8ea';
    ctx.fillRect(M(15) - 1, 6, 4, 6);
  } else if (dash) {

    ctx.fillStyle = O;
    ctx.fillRect(M(5) - 1, 8, 9, 5);
    ctx.fillStyle = '#b8c0e4';
    ctx.fillRect(M(6) - 1, 9, 7, 3);
  } else {

    ctx.fillStyle = O;
    ctx.fillRect(M(14) - 1, 10, 6, 7);
    ctx.fillStyle = '#bec6e8';
    ctx.fillRect(M(15) - 1, 11, 4, 5);
    ctx.fillStyle = 'rgba(90,95,140,0.35)';
    ctx.fillRect(M(15) - 1, 13, 4, 1);
  }

  return c;
}

function genCatSprite(aggro) {
  const c = makeCanvas(28, 24);
  const body = aggro ? '#808070' : PALETTE.cat;
  const head = aggro ? '#a0a090' : PALETTE.catHead;

  pxRect(c, 2, 15, 6, 2, PALETTE.catDark);
  pxRect(c, 2, 13, 2, 2, PALETTE.catDark);

  pxRect(c, 6, 8, 16, 14, body);
  pxRect(c, 8, 12, 12, 10, '#6a6070');

  pxRect(c, 7, 0, 14, 9, head);

  pxRect(c, 6, -2, 4, 4, body);
  pxRect(c, 18, -2, 4, 4, body);
  pxRect(c, 7, -1, 2, 2, PALETTE.catEar);
  pxRect(c, 19, -1, 2, 2, PALETTE.catEar);

  const eye = aggro ? PALETTE.catAggro : PALETTE.catEye;
  pxRect(c, 9, 3, 4, 3, eye);
  pxRect(c, 15, 3, 4, 3, eye);
  pxRect(c, 10, 4, 2, 2, '#080808');
  pxRect(c, 16, 4, 2, 2, '#080808');

  if (aggro) {
    ctx_stroke(c, 6, 6, 1, 8, '#ff4040');
    ctx_stroke(c, 22, 7, 1, 6, '#ff4040');
  }
  return c;
}

function genRatSprite() {
  const c = makeCanvas(20, 16);

  pxRect(c, 1, 8, 5, 2, PALETTE.ratTail);
  pxRect(c, 3, 6, 3, 2, PALETTE.ratTail);

  pxRect(c, 4, 4, 12, 10, PALETTE.rat);
  pxRect(c, 6, 8, 8, 6, '#463a24');

  pxRect(c, 14, 3, 6, 6, PALETTE.ratHead);

  pxRect(c, 13, 0, 3, 3, PALETTE.ratDark);
  pxRect(c, 17, 0, 3, 3, PALETTE.ratDark);

  pxRect(c, 15, 4, 2, 2, PALETTE.ratEye);
  pxRect(c, 19, 4, 2, 2, PALETTE.ratEye);

  pxRect(c, 18, 7, 2, 1, '#fff');
  return c;
}

function genCrowSprite(aggro) {
  const c = makeCanvas(26, 24);

  pxRect(c, 3, 6, 6, 10, PALETTE.crowWing);
  pxRect(c, 17, 6, 6, 10, PALETTE.crowWing);
  pxRect(c, 4, 8, 4, 6, '#2a2a36');

  pxRect(c, 6, 4, 14, 16, PALETTE.crowBody);
  pxRect(c, 8, 8, 10, 11, PALETTE.crow);

  pxRect(c, 8, 0, 10, 8, PALETTE.crowBody);

  pxRect(c, 9, -3, 2, 5, '#2a2838');
  pxRect(c, 12, -5, 2, 7, '#2a2838');
  pxRect(c, 15, -3, 2, 4, '#2a2838');

  pxRect(c, 16, 2, 6, 3, PALETTE.crowBeak);
  pxRect(c, 16, 5, 5, 2, PALETTE.crowBeakDark);

  const eye = aggro ? PALETTE.crowEyeAggro : PALETTE.crowEye;
  pxRect(c, 11, 2, 3, 3, eye);
  return c;
}

function genPalouSprite() {
  const c = makeCanvas(20, 8);
  const ctx = c.getContext('2d');
  const grad = ctx.createLinearGradient(0, 0, 20, 0);
  grad.addColorStop(0, 'rgba(106,176,216,0)');
  grad.addColorStop(0.7, 'rgba(106,176,216,0.9)');
  grad.addColorStop(1, '#c0e8ff');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 8, 8);
  ctx.clearRect(8, 0, 12, 8);
  ctx.fillStyle = '#6ab0d8';
  ctx.fillRect(8, 0, 12, 8);
  ctx.fillStyle = '#e8f4ff';
  ctx.fillRect(16, 2, 4, 4);
  return c;
}

function ctx_stroke(c, x, y, w, h, color) {
  const ctx = c.getContext('2d');
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + w, y + h);
  ctx.stroke();
}

const SPRITES = {};

function buildSprites() {
  const states = ['idle', 'walk', 'run', 'jump', 'fall', 'glide', 'fly', 'wallslide', 'dash', 'attack'];
  states.forEach(st => {
    SPRITES[`pigeon_${st}_r`] = genPigeonSprite(st, 1);
    SPRITES[`pigeon_${st}_l`] = genPigeonSprite(st, -1);
  });

  ['fly', 'glide'].forEach(st => {
    SPRITES[`pigeon_${st}2_r`] = genPigeonSprite(st, 1, true);
    SPRITES[`pigeon_${st}2_l`] = genPigeonSprite(st, -1, true);
  });
  SPRITES.gato      = genCatSprite(false);
  SPRITES.gato_agro = genCatSprite(true);
  SPRITES.gato_grande = (() => {
    const g = genCatSprite(false);
    const big = makeCanvas(36, 30);
    const ctx = big.getContext('2d');
    ctx.drawImage(g, 0, 0, g.width, g.height, 0, 0, 36, 30);
    return big;
  })();
  SPRITES.rata      = genRatSprite();
  SPRITES.rata_voladora = (() => {
    const r = genRatSprite();
    const c = makeCanvas(24, 20);
    const ctx = c.getContext('2d');
    ctx.drawImage(r, 0, 0, r.width, r.height, 2, 2, 18, 14);
    ctx.fillStyle = '#4a2a3a';
    ctx.fillRect(0, 4, 6, 4);
    ctx.fillRect(4, 0, 4, 4);
    ctx.fillRect(18, 4, 6, 4);
    ctx.fillRect(18, 0, 4, 4);
    return c;
  })();
  SPRITES.cuervo    = genCrowSprite(false);
  SPRITES.cuervo_agro  = genCrowSprite(true);
  SPRITES.jefe_cuervo = (() => {
    const c = makeCanvas(60, 50);
    const ctx = c.getContext('2d');
    const bg = genCrowSprite(true);
    ctx.drawImage(bg, 0, 0, bg.width, bg.height, 4, 6, 52, 42);

    for (let i = 0; i < 7; i++) {
      pxRect(c, 10 + i * 6, 10 - i + 2, 3, 10 + i % 3, PALETTE.bossCrown[i % 2]);
    }

    ctx.fillStyle = PALETTE.bossEye;
    ctx.fillRect(16, 16, 6, 6);
    ctx.fillRect(40, 16, 6, 6);
    ctx.fillStyle = '#fff';
    ctx.fillRect(18, 18, 2, 2);
    ctx.fillRect(42, 18, 2, 2);

    ctx.fillStyle = '#c09020';
    ctx.fillRect(24, 28, 16, 5);
    ctx.fillStyle = '#a07018';
    ctx.fillRect(25, 33, 14, 3);
    return c;
  })();
  SPRITES.jefe_rata = (() => {
    const c = makeCanvas(48, 40);
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#2a1a0c';
    ctx.fillRect(4, 12, 36, 22);
    ctx.fillStyle = '#3a2814';
    ctx.fillRect(6, 16, 30, 17);

    ctx.fillStyle = '#382410';
    ctx.fillRect(8, 4, 28, 12);

    ctx.fillStyle = '#4a3018';
    ctx.fillRect(4, 0, 6, 6);
    ctx.fillRect(34, 0, 6, 6);
    ctx.fillStyle = '#c06060';
    ctx.fillRect(5, 1, 4, 3);
    ctx.fillRect(35, 1, 4, 3);

    ctx.fillStyle = '#ff3030';
    ctx.fillRect(14, 7, 4, 4);
    ctx.fillRect(26, 7, 4, 4);
    ctx.fillStyle = '#fff';
    ctx.fillRect(15, 7, 2, 2);
    ctx.fillRect(27, 7, 2, 2);

    ctx.fillStyle = '#fff';
    ctx.fillRect(18, 13, 3, 3);
    ctx.fillRect(25, 13, 3, 3);

    ctx.fillStyle = '#2a1808';
    ctx.fillRect(2, 22, 5, 3);
    ctx.fillRect(2, 26, 5, 3);
    return c;
  })();

  SPRITES.npc_lechuga = (() => {
    const c = makeCanvas(20, 22);
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#c8a040';
    ctx.fillRect(2, 8, 16, 12);
    ctx.fillStyle = '#d0b050';
    ctx.fillRect(4, 2, 12, 8);
    ctx.fillStyle = '#080810';
    ctx.fillRect(6, 4, 2, 2);
    ctx.fillRect(12, 4, 2, 2);
    ctx.fillStyle = '#f8e060';
    ctx.fillRect(3, 0, 2, 3);
    ctx.fillRect(8, -1, 2, 4);
    ctx.fillRect(13, 0, 2, 3);
    return c;
  })();

  SPRITES.migaja = (() => {
    const c = makeCanvas(8, 8);
    pxRect(c, 1, 2, 6, 4, '#c09028');
    pxRect(c, 2, 3, 5, 3, '#e8c840');
    pxRect(c, 3, 3, 2, 2, '#f8e060');
    return c;
  })();
  SPRITES.migaja2 = (() => {
    const c = makeCanvas(10, 10);
    pxRect(c, 1, 2, 8, 6, '#c09028');
    pxRect(c, 2, 3, 7, 5, '#e8c840');
    pxRect(c, 3, 4, 4, 3, '#f8e060');
    return c;
  })();
  SPRITES.migaja5 = (() => {
    const c = makeCanvas(12, 12);
    pxRect(c, 1, 2, 10, 8, '#b08020');
    pxRect(c, 2, 3, 9, 7, '#ffe060');
    pxRect(c, 3, 4, 6, 5, '#fff8a0');
    return c;
  })();

  SPRITES.palou = genPalouSprite();

  SPRITES.heart = (() => {
    const c = makeCanvas(12, 12);
    c.getContext('2d').fillStyle = '#c03030';
    c.getContext('2d').fillRect(1, 3, 3, 3);
    c.getContext('2d').fillRect(8, 3, 3, 3);
    c.getContext('2d').fillRect(2, 5, 8, 5);
    c.getContext('2d').fillStyle = '#f06060';
    c.getContext('2d').fillRect(2, 4, 3, 3);
    c.getContext('2d').fillRect(7, 4, 3, 3);
    return c;
  })();

  SPRITES.energy = (() => {
    const c = makeCanvas(10, 14);
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#ffe060';
    ctx.fillRect(3, 2, 4, 3);
    ctx.fillRect(2, 5, 6, 3);
    ctx.fillRect(3, 8, 5, 2);
    ctx.fillStyle = '#fff8a0';
    ctx.fillRect(3, 3, 2, 2);
    return c;
  })();
}

const SpriteSystem = {
  load: loadAssets,
  onReady: onAssetsReady,
  getImg,
  build: buildSprites,
  get(name) { return SPRITES[name] || null; },
  ready: () => ASSETS.ready,
};

buildSprites();