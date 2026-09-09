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
let BG_BOSQUE = null;
(function loadAssets() {
  const img = new Image();
  img.onload = () => { BG_FONDO = img; };
  img.src = '../fondo.jpg';
  const dec = new Image();
  dec.onload = () => { DECOR_PNG = dec; };
  dec.src = '../decoracion.png';
  const bosque = new Image();
  bosque.onload = () => { BG_BOSQUE = bosque; };
  bosque.src = '../bosque encantado.JPG';
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
  },

  parque_palomas(v, c, W, H) {
    // Cielo nocturno verdiazul
    const sky = v.createLinearGradient(0, 0, 0, H * 0.7);
    sky.addColorStop(0, '#04121f');
    sky.addColorStop(0.4, '#0a2333');
    sky.addColorStop(0.7, '#123a3a');
    sky.addColorStop(1, '#0c2a2a');
    v.fillStyle = sky;
    v.fillRect(0, 0, W, H);

    // Estrellas frías
    for (let i = 0; i < 120; i++) {
      const sx = pseudoRand(i * 29, W);
      const sy = pseudoRand(i * 17, H * 0.35);
      v.fillStyle = `rgba(200,240,255,${0.2 + pseudoRand(i * 7, 0.4)})`;
      v.beginPath(); v.arc(sx, sy, pseudoRand(i * 3, 1.4) + 0.2, 0, Math.PI * 2); v.fill();
    }

    // Luna baja y fría
    v.save();
    const moonGrad = v.createRadialGradient(W * 0.18, H * 0.14, 5, W * 0.18, H * 0.14, 70);
    moonGrad.addColorStop(0, 'rgba(210,235,255,0.14)');
    moonGrad.addColorStop(1, 'transparent');
    v.fillStyle = moonGrad;
    v.beginPath(); v.arc(W * 0.18, H * 0.14, 70, 0, Math.PI * 2); v.fill();
    v.fillStyle = 'rgba(215,235,255,0.9)';
    v.beginPath(); v.arc(W * 0.18, H * 0.14, 26, 0, Math.PI * 2); v.fill();
    v.fillStyle = 'rgba(180,205,230,0.5)';
    v.beginPath(); v.arc(W * 0.18 - 6, H * 0.13, 5, 0, Math.PI * 2); v.fill();
    v.beginPath(); v.arc(W * 0.18 + 8, H * 0.16, 3.5, 0, Math.PI * 2); v.fill();
    v.restore();

    // Árboles de fondo (siluetas)
    for (let ti = 0; ti < 14; ti++) {
      const tx = pseudoRand(ti * 53, W);
      const tr = pseudoRand(ti * 17, 46) + 22;
      const ty = H * 0.62 + pseudoRand(ti * 9, H * 0.1);
      v.fillStyle = ti % 3 === 0 ? 'rgba(4,26,30,0.55)' : 'rgba(6,32,36,0.5)';
      v.beginPath();
      v.arc(tx, ty, tr, 0, Math.PI * 2);
      v.arc(tx - tr * 0.7, ty + tr * 0.4, tr * 0.6, 0, Math.PI * 2);
      v.arc(tx + tr * 0.7, ty + tr * 0.4, tr * 0.6, 0, Math.PI * 2);
      v.fill();
    }

    // Neblina del parque
    v.save();
    tiledFog(v, W, H * 0.55, 'rgba(120,200,200,0.03)');
    v.restore();

    drawParqueVisuals(v, W, H);

    c.fillStyle = '#fff';
    drawParqueCollisions(c, W, H);
  },

  torre_reloj(v, c, W, H) {
    // Interior de la torre: mampostería cálida
    const wall = v.createLinearGradient(0, 0, 0, H);
    wall.addColorStop(0, '#1a1208');
    wall.addColorStop(0.4, '#241a0e');
    wall.addColorStop(0.7, '#1e160c');
    wall.addColorStop(1, '#120c06');
    v.fillStyle = wall;
    v.fillRect(0, 0, W, H);

    // Ladrillo tenue
    v.fillStyle = 'rgba(255,220,160,0.025)';
    for (let bx = 0; bx < W; bx += 44) {
      for (let by = 0; by < H; by += 18) {
        v.fillRect(bx + (by % 36 === 0 ? 22 : 0), by, 40, 14);
      }
    }

    // Luz de farol interior (cálida)
    const lamp = v.createRadialGradient(W * 0.5, H * 0.25, 0, W * 0.5, H * 0.25, H * 0.5);
    lamp.addColorStop(0, 'rgba(230,150,70,0.10)');
    lamp.addColorStop(1, 'transparent');
    v.fillStyle = lamp;
    v.fillRect(0, 0, W, H);

    // Gran esfera del reloj en la pared posterior
    drawClockFace(v, W, H);

    // Engranajes de fondo
    for (let gi = 0; gi < 9; gi++) {
      const gx = pseudoRand(gi * 71, W);
      const gy = pseudoRand(gi * 37, H * 0.5) + H * 0.12;
      const gr = pseudoRand(gi * 13, 26) + 14;
      drawGear(v, gx, gy, gr, 'rgba(200,160,90,0.05)');
    }

    // Polvo flotante estático
    for (let i = 0; i < 60; i++) {
      const dx = pseudoRand(i * 43, W);
      const dy = pseudoRand(i * 27, H);
      v.fillStyle = `rgba(255,220,170,${pseudoRand(i * 5, 0.06) + 0.01})`;
      v.fillRect(dx, dy, 2, 2);
    }

    drawTorreVisuals(v, W, H);

    c.fillStyle = '#fff';
    drawTorreCollisions(c, W, H);
  },

  bosque_encantado(v, c, W, H) {
    // Foto real del bosque encantado si está cargada
    if (BG_BOSQUE) {
      try {
        const scale = Math.max(W / BG_BOSQUE.width, H / BG_BOSQUE.height);
        const fw = BG_BOSQUE.width * scale;
        const fh = BG_BOSQUE.height * scale;
        v.drawImage(BG_BOSQUE, (W - fw) / 2, 0, fw, Math.min(fh, H));
      } catch { /* fallback procedural */ }
    }

    // Velo de noche encantada
    const veil = v.createLinearGradient(0, 0, 0, H);
    veil.addColorStop(0, 'rgba(10,6,28,0.25)');
    veil.addColorStop(0.5, 'rgba(10,6,28,0.45)');
    veil.addColorStop(1, 'rgba(4,2,14,0.72)');
    v.fillStyle = veil;
    v.fillRect(0, 0, W, H);

    // Luz de luna entre los árboles (brillo frío)
    const moonGlow = v.createRadialGradient(W * 0.5, H * 0.15, 0, W * 0.5, H * 0.15, H * 0.6);
    moonGlow.addColorStop(0, 'rgba(140,180,255,0.08)');
    moonGlow.addColorStop(1, 'transparent');
    v.fillStyle = moonGlow;
    v.fillRect(0, 0, W, H);

    drawBosqueVisuals(v, W, H);

    c.fillStyle = '#fff';
    drawBosqueCollisions(c, W, H);
  },

  tejado_gansos(v, c, W, H) {
    // Fondo real si está cargado (fondo.jpg)
    if (BG_FONDO) {
      try {
        const scale = Math.max(W / BG_FONDO.width, H / BG_FONDO.height);
        const fw = BG_FONDO.width * scale;
        const fh = BG_FONDO.height * scale;
        v.drawImage(BG_FONDO, (W - fw) / 2, 0, fw, Math.min(fh, H));
        const dark = v.createLinearGradient(0, H * 0.5, 0, H);
        dark.addColorStop(0, 'rgba(6,6,16,0.4)');
        dark.addColorStop(1, 'rgba(6,6,16,0.8)');
        v.fillStyle = dark;
        v.fillRect(0, 0, W, H);
      } catch { /* fallback al escenario procedural */ }
    }

    // Cielo profundo con tonos cálidos (amanecer casi oscuro)
    const sky = v.createLinearGradient(0, 0, 0, H * 0.7);
    sky.addColorStop(0, '#100a08');
    sky.addColorStop(0.4, '#241408');
    sky.addColorStop(0.75, '#3a2208');
    sky.addColorStop(1, '#1c1006');
    v.fillStyle = sky;
    if (BG_FONDO) v.globalAlpha = 0.35;
    v.fillRect(0, 0, W, H);
    v.globalAlpha = 1;

    // Luna naranja baja
    v.save();
    v.globalAlpha = 0.25;
    v.fillStyle = '#ff9a30';
    v.beginPath();
    v.arc(W * 0.24, H * 0.12, 42, 0, Math.PI * 2);
    v.fill();
    v.globalAlpha = 0.5;
    v.beginPath();
    v.arc(W * 0.24, H * 0.12, 30, 0, Math.PI * 2);
    v.fill();
    v.globalAlpha = 1;
    v.restore();

    drawTejadoVisuals(v, W, H);

    c.fillStyle = '#fff';
    drawTejadoCollisions(c, W, H);
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

// =============================================
//  PARQUE DE LAS PALOMAS
// =============================================
const PARQUE_PLATS = [
  { x: 0,  y: 740, w: 80, h: 14, kind: 'stone' },
  { x: 0,  y: 640, w: 60, h: 12, kind: 'branch' },
  { x: 40, y: 760, w: 150, h: 14, kind: 'stone' },
  { x: 260, y: 700, w: 120, h: 14, kind: 'branch' },
  { x: 430, y: 760, w: 110, h: 14, kind: 'stone' },
  { x: 590, y: 660, w: 150, h: 14, kind: 'wood' },
  { x: 770, y: 710, w: 100, h: 14, kind: 'branch' },
  { x: 910, y: 630, w: 90, h: 14, kind: 'branch' },
  { x: 1040, y: 560, w: 120, h: 16, kind: 'gazebo' },
  { x: 1220, y: 620, w: 110, h: 14, kind: 'branch' },
  { x: 1380, y: 700, w: 150, h: 14, kind: 'stone' },
  { x: 1580, y: 640, w: 100, h: 14, kind: 'wood' },
  { x: 1720, y: 560, w: 90, h: 14, kind: 'branch' },
  { x: 1860, y: 620, w: 130, h: 14, kind: 'stone' },
  { x: 2040, y: 540, w: 90, h: 14, kind: 'wood' },
  { x: 2180, y: 600, w: 110, h: 14, kind: 'branch' },
  { x: 2340, y: 520, w: 130, h: 16, kind: 'gazebo' },
  { x: 2520, y: 580, w: 100, h: 14, kind: 'branch' },
  { x: 2680, y: 640, w: 140, h: 14, kind: 'stone' },
  { x: 2880, y: 600, w: 100, h: 14, kind: 'wood' },
  { x: 3020, y: 660, w: 140, h: 14, kind: 'stone' },
  { x: 3120, y: 740, w: 80, h: 14, kind: 'stone' },
  { x: 3120, y: 640, w: 60, h: 12, kind: 'branch' },
  // Saltos altos
  { x: 760, y: 500, w: 60, h: 12, kind: 'branch' },
  { x: 1300, y: 470, w: 60, h: 12, kind: 'branch' },
  { x: 2100, y: 440, w: 60, h: 12, kind: 'branch' },
  { x: 2700, y: 440, w: 60, h: 12, kind: 'branch' },
];

function tiledFog(ctx, w, yBottom, color) {
  ctx.globalAlpha = 0.6;
  for (let y = yBottom - 44; y < yBottom; y += 14) {
    ctx.fillStyle = color;
    for (let x = 0; x < w; x += 110) {
      const wv = 70 + pseudoRand(x + y, 60);
      ctx.beginPath();
      ctx.ellipse(x, y, wv, 5, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.globalAlpha = 1;
}

function drawParqueVisuals(ctx, W, H) {
  const ground = H - 60;

  // ---- Suelo: sendero de tierra + césped a la luz de la luna ----
  const floorGrad = ctx.createLinearGradient(0, ground, 0, H);
  floorGrad.addColorStop(0, '#141a10');
  floorGrad.addColorStop(0.5, '#0e120a');
  floorGrad.addColorStop(1, '#080a06');
  ctx.fillStyle = floorGrad;
  ctx.fillRect(0, ground, W, 60);
  ctx.fillStyle = '#1e3a28';
  ctx.fillRect(0, ground - 16, W, 18);
  ctx.fillStyle = '#254a30';
  ctx.fillRect(0, ground - 16, W, 3);
  ctx.fillStyle = 'rgba(180,220,190,0.06)';
  ctx.fillRect(0, ground - 16, W, 1);

  // Briznas de hierba
  for (let i = 0; i < 260; i++) {
    const hx = pseudoRand(i * 13, W);
    const hh = pseudoRand(i * 27, 5) + 2;
    ctx.fillStyle = `rgba(40,90,50,${pseudoRand(i * 7, 0.3) + 0.15})`;
    ctx.fillRect(hx, ground - hh, 2, hh);
  }

  // ---- Plataformas ----
  PARQUE_PLATS.forEach(p => {
    if (p.kind === 'wood') {
      const pGrad = ctx.createLinearGradient(p.x, p.y, p.x, p.y + p.h);
      pGrad.addColorStop(0, '#4a3820');
      pGrad.addColorStop(1, '#2c2010');
      ctx.fillStyle = pGrad;
      ctx.fillRect(p.x, p.y, p.w, p.h);
      ctx.fillStyle = '#5a4526';
      ctx.fillRect(p.x, p.y, p.w, 3);
      ctx.fillStyle = '#1e1608';
      for (let bx = p.x + 8; bx < p.x + p.w; bx += 13) ctx.fillRect(bx, p.y + 4, 1, p.h - 4);
      ctx.fillStyle = 'rgba(255,255,255,0.05)';
      for (let bx = p.x + 4; bx < p.x + p.w; bx += 13) ctx.fillRect(bx, p.y + 3, 1, p.h - 3);
      ctx.fillStyle = '#556060';
      ctx.fillRect(p.x + 4, p.y + 2, 2, 2);
    } else if (p.kind === 'branch') {
      // Rama gruesa de árbol
      const bGrad = ctx.createLinearGradient(p.x, p.y, p.x, p.y + p.h);
      bGrad.addColorStop(0, '#3c2c14');
      bGrad.addColorStop(0.5, '#33240e');
      bGrad.addColorStop(1, '#221708');
      ctx.fillStyle = bGrad;
      ctx.fillRect(p.x, p.y, p.w, p.h);
      ctx.fillStyle = '#4a3a1c';
      // Moño de hojas en cada extremo
      [p.x, p.x + p.w].forEach(ex => {
        ctx.fillStyle = 'rgba(30,80,50,0.85)';
        ctx.beginPath(); ctx.arc(ex, p.y, 8, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(ex + 5, p.y + 3, 6, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'rgba(60,120,70,0.4)';
        ctx.beginPath(); ctx.arc(ex - 3, p.y - 3, 5, 0, Math.PI * 2); ctx.fill();
      });
    } else if (p.kind === 'gazebo') {
      // Cubierta de madera del templete
      const dGrad = ctx.createLinearGradient(p.x, p.y, p.x, p.y + p.h);
      dGrad.addColorStop(0, '#5a4222');
      dGrad.addColorStop(1, '#382808');
      ctx.fillStyle = dGrad;
      ctx.fillRect(p.x, p.y, p.w, p.h);
      ctx.fillStyle = '#6b5230';
      ctx.fillRect(p.x, p.y, p.w, 3);
      for (let bx = p.x + 10; bx < p.x + p.w; bx += 16) ctx.fillRect(bx, p.y + 5, 1, p.h - 5);
      // Columnas
      ctx.fillStyle = '#2c2414';
      ctx.fillRect(p.x, p.y - 46, 6, 46);
      ctx.fillRect(p.x + p.w - 6, p.y - 46, 6, 46);
      // Techo a dos aguas
      ctx.fillStyle = '#1a1c10';
      ctx.beginPath();
      ctx.moveTo(p.x - 8, p.y - 46);
      ctx.lineTo(p.x + p.w / 2, p.y - 74);
      ctx.lineTo(p.x + p.w + 8, p.y - 46);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#2a3018';
      ctx.fillRect(p.x - 8, p.y - 48, p.w + 16, 3);
    } else {
      // Piedra pulida del parque
      const sGrad = ctx.createLinearGradient(p.x, p.y, p.x, p.y + p.h);
      sGrad.addColorStop(0, '#3a3c30');
      sGrad.addColorStop(1, '#262820');
      ctx.fillStyle = sGrad;
      ctx.fillRect(p.x, p.y, p.w, p.h);
      ctx.fillStyle = '#4a4c3e';
      ctx.fillRect(p.x, p.y, p.w, 3);
      ctx.fillStyle = 'rgba(120,160,120,0.15)';
      for (let bx = p.x + 12; bx < p.x + p.w; bx += 26) ctx.fillRect(bx, p.y, 3, 3);
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      ctx.fillRect(p.x, p.y + p.h, p.w, 3);
    }
  });

  // ---- Farolas del parque (luz cálida) ----
  const farolas = [150, 900, 1600, 2300, 2900];
  farolas.forEach(fx => {
    const fy = ground - 4;
    ctx.fillStyle = '#101008';
    ctx.fillRect(fx - 4, fy - 90, 7, 86);
    ctx.fillStyle = '#1a1a10';
    ctx.fillRect(fx - 6, fy - 4, 12, 4);
    ctx.fillStyle = '#201c10';
    ctx.fillRect(fx - 8, fy - 92, 15, 8);
    ctx.save();
    ctx.shadowColor = '#f0d080';
    ctx.shadowBlur = 26;
    ctx.fillStyle = '#f0d080';
    ctx.beginPath(); ctx.arc(fx, fy - 84, 4, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    const lGrad = ctx.createRadialGradient(fx, fy - 84, 0, fx, fy - 84, 90);
    lGrad.addColorStop(0, 'rgba(240,208,128,0.12)');
    lGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = lGrad;
    ctx.beginPath(); ctx.arc(fx, fy - 84, 90, 0, Math.PI * 2); ctx.fill();
  });

  // ---- Fuente central ----
  const fwx = 520, fwy = ground - 2;
  const waterGrad = ctx.createRadialGradient(fwx, fwy, 0, fwx, fwy, 70);
  waterGrad.addColorStop(0, 'rgba(90,180,200,0.22)');
  waterGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = waterGrad;
  ctx.beginPath(); ctx.arc(fwx, fwy, 70, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#3c443a';
  ctx.beginPath(); ctx.ellipse(fwx, fwy, 46, 10, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#4a544a';
  ctx.beginPath(); ctx.ellipse(fwx, fwy, 46, 10, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = '#304034';
  ctx.fillRect(fwx - 5, fwy - 26, 10, 26);
  ctx.save();
  ctx.shadowColor = '#60c0d0';
  ctx.shadowBlur = 14;
  ctx.fillStyle = '#bfefff';
  ctx.beginPath(); ctx.arc(fwx, fwy - 30, 7, 0, Math.PI * 2); ctx.fill();
  ctx.restore();

  // ---- Bancas del parque ----
  const bancas = [400, 1250, 1950, 2500];
  bancas.forEach(bx => {
    ctx.fillStyle = '#2c2414';
    ctx.fillRect(bx, ground - 16, 30, 3);
    ctx.fillRect(bx + 4, ground - 16, 3, 14);
    ctx.fillRect(bx + 23, ground - 16, 3, 14);
    ctx.fillStyle = '#3a2c18';
    ctx.fillRect(bx, ground - 20, 30, 3);
  });
}

function drawParqueCollisions(ctx, W, H) {
  const ground = H - 60;
  ctx.fillRect(0, ground, W, 60);
  PARQUE_PLATS.forEach(p => ctx.fillRect(p.x, p.y, p.w, p.h));
}

// =============================================
//  TORRE DEL RELOJ
// =============================================
const TORRE_PLATS = [
  { x: 0,  y: 720, w: 60, h: 14, kind: 'steel' },
  { x: 3140, y: 720, w: 60, h: 14, kind: 'steel' },
  { x: 60, y: 780, w: 150, h: 14, kind: 'grate' },
  { x: 300, y: 680, w: 100, h: 14, kind: 'steel' },
  { x: 500, y: 600, w: 90, h: 14, kind: 'beam' },
  { x: 700, y: 760, w: 170, h: 14, kind: 'grate' },
  { x: 760, y: 520, w: 80, h: 14, kind: 'gear' },
  { x: 920, y: 640, w: 90, h: 14, kind: 'steel' },
  { x: 1120, y: 700, w: 140, h: 14, kind: 'grate' },
  { x: 1300, y: 560, w: 100, h: 14, kind: 'steel' },
  { x: 1480, y: 640, w: 120, h: 14, kind: 'beam' },
  { x: 1660, y: 520, w: 90, h: 14, kind: 'grate' },
  { x: 1840, y: 600, w: 140, h: 14, kind: 'steel' },
  { x: 2020, y: 480, w: 100, h: 14, kind: 'beam' },
  { x: 2200, y: 580, w: 110, h: 14, kind: 'grate' },
  { x: 2360, y: 480, w: 90, h: 14, kind: 'gear' },
  { x: 2540, y: 560, w: 120, h: 14, kind: 'steel' },
  { x: 2720, y: 460, w: 110, h: 14, kind: 'beam' },
  { x: 2900, y: 560, w: 140, h: 14, kind: 'grate' },
  { x: 3060, y: 620, w: 120, h: 14, kind: 'steel' },
  { x: 150, y: 480, w: 60, h: 12, kind: 'beam' },
  { x: 880, y: 450, w: 60, h: 12, kind: 'gear' },
  { x: 1860, y: 380, w: 60, h: 12, kind: 'beam' },
  { x: 2700, y: 360, w: 60, h: 12, kind: 'gear' },
];

function drawGear(ctx, x, y, r, color) {
  const teeth = 8;
  ctx.fillStyle = color;
  for (let t = 0; t < teeth; t++) {
    const a = (t / teeth) * Math.PI * 2;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(a);
    ctx.fillRect(r * 0.78, -r * 0.16, r * 0.3, r * 0.32);
    ctx.restore();
  }
  ctx.beginPath();
  ctx.arc(x, y, r * 0.85, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.beginPath();
  ctx.arc(x, y, r * 0.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r * 0.18, 0, Math.PI * 2);
  ctx.fill();
}

function drawClockFace(ctx, W, H) {
  const cx = W * 0.46, cy = H * 0.26, R = 120;
  // Halo nocturno del reloj
  const halo = ctx.createRadialGradient(cx, cy, 10, cx, cy, R * 2);
  halo.addColorStop(0, 'rgba(250,200,110,0.18)');
  halo.addColorStop(1, 'transparent');
  ctx.fillStyle = halo;
  ctx.beginPath(); ctx.arc(cx, cy, R * 2, 0, Math.PI * 2); ctx.fill();

  // Marco de bronce
  ctx.fillStyle = '#2e2210';
  ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#4a3a1c';
  ctx.beginPath(); ctx.arc(cx, cy, R - 8, 0, Math.PI * 2); ctx.fill();

  // Esfera
  const face = ctx.createRadialGradient(cx, cy, 0, cx, cy, R - 12);
  face.addColorStop(0, '#f4e8c8');
  face.addColorStop(1, '#d8c8a0');
  ctx.fillStyle = face;
  ctx.beginPath(); ctx.arc(cx, cy, R - 12, 0, Math.PI * 2); ctx.fill();

  // Marcas horarias (roman strikes)
  ctx.fillStyle = '#3a2c18';
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
    const ox = Math.cos(a) * (R - 22);
    const oy = Math.sin(a) * (R - 22);
    ctx.fillRect(cx + ox - 2, cy + oy - 2, 4, 4);
  }

  // Manecillas estáticas (12:36)
  ctx.save();
  ctx.strokeStyle = '#181008';
  ctx.lineCap = 'round';
  ctx.lineWidth = 6;
  ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx, cy - 58); ctx.stroke();
  ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + 44, cy + 30); ctx.stroke();
  ctx.fillStyle = '#181008';
  ctx.beginPath(); ctx.arc(cx, cy, 6, 0, Math.PI * 2); ctx.fill();
  ctx.restore();

  // Soporte de hierro
  ctx.fillStyle = '#241c10';
  ctx.fillRect(cx - 40, cy + R - 14, 80, 70);
  ctx.fillStyle = '#382c18';
  ctx.fillRect(cx - 40, cy + R - 14, 80, 6);
}

function drawTorreVisuals(ctx, W, H) {
  const ground = H - 60;

  // ---- Suelo de tablones de madera ----
  const floorGrad = ctx.createLinearGradient(0, ground, 0, H);
  floorGrad.addColorStop(0, '#3a2a14');
  floorGrad.addColorStop(1, '#1c1408');
  ctx.fillStyle = floorGrad;
  ctx.fillRect(0, ground, W, 60);
  ctx.fillStyle = '#4a361c';
  ctx.fillRect(0, ground, W, 4);
  for (let bx = 0; bx < W; bx += 60) {
    ctx.fillStyle = '#221808';
    ctx.fillRect(bx, ground + 4, 2, 56);
    ctx.fillStyle = 'rgba(255,255,255,0.03)';
    ctx.fillRect(bx + 2, ground + 4, 1, 56);
  }

  // ---- Plataformas ----
  TORRE_PLATS.forEach(p => {
    if (p.kind === 'steel') {
      ctx.fillStyle = '#353a42';
      ctx.fillRect(p.x, p.y, p.w, p.h);
      ctx.fillStyle = '#4c545e';
      ctx.fillRect(p.x, p.y, p.w, 3);
      ctx.fillStyle = 'rgba(255,255,255,0.05)';
      ctx.fillRect(p.x, p.y, p.w, 1);
      ctx.fillStyle = '#263038';
      for (let bx = p.x + 8; bx < p.x + p.w; bx += 20) ctx.fillRect(bx, p.y + p.h - 4, 4, 2);
    } else if (p.kind === 'grate') {
      ctx.fillStyle = '#262a30';
      ctx.fillRect(p.x, p.y, p.w, p.h);
      ctx.fillStyle = '#3c444c';
      ctx.fillRect(p.x, p.y, p.w, 3);
      ctx.fillStyle = '#101418';
      for (let bx = p.x + 6; bx < p.x + p.w; bx += 14) {
        ctx.fillRect(bx, p.y + 5, 5, 3);
        ctx.fillRect(bx, p.y + 10, 5, 2);
      }
    } else if (p.kind === 'beam') {
      ctx.fillStyle = '#33240e';
      ctx.fillRect(p.x, p.y, p.w, p.h);
      ctx.fillStyle = '#4a3418';
      ctx.fillRect(p.x, p.y, p.w, 3);
      ctx.fillStyle = '#221708';
      for (let bx = p.x + 10; bx < p.x + p.w; bx += 16) ctx.fillRect(bx, p.y + 4, 1, p.h - 4);
      ctx.fillStyle = '#5a4a32';
      ctx.fillRect(p.x, p.y + p.h - 3, p.w, 3);
      // Bandas metálicas
      ctx.fillStyle = '#606870';
      ctx.fillRect(p.x + 8, p.y - 2, 5, p.h + 4);
      ctx.fillRect(p.x + p.w - 13, p.y - 2, 5, p.h + 4);
    } else {
      // Plataforma-engranaje
      ctx.fillStyle = '#4a3014';
      ctx.fillRect(p.x, p.y, p.w, p.h);
      ctx.fillStyle = '#6a4a1c';
      ctx.fillRect(p.x, p.y, p.w, 3);
      for (let bx = p.x + 6; bx < p.x + p.w; bx += 20) {
        ctx.fillStyle = '#3c2810';
        ctx.fillRect(bx, p.y + 4, 13, 2);
      }
      // Dientes simulados
      ctx.fillStyle = `rgba(120,90,40,${pseudoRand(p.x, 0.15) + 0.1})`;
      for (let bx = p.x; bx < p.x + p.w; bx += 16) {
        ctx.fillRect(bx, p.y - 3, 6, 3);
        ctx.fillRect(bx + 8, p.y + p.h, 6, 3);
      }
    }
  });

  // ---- Cadenas colgando del techo ----
  const chains = [{ x: 720, top: 0, len: 190 }, { x: 700 + 30, top: 0, len: 190 }, { x: 1830, top: 0, len: 220 }, { x: 1860, top: 0, len: 220 }];
  chains.forEach(ch => {
    ctx.fillStyle = '#454a52';
    for (let cy = ch.top; cy < ch.top + ch.len; cy += 8) {
      ctx.fillRect(ch.x - 3, cy, 6, 4);
    }
    ctx.fillStyle = '#2c3038';
    ctx.fillRect(ch.x - 6, ch.top, 12, 8);
  });

  // ---- Maquinaria trasera (engranajes grandes) ----
  drawGear(ctx, W * 0.16, H * 0.72, 70, 'rgba(140,100,50,0.10)');
  drawGear(ctx, W * 0.9, H * 0.65, 55, 'rgba(120,90,45,0.08)');

  // ---- Campanas gemelas arriba ----
  const bells = [W * 0.3, W * 0.7];
  bells.forEach(bx => {
    ctx.fillStyle = 'rgba(120,92,52,0.2)';
    ctx.beginPath();
    ctx.moveTo(bx - 16, 40);
    ctx.quadraticCurveTo(bx, 58, bx + 16, 40);
    ctx.lineTo(bx + 13, 84);
    ctx.lineTo(bx - 13, 84);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = 'rgba(70,52,30,0.5)';
    ctx.fillRect(bx - 3, 40, 6, 10);
  });
}

function drawTorreCollisions(ctx, W, H) {
  const ground = H - 60;
  ctx.fillRect(0, ground, W, 60);
  TORRE_PLATS.forEach(p => ctx.fillRect(p.x, p.y, p.w, p.h));
}

// =============================================
//  ZONA 5 — BOSQUE ENCANTADO
// =============================================
const BOSQUE_PLATS = [
  { x: 0,     y: 840, w: 3200, h: 60 },
  { x: 150,   y: 706, w: 260, h: 20 },
  { x: 500,   y: 648, w: 200, h: 20 },
  { x: 800,   y: 706, w: 220, h: 20 },
  { x: 680,   y: 500, w: 120, h: 18 },
  { x: 1120,  y: 560, w: 260, h: 22 },
  { x: 1180,  y: 440, w: 180, h: 22 },
  { x: 1450,  y: 630, w: 180, h: 20 },
  { x: 1700,  y: 706, w: 240, h: 20 },
  { x: 1980,  y: 460, w: 120, h: 18 },
  { x: 2020,  y: 630, w: 200, h: 20 },
  { x: 2300,  y: 706, w: 180, h: 20 },
  { x: 2560,  y: 648, w: 200, h: 20 },
  { x: 2860,  y: 706, w: 200, h: 20 },
  { x: 2960,  y: 520, w: 130, h: 20 },
  { x: 3050,  y: 648, w: 150, h: 22 },
];

function drawTreeTrunk(ctx, x, y, w, h, alpha) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = '#241a12';
  ctx.beginPath();
  ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#3a2a18';
  ctx.beginPath();
  ctx.ellipse(x + w / 2, y + h / 2, w / 2 - 8, h / 2 - 6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawGlowMushroom(ctx, x, y, s) {
  ctx.save();
  ctx.fillStyle = '#e8d060';
  ctx.beginPath();
  ctx.arc(x, y, 4 * s, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(232,208,96,0.25)';
  ctx.beginPath();
  ctx.arc(x, y, 12 * s, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#a05030';
  ctx.fillRect(x - 2.5 * s, y, 5 * s, 7 * s);
  ctx.fillStyle = '#e8d060';
  ctx.beginPath();
  ctx.arc(x, y - 2 * s, 6 * s, Math.PI, 0);
  ctx.fill();
  ctx.fillStyle = '#f8e890';
  ctx.beginPath();
  ctx.arc(x, y - 4 * s, 3 * s, Math.PI, 0);
  ctx.fill();
  ctx.restore();
}

function drawFireflies(ctx, W, H) {
  for (let i = 0; i < 40; i++) {
    const fx = pseudoRand(i * 93, W);
    const fy = pseudoRand(i * 47, H * 0.7) + H * 0.2;
    const glow = 0.12 + pseudoRand(i * 11, 0.4);
    ctx.save();
    ctx.globalAlpha = glow;
    ctx.fillStyle = '#e8ffa0';
    ctx.beginPath();
    ctx.arc(fx, fy, pseudoRand(i * 3, 2) + 1, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function drawBosqueVisuals(ctx, W, H) {
  // Árboles troncales (fondo)
  for (let i = 0; i < 32; i++) {
    const tx = i * 110 + pseudoRand(i * 31, 60);
    const th = pseudoRand(i * 13, 220) + 420;
    drawTreeTrunk(ctx, tx, H - th, pseudoRand(i * 7, 46) + 34, th, 0.35);
  }

  // Copas de árboles (siluetas oscuras)
  for (let i = 0; i < 26; i++) {
    const cx = i * 140 + pseudoRand(i * 41, 90);
    const cy = pseudoRand(i * 23, H * 0.3) + H * 0.16;
    const cr = pseudoRand(i * 17, 80) + 60;
    ctx.fillStyle = i % 3 === 0 ? 'rgba(8,20,34,0.55)' : 'rgba(6,26,36,0.45)';
    ctx.beginPath();
    ctx.arc(cx, cy, cr, 0, Math.PI * 2);
    ctx.arc(cx - cr * 0.8, cy + cr * 0.4, cr * 0.7, 0, Math.PI * 2);
    ctx.arc(cx + cr * 0.8, cy + cr * 0.3, cr * 0.7, 0, Math.PI * 2);
    ctx.fill();
  }

  // Plataformas de musgo con hongos brillantes
  BOSQUE_PLATS.forEach(p => {
    if (p.y >= 800) return;
    const g = ctx.createLinearGradient(0, p.y, 0, p.y + p.h);
    g.addColorStop(0, '#2c3a20');
    g.addColorStop(1, '#1c2814');
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.fillRect(p.x + 2, p.y + 2, p.w, p.h);
    ctx.fillStyle = g;
    ctx.fillRect(p.x, p.y, p.w, p.h);
    ctx.fillStyle = '#3a4a28';
    ctx.fillRect(p.x, p.y, p.w, 4);
    ctx.fillStyle = 'rgba(40,60,30,0.5)';
    for (let x = p.x; x < p.x + p.w - 14; x += 26) {
      ctx.beginPath(); ctx.arc(x, p.y + p.h - 3, 5, 0, Math.PI * 2); ctx.fill();
    }
    drawGlowMushroom(ctx, p.x + p.w * 0.2, p.y - 12, 1);
    drawGlowMushroom(ctx, p.x + p.w * 0.75, p.y - 14, 0.8);
  });

  // Raíces colgantes
  ctx.strokeStyle = 'rgba(30,22,14,0.5)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 24; i++) {
    const rx = pseudoRand(i * 61, W);
    const rl = pseudoRand(i * 9, 70) + 30;
    ctx.beginPath();
    ctx.moveTo(rx, 0);
    ctx.quadraticCurveTo(rx + 8, rl / 2, rx + Math.sin(i) * 12, rl);
    ctx.stroke();
  }

  drawFireflies(ctx, W, H);

  // Luz de luna en el centro (halo)
  const glow = ctx.createRadialGradient(W * 0.48, H * 0.12, 0, W * 0.48, H * 0.12, 150);
  glow.addColorStop(0, 'rgba(170,200,255,0.12)');
  glow.addColorStop(0.5, 'rgba(140,170,255,0.05)');
  glow.addColorStop(1, 'transparent');
  ctx.fillStyle = glow;
  ctx.fillRect(W * 0.48 - 150, 0, 300, H * 0.4);
}

function drawBosqueCollisions(ctx, W, H) {
  BOSQUE_PLATS.forEach(p => ctx.fillRect(p.x, p.y, p.w, p.h));
}

// =============================================
//  ZONA 6 — TEJADO DE LOS GANSOS
// =============================================
const TEJADO_PLATS = [
  { x: 0,     y: 840, w: 3200, h: 60 },
  { x: 120,   y: 788, w: 120, h: 16 },
  { x: 320,   y: 728, w: 150, h: 16 },
  { x: 570,   y: 656, w: 160, h: 16 },
  { x: 840,   y: 728, w: 120, h: 16 },
  { x: 1060,  y: 656, w: 150, h: 16 },
  { x: 1310,  y: 708, w: 130, h: 16 },
  { x: 1520,  y: 600, w: 170, h: 16 },
  { x: 1730,  y: 708, w: 130, h: 16 },
  { x: 1960,  y: 640, w: 150, h: 16 },
  { x: 2200,  y: 580, w: 170, h: 16 },
  { x: 2450,  y: 688, w: 130, h: 16 },
  { x: 2680,  y: 620, w: 150, h: 16 },
  { x: 2910,  y: 708, w: 130, h: 16 },
  { x: 3080,  y: 640, w: 120, h: 16 },
];

function drawChimney(ctx, x, y, w, h) {
  ctx.fillStyle = '#3a2c22';
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = '#4a3a2c';
  ctx.fillRect(x + 3, y, w - 6, h - 8);
  ctx.fillStyle = '#2a2018';
  ctx.fillRect(x - 4, y, w + 8, 6);
  // humo estático
  ctx.fillStyle = 'rgba(220,210,190,0.1)';
  ctx.beginPath();
  ctx.arc(x + w / 2 + 6, y - 10, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x + w / 2 + 10, y - 20, 5, 0, Math.PI * 2);
  ctx.fill();
}

function drawAntenna(ctx, x, y, h) {
  ctx.strokeStyle = '#4a4a5a';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y - h);
  ctx.stroke();
  ctx.fillStyle = '#c03030';
  ctx.fillRect(x - 3, y - h - 4, 6, 4);
  ctx.fillStyle = 'rgba(230,60,60,0.5)';
  ctx.beginPath();
  ctx.arc(x, y - h - 3, 5, 0, Math.PI * 2);
  ctx.fill();
}

function drawWaterTower(ctx, x, w, h) {
  ctx.strokeStyle = '#5a5038';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x + 4, h + 60); ctx.lineTo(x + 30, h + 18); ctx.lineTo(x + 56, h + 18);
  ctx.lineTo(x + 82, h + 60);
  ctx.stroke();
  ctx.fillStyle = '#3a2c1c';
  ctx.fillRect(x, h + 60, w, 120);
  ctx.fillStyle = '#6a5a3c';
  ctx.beginPath();
  ctx.ellipse(x + w / 2, h + 18, w / 2, 12, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#7a6a4a';
  ctx.beginPath();
  ctx.ellipse(x + w / 2, h + 16, w / 2 - 6, 9, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#4a3c28';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x + w / 2 - w / 4, h + 32); ctx.lineTo(x + w / 2 + w / 4, h + 6);
  ctx.stroke();
}

function drawClothesline(ctx, x, len, y) {
  ctx.strokeStyle = 'rgba(200,200,220,0.5)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + len, y);
  ctx.stroke();
  const cols = ['#c04040', '#4070c0', '#c0c040', '#8060c0'];
  for (let i = 0; i < 5; i++) {
    const cx = x + 30 + i * (len - 60) / 4;
    ctx.fillStyle = cols[i % cols.length];
    ctx.globalAlpha = 0.6;
    ctx.fillRect(cx, y, 12, 14 + ((i * 7) % 5));
    ctx.globalAlpha = 1;
    ctx.fillRect(cx + 4, y + 14 + ((i * 7) % 5), 4, 8);
  }
}

function drawGansoStatue(ctx, x, y) {
  ctx.save();
  ctx.globalAlpha = 0.5;
  ctx.fillStyle = '#5a6a5a';
  ctx.beginPath();
  ctx.ellipse(x, y, 24, 26, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#7a8a7a';
  ctx.beginPath();
  ctx.arc(x, y - 40, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ff9a30';
  ctx.fillRect(x + 12, y - 44, 12, 8);
  ctx.restore();
}

function drawTejadoVisuals(ctx, W, H) {
  // Silueta de la ciudad nocturna
  drawBuildings(ctx, W, H, H * 0.55, H * 0.3, '#0c0c18', '#141420', 90, 240, 140);

  // Chimeneas decorativas
  const chimneys = [
    { x: 220, y: 788, w: 18, h: 44 },
    { x: 420, y: 728, w: 20, h: 56 },
    { x: 890, y: 728, w: 16, h: 48 },
    { x: 1350, y: 708, w: 18, h: 60 },
    { x: 1770, y: 708, w: 16, h: 44 },
    { x: 2240, y: 580, w: 20, h: 62 },
    { x: 2480, y: 688, w: 18, h: 48 },
  ];
  chimneys.forEach(ch => drawChimney(ctx, ch.x, ch.y, ch.w, ch.h));

  // Antenas
  drawAntenna(ctx, 600, 656, 90);
  drawAntenna(ctx, 1380, 708, 60);
  drawAntenna(ctx, 2600, 620, 80);

  // Torre de agua central
  drawWaterTower(ctx, 1650, 110, 540);

  // Tendederos
  drawClothesline(ctx, 500, 300, 600);
  drawClothesline(ctx, 1900, 220, 560);

  // Estatua de ganso (mascota del tejado)
  drawGansoStatue(ctx, W * 0.92, H - 98);

  // Rejilla de tejas horizontales
  ctx.fillStyle = 'rgba(0,0,0,0.28)';
  for (let x = 0; x < W; x += 90) {
    ctx.fillRect(x, H - 60, 40, 4);
    ctx.fillRect(x + 45, H - 50, 40, 4);
  }

  // Luces cálidas distantes
  for (let i = 0; i < 50; i++) {
    const lx = pseudoRand(i * 77, W);
    const ly = H * 0.2 + pseudoRand(i * 31, H * 0.3);
    ctx.fillStyle = `rgba(255,190,110,${pseudoRand(i * 9, 0.18) + 0.05})`;
    ctx.fillRect(lx, ly, 2 + pseudoRand(i * 3, 3), 2 + pseudoRand(i * 5, 2));
  }
}

function drawTejadoCollisions(ctx, W, H) {
  TEJADO_PLATS.forEach(p => ctx.fillRect(p.x, p.y, p.w, p.h));
}
