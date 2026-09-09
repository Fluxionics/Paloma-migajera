// =============================================
//  PALOMA MIGAJERA v4 — MAP ENGINE
//  Mejoras: más parallax, ambient particles,
//  better lighting, moving elements
// =============================================

const MAP_W = 3200;
const MAP_H = 900;

// Imagen de fondo real (fondo.jpg)
let BG_FONDO = null;
let DECOR_PNG = null;
(function loadAssets() {
  const img = new Image();
  img.onload = () => { BG_FONDO = img; };
  img.src = '../fondo.jpg';
  const dec = new Image();
  dec.onload = () => { DECOR_PNG = dec; };
  dec.src = '../decoracion.png';
})();

function buildZone(zoneId) {
  const vis = document.createElement('canvas');
  const col = document.createElement('canvas');
  vis.width = col.width = MAP_W;
  vis.height = col.height = MAP_H;
  const vctx = vis.getContext('2d');
  const cctx = col.getContext('2d');
  cctx.fillStyle = '#000';
  cctx.fillRect(0, 0, MAP_W, MAP_H);
  const builder = ZONES[zoneId] || ZONES['ciudad_alta'];
  builder(vctx, cctx, MAP_W, MAP_H);
  const colData = cctx.getImageData(0, 0, MAP_W, MAP_H);
  return { visual: vis, colData, w: MAP_W, h: MAP_H };
}

function isSolid(colData, x, y) {
  const px = Math.floor(x);
  const py = Math.floor(y);
  if (px < 0 || py < 0 || px >= MAP_W || py >= MAP_H) return true;
  const idx = (py * MAP_W + px) * 4;
  return colData.data[idx] > 128;
}

// =============================================
//  ZONE DEFINITIONS
// =============================================
const ZONES = {

  ciudad_alta(v, c, W, H) {
    // Fondo real si está cargado (fondo.jpg)
    if (BG_FONDO) {
      try {
        const scale = Math.max(W / BG_FONDO.width, H / BG_FONDO.height);
        const fw = BG_FONDO.width * scale;
        const fh = BG_FONDO.height * scale;
        v.drawImage(BG_FONDO, (W - fw) / 2, 0, fw, Math.min(fh, H));
        // Oscurecer la mitad inferior para que las plataformas resalten
        const dark = v.createLinearGradient(0, H * 0.45, 0, H);
        dark.addColorStop(0, 'rgba(8,8,16,0.45)');
        dark.addColorStop(1, 'rgba(8,8,16,0.85)');
        v.fillStyle = dark;
        v.fillRect(0, 0, W, H);
      } catch { /* fallback al escenario procedural */ }
    }

    // Sky gradient (deeper, more atmospheric)
    const sky = v.createLinearGradient(0, 0, 0, H * 0.65);
    sky.addColorStop(0, '#060810');
    sky.addColorStop(0.3, '#0d1020');
    sky.addColorStop(0.6, '#161830');
    sky.addColorStop(1, '#1e1a35');
    v.fillStyle = sky;
    if (BG_FONDO) v.globalAlpha = 0.35;   // atenuado si hay fondo real
    v.fillRect(0, 0, W, H);
    v.globalAlpha = 1;

    // Nebula-like clouds
    v.save();
    v.globalAlpha = 0.04;
    for (let i = 0; i < 5; i++) {
      const nx = pseudoRand(i * 37, W);
      const ny = pseudoRand(i * 53, H * 0.4);
      const nr = pseudoRand(i * 19, 200) + 100;
      const cGrad = v.createRadialGradient(nx, ny, 0, nx, ny, nr);
      cGrad.addColorStop(0, i % 2 === 0 ? '#3040a0' : '#a04060');
      cGrad.addColorStop(1, 'transparent');
      v.fillStyle = cGrad;
      v.fillRect(nx - nr, ny - nr, nr * 2, nr * 2);
    }
    v.restore();

    // Stars (improved - twinkle effect baked in)
    for (let i = 0; i < 180; i++) {
      const sx = pseudoRand(i * 13, W);
      const sy = pseudoRand(i * 17, H * 0.5);
      const sr = pseudoRand(i * 7, 1.8) + 0.2;
      const bright = pseudoRand(i * 23, 0.5) + 0.3;
      v.fillStyle = `rgba(255,255,255,${bright})`;
      if (sr > 1.2) { v.save(); v.shadowColor = '#fff'; v.shadowBlur = 5; }
      v.beginPath(); v.arc(sx, sy, sr, 0, Math.PI * 2); v.fill();
      if (sr > 1.2) v.restore();
    }

    // Shooting star (static position, looks good as map art)
    v.save();
    v.globalAlpha = 0.4;
    v.strokeStyle = '#fff';
    v.lineWidth = 1;
    v.beginPath();
    v.moveTo(W * 0.3, H * 0.08);
    v.lineTo(W * 0.3 + 40, H * 0.08 + 15);
    v.stroke();
    v.restore();

    // Moon (larger, more detailed)
    v.save();
    // Moon glow
    const moonGrad = v.createRadialGradient(W * 0.82, 80, 10, W * 0.82, 80, 80);
    moonGrad.addColorStop(0, 'rgba(240,232,176,0.15)');
    moonGrad.addColorStop(1, 'transparent');
    v.fillStyle = moonGrad;
    v.beginPath(); v.arc(W * 0.82, 80, 80, 0, Math.PI * 2); v.fill();
    // Moon body
    v.shadowColor = '#f0e8b0'; v.shadowBlur = 50;
    v.fillStyle = '#f0e8b0';
    v.beginPath(); v.arc(W * 0.82, 80, 35, 0, Math.PI * 2); v.fill();
    // Moon craters
    v.shadowBlur = 0;
    v.fillStyle = 'rgba(200,190,140,0.4)';
    v.beginPath(); v.arc(W * 0.82 - 8, 75, 6, 0, Math.PI * 2); v.fill();
    v.beginPath(); v.arc(W * 0.82 + 10, 85, 4, 0, Math.PI * 2); v.fill();
    v.beginPath(); v.arc(W * 0.82 - 3, 90, 3, 0, Math.PI * 2); v.fill();
    v.restore();

    // Far buildings (parallax layer 1 - darkest)
    drawBuildings(v, W, H, 0.0, 0.22, '#08080f', '#0e0e18', 60, 160, 240);
    // Mid buildings (parallax layer 2)
    drawBuildings(v, W, H, 0.10, 0.32, '#0c0c16', '#121220', 80, 200, 300);
    // Near buildings (parallax layer 3)
    drawBuildings(v, W, H, 0.22, 0.45, '#10101c', '#181828', 90, 240, 350);

    // Distant city glow
    v.save();
    v.globalAlpha = 0.05;
    const cityGlow = v.createLinearGradient(0, H * 0.35, 0, H * 0.55);
    cityGlow.addColorStop(0, 'transparent');
    cityGlow.addColorStop(0.5, '#e8c840');
    cityGlow.addColorStop(1, 'transparent');
    v.fillStyle = cityGlow;
    v.fillRect(0, H * 0.35, W, H * 0.2);
    v.restore();

    // Textura de decoracion.png sobre las fachadas (muy sutil)
    if (DECOR_PNG) {
      try {
        v.save();
        v.globalAlpha = 0.16;
        const tileW = 64, tileH = 64;
        for (let tx = 0; tx < W; tx += tileW) {
          for (let ty = H * 0.5; ty < H - 90; ty += tileH) {
            v.drawImage(DECOR_PNG, tx, ty, tileW, tileH);
          }
        }
        v.restore();
      } catch {}
    }

    // Platform visuals
    drawPlatformVisuals(v, W, H);
    // Urban details
    drawUrbanDetails(v, W, H);

    // Collisions
    c.fillStyle = '#fff';
    drawPlatformCollisions(c, W, H);
  },

  alcantarillas(v, c, W, H) {
    // Dark green/brown gradient
    const bg = v.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, '#050808');
    bg.addColorStop(0.3, '#080c08');
    bg.addColorStop(0.7, '#0a0e08');
    bg.addColorStop(1, '#0c100a');
    v.fillStyle = bg;
    v.fillRect(0, 0, W, H);

    // Dripping water streaks (background)
    v.fillStyle = 'rgba(0,60,40,0.08)';
    for (let i = 0; i < 30; i++) {
      const dx = pseudoRand(i * 31, W);
      const dw = pseudoRand(i * 17, 3) + 1;
      v.fillRect(dx, 0, dw, H);
    }

    // Moss patches
    v.fillStyle = 'rgba(30,60,20,0.12)';
    for (let i = 0; i < 15; i++) {
      const mx = pseudoRand(i * 41, W);
      const my = pseudoRand(i * 23, H * 0.3) + H * 0.1;
      v.fillRect(mx, my, pseudoRand(i * 7, 40) + 20, pseudoRand(i * 11, 8) + 4);
    }

    // Pipes and walls
    drawAlcantarillaVisuals(v, W, H);

    c.fillStyle = '#fff';
    drawAlcantarillaCollisions(c, W, H);
  }
};

// =============================================
//  HELPERS — Ciudad Alta
// =============================================

function pseudoRand(seed, max) {
  return ((Math.sin(seed * 9301 + 49297) * 0.5 + 0.5)) * max;
}

function drawBuildings(ctx, W, H, yStart, yEnd, color, roofColor, minW, maxW, minH) {
  const y0 = H * yStart;
  const y1 = H * yEnd;
  let x = 0;
  let bi = 0;
  while (x < W) {
    const bw = pseudoRand(bi * 7 + 1, maxW - minW) + minW;
    const bh = pseudoRand(bi * 11 + 3, y1 - y0 - minH) + minH;
    const by = H - bh;
    ctx.fillStyle = color;
    ctx.fillRect(x, by, bw, bh);
    // Roof
    ctx.fillStyle = roofColor;
    ctx.fillRect(x, by, bw, 4);
    // Roof detail
    ctx.fillStyle = 'rgba(255,255,255,0.03)';
    ctx.fillRect(x, by, bw, 1);
    // Windows (warm glow)
    for (let wy = by + 14; wy < by + bh - 10; wy += 24) {
      for (let wx = x + 10; wx < x + bw - 10; wx += 18) {
        const lit = pseudoRand(wx * wy, 1) > 0.3;
        if (lit) {
          const warm = pseudoRand(wx + wy, 1) > 0.5;
          ctx.fillStyle = warm ? 'rgba(255,220,100,0.10)' : 'rgba(200,220,255,0.06)';
          ctx.fillRect(wx, wy, 8, 10);
          // Window frame
          ctx.fillStyle = 'rgba(255,255,255,0.03)';
          ctx.fillRect(wx, wy + 4, 8, 1);
        }
      }
    }
    // Chimney (some buildings)
    if (pseudoRand(bi * 13, 1) > 0.6) {
      const chW = 8;
      const chX = x + bw * pseudoRand(bi * 19, 0.6) + bw * 0.2;
      ctx.fillStyle = color;
      ctx.fillRect(chX, by - 20, chW, 24);
      ctx.fillStyle = roofColor;
      ctx.fillRect(chX - 1, by - 20, chW + 2, 3);
    }
    x += bw + pseudoRand(bi * 5 + 9, 10);
    bi++;
  }
}

function drawPlatformVisuals(ctx, W, H) {
  const ground = H - 60;
  // Main ground with better gradient
  const gGrad = ctx.createLinearGradient(0, ground - 5, 0, H);
  gGrad.addColorStop(0, '#2a2a38');
  gGrad.addColorStop(0.05, '#252530');
  gGrad.addColorStop(1, '#16161e');
  ctx.fillStyle = gGrad;
  ctx.fillRect(0, ground, W, H - ground);

  // Ground top edge (highlight)
  ctx.fillStyle = '#383848';
  ctx.fillRect(0, ground, W, 2);
  ctx.fillStyle = '#303040';
  ctx.fillRect(0, ground + 2, W, 1);

  // Tile texture
  ctx.fillStyle = 'rgba(255,255,255,0.02)';
  for (let tx = 0; tx < W; tx += 48) {
    ctx.fillRect(tx, ground + 6, 44, 2);
    ctx.fillRect(tx + 24, ground + 16, 44, 2);
    ctx.fillRect(tx + 12, ground + 26, 44, 2);
  }

  // Small cracks in ground
  ctx.strokeStyle = 'rgba(0,0,0,0.15)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 20; i++) {
    const cx = pseudoRand(i * 47, W);
    ctx.beginPath();
    ctx.moveTo(cx, ground + 3);
    ctx.lineTo(cx + pseudoRand(i * 23, 10) - 5, ground + pseudoRand(i * 31, 15) + 3);
    ctx.stroke();
  }

  // Platforms
  PLATFORM_DATA.forEach(p => {
    if (p.type === 'stone') {
      const pg = ctx.createLinearGradient(p.x, p.y, p.x, p.y + p.h);
      pg.addColorStop(0, '#2e2e42');
      pg.addColorStop(1, '#1e1e2a');
      ctx.fillStyle = pg;
      ctx.fillRect(p.x, p.y, p.w, p.h);
      // Top highlight
      ctx.fillStyle = '#3a3a52';
      ctx.fillRect(p.x, p.y, p.w, 3);
      ctx.fillStyle = '#343448';
      ctx.fillRect(p.x, p.y + 3, p.w, 1);
      // Stone texture
      ctx.fillStyle = 'rgba(255,255,255,0.035)';
      for (let bx = p.x + 10; bx < p.x + p.w - 5; bx += 22) {
        ctx.fillRect(bx, p.y + 5, 1, p.h - 6);
      }
      // Bottom shadow
      ctx.fillStyle = 'rgba(0,0,0,0.15)';
      ctx.fillRect(p.x, p.y + p.h, p.w, 3);
    } else if (p.type === 'wood') {
      ctx.fillStyle = '#3a2810';
      ctx.fillRect(p.x, p.y, p.w, p.h);
      ctx.fillStyle = '#4a3418';
      ctx.fillRect(p.x, p.y, p.w, 2);
      // Wood grain
      ctx.fillStyle = '#2a1a08';
      for (let bx = p.x + 8; bx < p.x + p.w; bx += 14) {
        ctx.fillRect(bx, p.y + 2, 1, p.h - 2);
      }
      ctx.fillStyle = 'rgba(255,255,255,0.05)';
      for (let bx = p.x + 4; bx < p.x + p.w; bx += 14) {
        ctx.fillRect(bx, p.y + 3, 1, p.h - 3);
      }
      // Nails
      ctx.fillStyle = '#606060';
      ctx.fillRect(p.x + 3, p.y + 4, 2, 2);
      ctx.fillRect(p.x + p.w - 5, p.y + 4, 2, 2);
    } else if (p.type === 'metal') {
      ctx.fillStyle = '#283040';
      ctx.fillRect(p.x, p.y, p.w, p.h);
      ctx.fillStyle = '#405060';
      ctx.fillRect(p.x, p.y, p.w, 2);
      // Rivets
      ctx.fillStyle = '#506878';
      for (let bx = p.x; bx < p.x + p.w; bx += 18) {
        ctx.fillRect(bx, p.y + 5, 3, 3);
      }
      // Metal sheen
      ctx.fillStyle = 'rgba(255,255,255,0.04)';
      ctx.fillRect(p.x, p.y, p.w, 1);
    } else if (p.type === 'chain') {
      ctx.fillStyle = '#222';
      ctx.fillRect(p.x, p.y, p.w, p.h);
      ctx.fillStyle = '#404060';
      ctx.fillRect(p.x, p.y, p.w, 3);
      // Chains (individual links)
      ctx.fillStyle = '#505060';
      ctx.fillRect(p.x + 10, p.y - 24, 4, 26);
      ctx.fillRect(p.x + p.w - 14, p.y - 24, 4, 26);
      // Chain links
      ctx.fillStyle = '#606070';
      for (let cy = p.y - 22; cy < p.y; cy += 6) {
        ctx.fillRect(p.x + 8, cy, 8, 4);
        ctx.fillRect(p.x + p.w - 16, cy, 8, 4);
      }
    }
  });
}

function drawPlatformCollisions(ctx, W, H) {
  const ground = H - 60;
  ctx.fillRect(0, ground, W, H - ground);
  PLATFORM_DATA.forEach(p => ctx.fillRect(p.x, p.y, p.w, p.h));
}

function drawUrbanDetails(ctx, W, H) {
  const ground = H - 60;

  // Street lamps (with light halos)
  const farolas = [80, 320, 680, 1040, 1450, 1890, 2300, 2750, 3050];
  farolas.forEach((fx, idx) => {
    // Post
    ctx.fillStyle = '#222230';
    ctx.fillRect(fx - 3, ground - 85, 6, 85);
    // Post base
    ctx.fillStyle = '#2a2a38';
    ctx.fillRect(fx - 6, ground - 5, 12, 5);
    // Lamp housing
    ctx.fillStyle = '#303040';
    ctx.fillRect(fx - 7, ground - 90, 14, 8);
    // Lamp light
    ctx.save();
    ctx.shadowColor = '#f0d080';
    ctx.shadowBlur = 28;
    ctx.fillStyle = '#f0d080';
    ctx.beginPath(); ctx.arc(fx, ground - 82, 5, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    // Light halo (cone)
    const lGrad = ctx.createRadialGradient(fx, ground - 82, 0, fx, ground - 40, 100);
    lGrad.addColorStop(0, 'rgba(240,208,128,0.10)');
    lGrad.addColorStop(0.5, 'rgba(240,208,128,0.04)');
    lGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = lGrad;
    ctx.beginPath(); ctx.arc(fx, ground - 60, 100, 0, Math.PI * 2); ctx.fill();
  });

  // Signs
  const carteles = [
    { x: 200, y: ground - 170, txt: 'PANADERÍA', color: '#a090c0' },
    { x: 900, y: ground - 210, txt: 'ZONA GATOS', color: '#c08080' },
    { x: 1600, y: ground - 190, txt: 'ZONA NORTE', color: '#80a0c0' },
    { x: 2400, y: ground - 180, txt: 'CUIDADO', color: '#c0a060' },
  ];
  carteles.forEach(cd => {
    // Sign board
    ctx.fillStyle = '#14101c';
    ctx.fillRect(cd.x, cd.y - 26, 140, 30);
    ctx.fillStyle = '#282040';
    ctx.fillRect(cd.x, cd.y - 26, 140, 2);
    // Post
    ctx.fillStyle = '#1a1828';
    ctx.fillRect(cd.x + 68, cd.y + 4, 4, 16);
    // Text
    ctx.font = '11px Cinzel, serif';
    ctx.fillStyle = cd.color;
    ctx.fillText(cd.txt, cd.x + 8, cd.y - 7);
  });

  // Hanging wires between buildings
  ctx.strokeStyle = 'rgba(255,255,255,0.04)';
  ctx.lineWidth = 1;
  const wirePoints = [150, 500, 850, 1200, 1650, 2050, 2450, 2800];
  for (let i = 0; i < wirePoints.length - 1; i++) {
    const x1 = wirePoints[i];
    const x2 = wirePoints[i + 1];
    ctx.beginPath();
    ctx.moveTo(x1, ground - 120 + pseudoRand(i, 30));
    ctx.quadraticCurveTo((x1 + x2) / 2, ground - 90 + pseudoRand(i * 3, 40), x2, ground - 130 + pseudoRand(i * 5, 30));
    ctx.stroke();
  }
}

// =============================================
//  PLATFORM DATA — Ciudad Alta
// =============================================
const PLATFORM_DATA = [
  { x: 100, y: 760, w: 160, h: 14, type: 'stone' },
  { x: 320, y: 720, w: 120, h: 14, type: 'stone' },
  { x: 500, y: 680, w: 100, h: 14, type: 'wood' },
  { x: 660, y: 720, w: 130, h: 14, type: 'stone' },
  { x: 840, y: 660, w: 100, h: 14, type: 'stone' },
  { x: 1000, y: 700, w: 110, h: 14, type: 'metal' },
  { x: 1160, y: 640, w: 90, h: 14, type: 'stone' },
  { x: 1300, y: 700, w: 140, h: 14, type: 'stone' },
  { x: 1480, y: 640, w: 80, h: 14, type: 'chain' },
  { x: 1600, y: 700, w: 100, h: 14, type: 'wood' },
  { x: 1750, y: 640, w: 120, h: 14, type: 'stone' },
  { x: 1920, y: 580, w: 90, h: 14, type: 'stone' },
  { x: 2060, y: 640, w: 100, h: 14, type: 'metal' },
  { x: 2200, y: 560, w: 80, h: 14, type: 'wood' },
  { x: 2340, y: 620, w: 110, h: 14, type: 'stone' },
  { x: 2480, y: 560, w: 90, h: 14, type: 'chain' },
  { x: 2620, y: 620, w: 130, h: 14, type: 'stone' },
  { x: 2800, y: 560, w: 100, h: 14, type: 'stone' },
  { x: 2960, y: 600, w: 120, h: 14, type: 'metal' },
  { x: 3060, y: 540, w: 80, h: 14, type: 'stone' },
  { x: 450, y: 560, w: 60, h: 10, type: 'wood' },
  { x: 780, y: 520, w: 60, h: 10, type: 'wood' },
  { x: 1380, y: 500, w: 60, h: 10, type: 'chain' },
  { x: 2100, y: 440, w: 60, h: 10, type: 'stone' },
  { x: 2780, y: 420, w: 60, h: 10, type: 'chain' },
  { x: 0, y: 720, w: 80, h: 14, type: 'stone' },
  { x: 0, y: 620, w: 60, h: 12, type: 'stone' },
  { x: 3120, y: 720, w: 80, h: 14, type: 'stone' },
  { x: 3120, y: 620, w: 60, h: 12, type: 'stone' },
];

// =============================================
//  ALCANTARILLAS
// =============================================
function drawAlcantarillaVisuals(ctx, W, H) {
  // Floor
  const floorGrad = ctx.createLinearGradient(0, H - 60, 0, H);
  floorGrad.addColorStop(0, '#0e160e');
  floorGrad.addColorStop(1, '#080c08');
  ctx.fillStyle = floorGrad;
  ctx.fillRect(0, H - 60, W, 60);
  ctx.fillStyle = '#1a2818';
  ctx.fillRect(0, H - 60, W, 3);
  ctx.fillStyle = '#162214';
  ctx.fillRect(0, H - 57, W, 1);

  // Brick pattern on floor
  ctx.fillStyle = 'rgba(255,255,255,0.015)';
  for (let tx = 0; tx < W; tx += 32) {
    ctx.fillRect(tx, H - 55, 28, 10);
    ctx.fillRect(tx + 16, H - 43, 28, 10);
  }

  // Platforms
  ALCANTARILLA_PLATS.forEach(p => {
    const pGrad = ctx.createLinearGradient(p.x, p.y, p.x, p.y + p.h);
    pGrad.addColorStop(0, '#1e2a1e');
    pGrad.addColorStop(1, '#141e14');
    ctx.fillStyle = pGrad;
    ctx.fillRect(p.x, p.y, p.w, p.h);
    ctx.fillStyle = '#304030';
    ctx.fillRect(p.x, p.y, p.w, 3);
    // Dampness effect
    ctx.fillStyle = 'rgba(80,120,80,0.08)';
    ctx.fillRect(p.x, p.y, p.w, 1);
  });

  // Pipes (horizontal)
  const pipes = [160, 380, 600, 900];
  pipes.forEach((ty, idx) => {
    // Pipe body
    ctx.fillStyle = '#182818';
    ctx.fillRect(0, ty, W, 22);
    // Pipe highlight
    ctx.fillStyle = '#283828';
    ctx.fillRect(0, ty, W, 3);
    ctx.fillStyle = '#203020';
    ctx.fillRect(0, ty + 18, W, 2);
    // Pipe rivets
    ctx.fillStyle = '#304830';
    for (let px = 0; px < W; px += 60) {
      ctx.fillRect(px, ty + 4, 4, 4);
      ctx.fillRect(px, ty + 14, 4, 4);
    }
    // Drip from pipe
    if (idx < 2) {
      const dripX = pseudoRand(idx * 73, W);
      ctx.fillStyle = 'rgba(60,100,60,0.3)';
      ctx.fillRect(dripX, ty + 22, 2, pseudoRand(idx * 37, 30) + 10);
    }
  });

  // Background algae/vegetation patches
  ctx.fillStyle = 'rgba(20,50,20,0.15)';
  for (let i = 0; i < 12; i++) {
    const gx = pseudoRand(i * 61, W);
    const gy = pseudoRand(i * 43, H * 0.5) + 100;
    ctx.beginPath();
    ctx.arc(gx, gy, pseudoRand(i * 19, 15) + 5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Dim ambient light spots
  ctx.save();
  ctx.globalAlpha = 0.03;
  for (let i = 0; i < 8; i++) {
    const lx = pseudoRand(i * 89, W);
    const ly = pseudoRand(i * 67, H);
    const lGrad = ctx.createRadialGradient(lx, ly, 0, lx, ly, 60);
    lGrad.addColorStop(0, '#60a060');
    lGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = lGrad;
    ctx.beginPath(); ctx.arc(lx, ly, 60, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}

function drawAlcantarillaCollisions(ctx, W, H) {
  ctx.fillRect(0, H - 60, W, 60);
  ALCANTARILLA_PLATS.forEach(p => ctx.fillRect(p.x, p.y, p.w, p.h));
  [160, 380, 600, 900].forEach(ty => ctx.fillRect(0, ty, W, 22));
}

const ALCANTARILLA_PLATS = [
  { x: 100, y: 750, w: 140, h: 12 },
  { x: 300, y: 700, w: 100, h: 12 },
  { x: 480, y: 660, w: 120, h: 12 },
  { x: 700, y: 720, w: 90, h: 12 },
  { x: 900, y: 680, w: 110, h: 12 },
  { x: 1100, y: 640, w: 130, h: 12 },
  { x: 1350, y: 700, w: 100, h: 12 },
];
