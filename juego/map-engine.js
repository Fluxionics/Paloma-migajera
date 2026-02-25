// =============================================
//  PALOMA MIGAJERA v3 — MAP ENGINE
//  Sistema dual: imagen visual + colisiones
//  Cada zona tiene:
//    buildVisual(ctx, W, H)  → dibuja el arte
//    buildCollision(ctx,W,H) → pinta blanco=sólido, negro=vacío
// =============================================

const MAP_W = 3200;
const MAP_H = 900;

// ---- Genera ambas capas para una zona ----
function buildZone(zoneId) {
  const vis = document.createElement('canvas');
  const col = document.createElement('canvas');
  vis.width = col.width = MAP_W;
  vis.height = col.height = MAP_H;

  const vctx = vis.getContext('2d');
  const cctx = col.getContext('2d');

  // Limpiar colisiones a negro (vacío)
  cctx.fillStyle = '#000';
  cctx.fillRect(0, 0, MAP_W, MAP_H);

  const builder = ZONES[zoneId] || ZONES['ciudad_alta'];
  builder(vctx, cctx, MAP_W, MAP_H);

  // Extraer datos de colisión como ImageData para lectura rápida por píxel
  const colData = cctx.getImageData(0, 0, MAP_W, MAP_H);

  return { visual: vis, colData, w: MAP_W, h: MAP_H };
}

// ---- Leer si un punto (x,y) es sólido ----
function isSolid(colData, x, y) {
  const px = Math.floor(x);
  const py = Math.floor(y);
  if (px < 0 || py < 0 || px >= MAP_W || py >= MAP_H) return true; // bordes = sólido
  const idx = (py * MAP_W + px) * 4;
  return colData.data[idx] > 128; // canal R: blanco = sólido
}

// =============================================
//  DEFINICIONES DE ZONAS
// =============================================
const ZONES = {

  // ---- CIUDAD ALTA ----
  ciudad_alta(v, c, W, H) {
    // == VISUAL ==
    // Cielo gradiente
    const sky = v.createLinearGradient(0, 0, 0, H * 0.65);
    sky.addColorStop(0,   '#0d0f1c');
    sky.addColorStop(0.6, '#161830');
    sky.addColorStop(1,   '#1e1a35');
    v.fillStyle = sky;
    v.fillRect(0, 0, W, H);

    // Luna
    v.save();
    v.shadowColor = '#f0e8b0'; v.shadowBlur = 40;
    v.fillStyle = '#f0e8b0';
    v.beginPath(); v.arc(W * 0.82, 90, 38, 0, Math.PI*2); v.fill();
    v.restore();

    // Estrellas
    v.fillStyle = 'rgba(255,255,255,0.6)';
    for (let i=0; i<120; i++) {
      const sx = pseudoRand(i*13,   W);
      const sy = pseudoRand(i*17,   H*0.5);
      const sr = pseudoRand(i*7, 1.5) + 0.2;
      if (sr > 1.1) { v.save(); v.shadowColor='#fff'; v.shadowBlur=4; }
      v.beginPath(); v.arc(sx,sy,sr,0,Math.PI*2); v.fill();
      if (sr > 1.1) v.restore();
    }

    // Edificios de fondo (paralaje lejos)
    drawBuildings(v, W, H, 0.0, 0.25, '#0e0e1a', '#141420', 60, 180, 260);
    // Edificios de fondo (paralaje medio)
    drawBuildings(v, W, H, 0.15, 0.38, '#12121e', '#181830', 80, 220, 320);

    // Suelo + plataformas visuales
    drawPlatformVisuals(v, W, H);

    // Detalles urbanos: farolas, carteles, grietas
    drawUrbanDetails(v, W, H);

    // == COLISIONES ==
    c.fillStyle = '#fff';  // blanco = sólido
    drawPlatformCollisions(c, W, H);
  },

  // ---- ALCANTARILLAS ----
  alcantarillas(v, c, W, H) {
    // Fondo oscuro/verde
    const bg = v.createLinearGradient(0,0,0,H);
    bg.addColorStop(0,'#080c08'); bg.addColorStop(1,'#0c100a');
    v.fillStyle=bg; v.fillRect(0,0,W,H);

    // Goteo
    v.fillStyle='rgba(0,80,0,0.12)';
    for(let i=0;i<20;i++){
      v.fillRect(pseudoRand(i*31,W),0,2,H);
    }

    // Tuberías y paredes
    drawAlcantarillaVisuals(v, W, H);
    c.fillStyle='#fff';
    drawAlcantarillaCollisions(c, W, H);
  }
};

// =============================================
//  HELPERS DE DIBUJO — Ciudad Alta
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
    const bw = pseudoRand(bi*7+1, maxW-minW) + minW;
    const bh = pseudoRand(bi*11+3, y1-y0-minH) + minH;
    const by = H - bh;
    ctx.fillStyle = color;
    ctx.fillRect(x, by, bw, bh);
    ctx.fillStyle = roofColor;
    ctx.fillRect(x, by, bw, 4);
    // Ventanas
    ctx.fillStyle = 'rgba(255,220,120,0.12)';
    for (let wy = by+12; wy < by+bh-8; wy+=22) {
      for (let wx = x+8; wx < x+bw-8; wx+=16) {
        if (pseudoRand(wx*wy, 1) > 0.35) ctx.fillRect(wx, wy, 8, 10);
      }
    }
    x += bw + pseudoRand(bi*5+9, 8);
    bi++;
  }
}

function drawPlatformVisuals(ctx, W, H) {
  const ground = H - 60;
  // Suelo principal
  const gGrad = ctx.createLinearGradient(0, ground, 0, H);
  gGrad.addColorStop(0,'#252530'); gGrad.addColorStop(1,'#18181e');
  ctx.fillStyle = gGrad;
  ctx.fillRect(0, ground, W, H-ground);
  // Borde del suelo
  ctx.fillStyle = '#303040';
  ctx.fillRect(0, ground, W, 3);
  // Textura suelo: baldosas
  ctx.fillStyle = 'rgba(255,255,255,0.025)';
  for(let tx=0; tx<W; tx+=48) {
    ctx.fillRect(tx, ground+5, 44, 2);
    ctx.fillRect(tx+24, ground+14, 44, 2);
  }

  // Plataformas flotantes — misma data que colisiones
  PLATFORM_DATA.forEach(p => {
    if(p.type === 'stone') {
      const pg = ctx.createLinearGradient(p.x, p.y, p.x, p.y+p.h);
      pg.addColorStop(0,'#2e2e40'); pg.addColorStop(1,'#1e1e28');
      ctx.fillStyle = pg;
      ctx.fillRect(p.x, p.y, p.w, p.h);
      ctx.fillStyle = '#3a3a50';
      ctx.fillRect(p.x, p.y, p.w, 3);
      // Detalle: líneas de piedra
      ctx.fillStyle = 'rgba(255,255,255,0.04)';
      for(let bx=p.x+10; bx<p.x+p.w-5; bx+=20) ctx.fillRect(bx, p.y+4, 1, p.h-5);
    } else if(p.type === 'wood') {
      ctx.fillStyle = '#3a2810';
      ctx.fillRect(p.x, p.y, p.w, p.h);
      ctx.fillStyle = '#4a3418';
      ctx.fillRect(p.x, p.y, p.w, 2);
      ctx.fillStyle = '#2a1a08';
      for(let bx=p.x+8; bx<p.x+p.w; bx+=12) ctx.fillRect(bx, p.y+2, 1, p.h-2);
    } else if(p.type === 'metal') {
      ctx.fillStyle = '#283040';
      ctx.fillRect(p.x, p.y, p.w, p.h);
      ctx.fillStyle = '#405060';
      ctx.fillRect(p.x, p.y, p.w, 2);
      ctx.fillStyle = '#1a2030';
      for(let bx=p.x; bx<p.x+p.w; bx+=16) ctx.fillRect(bx, p.y, 2, p.h);
    } else if(p.type === 'chain') {
      // Plataforma colgante
      ctx.fillStyle = '#222';
      ctx.fillRect(p.x, p.y, p.w, p.h);
      ctx.fillStyle = '#404060';
      ctx.fillRect(p.x, p.y, p.w, 3);
      // Cadenas visuales
      ctx.fillStyle = '#505060';
      ctx.fillRect(p.x+10, p.y-20, 4, 22);
      ctx.fillRect(p.x+p.w-14, p.y-20, 4, 22);
    }
  });
}

function drawPlatformCollisions(ctx, W, H) {
  const ground = H - 60;
  ctx.fillRect(0, ground, W, H-ground);
  PLATFORM_DATA.forEach(p => {
    ctx.fillRect(p.x, p.y, p.w, p.h);
  });
}

function drawUrbanDetails(ctx, W, H) {
  const ground = H - 60;
  // Farolas
  const farolas = [80, 320, 680, 1040, 1450, 1890, 2300, 2750, 3050];
  farolas.forEach(fx => {
    ctx.fillStyle = '#282830';
    ctx.fillRect(fx-3, ground-80, 6, 80);
    ctx.save();
    ctx.shadowColor = '#f0d080'; ctx.shadowBlur = 20;
    ctx.fillStyle = '#f0d080';
    ctx.beginPath(); ctx.arc(fx, ground-80, 6, 0, Math.PI*2); ctx.fill();
    ctx.restore();
    // Halo de luz
    const lGrad = ctx.createRadialGradient(fx, ground-80, 0, fx, ground-80, 90);
    lGrad.addColorStop(0,'rgba(240,208,128,0.12)');
    lGrad.addColorStop(1,'transparent');
    ctx.fillStyle = lGrad;
    ctx.beginPath(); ctx.arc(fx, ground-80, 90, 0, Math.PI*2); ctx.fill();
  });

  // Carteles
  const carteles = [{x:200,y:ground-160,txt:'🍞 PANADERÍA'},{x:900,y:ground-200,txt:'⚠️ ZONA GATOS'},{x:1600,y:ground-180,txt:'🗺️ ZONA NORTE'}];
  carteles.forEach(c => {
    ctx.fillStyle = '#1a1420';
    ctx.fillRect(c.x, c.y-24, 130, 28);
    ctx.fillStyle = '#302840';
    ctx.fillRect(c.x, c.y-24, 130, 2);
    ctx.font = '11px serif';
    ctx.fillStyle = '#a090c0';
    ctx.fillText(c.txt, c.x+6, c.y-6);
  });
}

// =============================================
//  DATOS DE PLATAFORMAS — Ciudad Alta
//  Compartidos por visual y colisiones
// =============================================
const PLATFORM_DATA = [
  // Zona 1: inicio
  {x:100,  y:760, w:160, h:14, type:'stone'},
  {x:320,  y:720, w:120, h:14, type:'stone'},
  {x:500,  y:680, w:100, h:14, type:'wood'},
  {x:660,  y:720, w:130, h:14, type:'stone'},
  {x:840,  y:660, w:100, h:14, type:'stone'},
  // Zona 2: media
  {x:1000, y:700, w:110, h:14, type:'metal'},
  {x:1160, y:640, w:90,  h:14, type:'stone'},
  {x:1300, y:700, w:140, h:14, type:'stone'},
  {x:1480, y:640, w:80,  h:14, type:'chain'},
  {x:1600, y:700, w:100, h:14, type:'wood'},
  {x:1750, y:640, w:120, h:14, type:'stone'},
  // Zona 3: alta
  {x:1920, y:580, w:90,  h:14, type:'stone'},
  {x:2060, y:640, w:100, h:14, type:'metal'},
  {x:2200, y:560, w:80,  h:14, type:'wood'},
  {x:2340, y:620, w:110, h:14, type:'stone'},
  {x:2480, y:560, w:90,  h:14, type:'chain'},
  {x:2620, y:620, w:130, h:14, type:'stone'},
  {x:2800, y:560, w:100, h:14, type:'stone'},
  // Zona 4: final
  {x:2960, y:600, w:120, h:14, type:'metal'},
  {x:3060, y:540, w:80,  h:14, type:'stone'},
  // Cornisas altas
  {x:450,  y:560, w:60,  h:10, type:'wood'},
  {x:780,  y:520, w:60,  h:10, type:'wood'},
  {x:1380, y:500, w:60,  h:10, type:'chain'},
  {x:2100, y:440, w:60,  h:10, type:'stone'},
  {x:2780, y:420, w:60,  h:10, type:'chain'},
  // Edificio izquierdo
  {x:0,    y:720, w:80,  h:14, type:'stone'},
  {x:0,    y:620, w:60,  h:12, type:'stone'},
  // Edificio derecho
  {x:3120, y:720, w:80,  h:14, type:'stone'},
  {x:3120, y:620, w:60,  h:12, type:'stone'},
];

// =============================================
//  ALCANTARILLAS — Visual + Colisiones
// =============================================
function drawAlcantarillaVisuals(ctx, W, H) {
  // Suelo
  ctx.fillStyle = '#101810';
  ctx.fillRect(0, H-60, W, 60);
  ctx.fillStyle = '#1a2818';
  ctx.fillRect(0, H-60, W, 3);

  // Plataformas
  ALCANTARILLA_PLATS.forEach(p => {
    ctx.fillStyle = '#1e281e';
    ctx.fillRect(p.x, p.y, p.w, p.h);
    ctx.fillStyle = '#30402e';
    ctx.fillRect(p.x, p.y, p.w, 3);
  });

  // Tuberías horizontales
  [160, 380, 600, 900].forEach(ty => {
    ctx.fillStyle = '#202820';
    ctx.fillRect(0, ty, W, 20);
    ctx.fillStyle = '#304030';
    ctx.fillRect(0, ty, W, 3);
  });
}

function drawAlcantarillaCollisions(ctx, W, H) {
  ctx.fillRect(0, H-60, W, 60);
  ALCANTARILLA_PLATS.forEach(p => ctx.fillRect(p.x, p.y, p.w, p.h));
  [160, 380, 600, 900].forEach(ty => ctx.fillRect(0, ty, W, 20));
}

const ALCANTARILLA_PLATS = [
  {x:100, y:750, w:140,h:12},{x:300,y:700,w:100,h:12},
  {x:480,y:660,w:120,h:12},{x:700,y:720,w:90,h:12},
  {x:900,y:680,w:110,h:12},{x:1100,y:640,w:130,h:12},
];
