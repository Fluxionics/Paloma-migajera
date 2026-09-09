// =============================================
//  PALOMA MIGAJERA v4 — ASSET LOADER & SPRITES
//  Carga las imágenes reales de assets/.
//  Si no están disponibles, genera sprites
//  procedurales en canvas de alta calidad.
// =============================================

const ASSETS = {
  root: '../',          // ruta desde juego/
  imgs: {},
  ready: false,
  progress: 0,
  listeners: [],
};

// En el canvas del juego las rutas arrancan desde "juego/"
function resolveAsset(path) {
  return ASSETS.root + path.split('/').pop();
}

function loadAssets() {
  const files = ['decoracion.png', 'fondo.jpg', 'gato.gif', 'haduken.gif', 'Doble Salto.gif'];
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
      ASSETS.imgs[f] = null;   // marcamos como no disponible
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

// =============================================
//  PALETA DEL JUEGO
// =============================================
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

// =============================================
//  GENERADOR DE SPRITES PROCEDURALES (pixel art)
//  Escala base: cada sprite en rejilla de 2px
// =============================================
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

// ---- Paloma: 24x24 sprite, 8 direcciones básicas de animación ----
function genPigeonSprite(state, facing) {
  const c = makeCanvas(28, 26);
  const ctx = c.getContext('2d');
  const f = facing;                    // 1 derecha, -1 izquierda
  const flip = f < 0;
  const M = (x) => flip ? 28 - x : x;  // espejo horizontal

  pxRect(c, M(12) - 7, 20, 2, 5, PALETTE.feet);   // pata izq
  pxRect(c, M(18) - 7, 20, 2, 5, PALETTE.feet);   // pata der
  pxRect(c, M(12) - 8, 24, 4, 2, '#c09020');       // garra izq
  pxRect(c, M(18) - 8, 24, 4, 2, '#c09020');       // garra der

  // Cola (animada según estado)
  pxRect(c, M(3) - 0, 14, 6, 2, PALETTE.pigeonWingDark);
  pxRect(c, M(4) - 0, 16, 5, 2, PALETTE.pigeonBody);

  // Cuerpo
  pxRect(c, M(9) - 4, 8, 14, 12, PALETTE.pigeonBody);
  pxRect(c, M(11) - 4, 10, 10, 9, PALETTE.pigeonBelly);

  // Ala izquierda (trasera)
  pxRect(c, M(10) - 2, 10, 4, 8, PALETTE.pigeonWingDark);
  if (state === 'fly' || state === 'glide') {
    pxRect(c, M(8) - 2, 8, 3, 8, PALETTE.pigeonWingDark);
  }

  // Ala derecha (delantera)
  if (state === 'glide') {
    pxRect(c, M(20) - 4, 8, 4, 10, PALETTE.pigeonWing);
    pxRect(c, M(22) - 4, 6, 3, 6, PALETTE.pigeonWing);
    // plumas individuales
    pxRect(c, M(24) - 4, 10, 2, 4, '#c8d0f0');
  } else if (state === 'fly' || state === 'wallslide') {
    pxRect(c, M(19) - 4, 8, 4, 9, PALETTE.pigeonWing);
  } else {
    pxRect(c, M(18) - 3, 10, 3, 6, PALETTE.pigeonWing);
  }

  // Cabeza
  pxRect(c, M(13) - 2, 2, 10, 8, PALETTE.pigeonBelly);
  pxRect(c, M(12) - 2, 1, 12, 3, PALETTE.pigeonBody);

  // Ojo
  pxRect(c, M(18) - 1, 3, 3, 3, PALETTE.eye);
  pxRect(c, M(19) - 1, 3, 1, 1, '#ffffff');  // brillo

  // Pico
  pxRect(c, M(22) - 1, 3, 4, 2, PALETTE.beak);
  pxRect(c, M(22) - 1, 5, 3, 2, PALETTE.beakDark);

  return c;
}

// ---- Enemigo: Gato 28x22 ----
function genCatSprite(aggro) {
  const c = makeCanvas(28, 24);
  const body = aggro ? '#808070' : PALETTE.cat;
  const head = aggro ? '#a0a090' : PALETTE.catHead;

  // Cola
  pxRect(c, 2, 15, 6, 2, PALETTE.catDark);
  pxRect(c, 2, 13, 2, 2, PALETTE.catDark);

  // Cuerpo
  pxRect(c, 6, 8, 16, 14, body);
  pxRect(c, 8, 12, 12, 10, '#6a6070');

  // Cabeza
  pxRect(c, 7, 0, 14, 9, head);
  // Orejas
  pxRect(c, 6, -2, 4, 4, body);
  pxRect(c, 18, -2, 4, 4, body);
  pxRect(c, 7, -1, 2, 2, PALETTE.catEar);
  pxRect(c, 19, -1, 2, 2, PALETTE.catEar);

  // Ojos (glow aggro)
  const eye = aggro ? PALETTE.catAggro : PALETTE.catEye;
  pxRect(c, 9, 3, 4, 3, eye);
  pxRect(c, 15, 3, 4, 3, eye);
  pxRect(c, 10, 4, 2, 2, '#080808');
  pxRect(c, 16, 4, 2, 2, '#080808');

  // Bigotes si aggro
  if (aggro) {
    ctx_stroke(c, 6, 6, 1, 8, '#ff4040');
    ctx_stroke(c, 22, 7, 1, 6, '#ff4040');
  }
  return c;
}

// ---- Enemigo: Rata 20x16 ----
function genRatSprite() {
  const c = makeCanvas(20, 16);
  // Cola curva
  pxRect(c, 1, 8, 5, 2, PALETTE.ratTail);
  pxRect(c, 3, 6, 3, 2, PALETTE.ratTail);
  // Cuerpo
  pxRect(c, 4, 4, 12, 10, PALETTE.rat);
  pxRect(c, 6, 8, 8, 6, '#463a24');
  // Cabeza
  pxRect(c, 14, 3, 6, 6, PALETTE.ratHead);
  // Orejas
  pxRect(c, 13, 0, 3, 3, PALETTE.ratDark);
  pxRect(c, 17, 0, 3, 3, PALETTE.ratDark);
  // Ojos rojos
  pxRect(c, 15, 4, 2, 2, PALETTE.ratEye);
  pxRect(c, 19, 4, 2, 2, PALETTE.ratEye);
  // Dientes
  pxRect(c, 18, 7, 2, 1, '#fff');
  return c;
}

// ---- Enemigo: Cuervo 26x22 ----
function genCrowSprite(aggro) {
  const c = makeCanvas(26, 24);
  // Alas
  pxRect(c, 3, 6, 6, 10, PALETTE.crowWing);
  pxRect(c, 17, 6, 6, 10, PALETTE.crowWing);
  pxRect(c, 4, 8, 4, 6, '#2a2a36');
  // Cuerpo
  pxRect(c, 6, 4, 14, 16, PALETTE.crowBody);
  pxRect(c, 8, 8, 10, 11, PALETTE.crow);
  // Cabeza
  pxRect(c, 8, 0, 10, 8, PALETTE.crowBody);
  // Cresta
  pxRect(c, 9, -3, 2, 5, '#2a2838');
  pxRect(c, 12, -5, 2, 7, '#2a2838');
  pxRect(c, 15, -3, 2, 4, '#2a2838');
  // Pico
  pxRect(c, 16, 2, 6, 3, PALETTE.crowBeak);
  pxRect(c, 16, 5, 5, 2, PALETTE.crowBeakDark);
  // Ojo
  const eye = aggro ? PALETTE.crowEyeAggro : PALETTE.crowEye;
  pxRect(c, 11, 2, 3, 3, eye);
  return c;
}

// ---- Sprite de splash: posterior usa palomaduken ----
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

// ---- Construcción de la hoja de sprites usada por renderer ----
const SPRITES = {};

function buildSprites() {
  const states = ['idle', 'walk', 'run', 'jump', 'fall', 'glide', 'fly', 'wallslide', 'dash', 'attack'];
  states.forEach(st => {
    SPRITES[`pigeon_${st}_r`] = genPigeonSprite(st, 1);
    SPRITES[`pigeon_${st}_l`] = genPigeonSprite(st, -1);
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
    // Corona de plumas grande
    for (let i = 0; i < 7; i++) {
      pxRect(c, 10 + i * 6, 10 - i + 2, 3, 10 + i % 3, PALETTE.bossCrown[i % 2]);
    }
    // Ojos intensos
    ctx.fillStyle = PALETTE.bossEye;
    ctx.fillRect(16, 16, 6, 6);
    ctx.fillRect(40, 16, 6, 6);
    ctx.fillStyle = '#fff';
    ctx.fillRect(18, 18, 2, 2);
    ctx.fillRect(42, 18, 2, 2);
    // Pico dorado
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
    // Cabeza grande
    ctx.fillStyle = '#382410';
    ctx.fillRect(8, 4, 28, 12);
    // Orejas
    ctx.fillStyle = '#4a3018';
    ctx.fillRect(4, 0, 6, 6);
    ctx.fillRect(34, 0, 6, 6);
    ctx.fillStyle = '#c06060';
    ctx.fillRect(5, 1, 4, 3);
    ctx.fillRect(35, 1, 4, 3);
    // Ojos (fiero)
    ctx.fillStyle = '#ff3030';
    ctx.fillRect(14, 7, 4, 4);
    ctx.fillRect(26, 7, 4, 4);
    ctx.fillStyle = '#fff';
    ctx.fillRect(15, 7, 2, 2);
    ctx.fillRect(27, 7, 2, 2);
    // Colmillos
    ctx.fillStyle = '#fff';
    ctx.fillRect(18, 13, 3, 3);
    ctx.fillRect(25, 13, 3, 3);
    // Cola gruesa
    ctx.fillStyle = '#2a1808';
    ctx.fillRect(2, 22, 5, 3);
    ctx.fillRect(2, 26, 5, 3);
    return c;
  })();

  // NPCs
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

  // Migaja dorada (8x8)
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

  // Proyectil PALOMADUKEN
  SPRITES.palou = genPalouSprite();

  // Corazón de vida
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

  // Energía (rayo)
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

// ---- API pública ----
const SpriteSystem = {
  load: loadAssets,
  onReady: onAssetsReady,
  getImg,
  build: buildSprites,
  get(name) { return SPRITES[name] || null; },
  ready: () => ASSETS.ready,
};

// Auto-construir sprites procedurales
buildSprites();