// =============================================
//  PALOMA MIGAJERA v3 — SHARED UTILITIES
// =============================================

const SAVE_KEY = 'pm_v3_save';
const CFG_KEY  = 'pm_v3_cfg';

// ---- Datos por defecto ----
function defaultSave() {
  return {
    slot: 1,
    nombre: 'Paloma',
    dificultad: 'normal',   // 'facil' | 'normal' | 'dificil' | 'pesadilla'
    zona: 'ciudad_alta',
    checkpoint: { x: 240, y: 0 },  // y=0 → se pone encima del suelo
    nivel: 1,
    xp: 0, xpNext: 100,
    vida: 5, vidaMax: 5,
    energia: 100, energiaMax: 100,
    migajas: 0,
    migajasTotal: 0,
    muertes: 0,
    tiempoJugado: 0,       // segundos
    logros: [],
    habilidades: {
      dobleSalto: false,
      dash:       false,
      picado:     false,
      planeo:     false,
    },
    amuletosEquipados: [],
    inventario: {},
    zonasVisitadas: ['ciudad_alta'],
    enemigosDerrotados: 0,
  };
}

function defaultCfg() {
  return {
    audio:    { musica: 70, efectos: 80, ambiente: 50 },
    graficos: { calidad: 'media', particulas: true, vsync: true },
    controles: {
      izq:    'ArrowLeft',
      der:    'ArrowRight',
      saltar: 'Space',
      dash:   'ShiftLeft',
      ataque: 'KeyZ',
      especial:'KeyX',
      abajo:  'ArrowDown',
      pausa:  'Escape',
      mapa:   'KeyM',
      inv:    'KeyI',
    },
    juego: { autoGuardar: true, tutoriales: true, subtitulos: true, idioma: 'es' },
  };
}

function getSave() {
  try { return JSON.parse(localStorage.getItem(SAVE_KEY)) || null; }
  catch { return null; }
}
function setSave(data) {
  localStorage.setItem(SAVE_KEY, JSON.stringify(data));
}
function getCfg() {
  try { return JSON.parse(localStorage.getItem(CFG_KEY)) || defaultCfg(); }
  catch { return defaultCfg(); }
}
function setCfg(data) {
  localStorage.setItem(CFG_KEY, JSON.stringify(data));
}
function deleteSave() {
  localStorage.removeItem(SAVE_KEY);
}

// ---- Dificultad: multiplicadores ----
const DIFICULTAD = {
  facil:     { dmgRecibido: 0.5,  dmgEnemigo: 0.7,  enemigoHp: 0.7,  migajas: 1.5, label: 'Fácil',      desc: 'Para disfrutar la historia sin estrés.' },
  normal:    { dmgRecibido: 1.0,  dmgEnemigo: 1.0,  enemigoHp: 1.0,  migajas: 1.0, label: 'Normal',     desc: 'La experiencia equilibrada.' },
  dificil:   { dmgRecibido: 1.5,  dmgEnemigo: 1.3,  enemigoHp: 1.5,  migajas: 0.8, label: 'Difícil',    desc: 'Los enemigos son más agresivos y resistentes.' },
  pesadilla: { dmgRecibido: 2.0,  dmgEnemigo: 2.0,  enemigoHp: 2.5,  migajas: 0.5, label: 'Pesadilla',  desc: 'Un golpe puede ser fatal. Solo para expertos.' },
};

// ---- Navegación con fade ----
function goTo(url) {
  document.body.style.transition = 'opacity 0.4s ease';
  document.body.style.opacity = '0';
  setTimeout(() => { window.location.href = url; }, 400);
}

// ---- Toast ----
function toast(msg, type = '', dur = 3200) {
  const old = document.querySelector('.toast');
  if (old) old.remove();
  const el = document.createElement('div');
  el.className = 'toast ' + type;
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => {
    el.style.animation = 'toastOut 0.28s ease forwards';
    setTimeout(() => el.remove(), 280);
  }, dur);
}

// ---- Formatear tiempo ----
function fmtTime(sec) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (h) return `${h}h ${m}m`;
  if (m) return `${m}m ${s}s`;
  return `${s}s`;
}

// ---- Formatear nombre de tecla ----
const KEY_NAME = {
  ArrowLeft:'←', ArrowRight:'→', ArrowUp:'↑', ArrowDown:'↓',
  Space:'ESPACIO', Escape:'ESC', ShiftLeft:'SHIFT', ShiftRight:'SHIFT',
  KeyZ:'Z', KeyX:'X', KeyM:'M', KeyI:'I',
};
function fmtKey(code) {
  if (KEY_NAME[code]) return KEY_NAME[code];
  if (code.startsWith('Key'))   return code.slice(3);
  if (code.startsWith('Digit')) return code.slice(5);
  return code;
}

// ---- Partículas flotantes ----
function initParticles(id = 'particles') {
  const canvas = document.getElementById(id);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const COLORS = ['#e8c840','#c07030','#f0e090','#6ab0d8','#ffffff'];
  let W, H;
  const resize = () => { W = canvas.width = innerWidth; H = canvas.height = innerHeight; };
  resize(); addEventListener('resize', resize);

  const N = 55;
  const pts = Array.from({length: N}, () => ({
    x: Math.random() * innerWidth,
    y: Math.random() * innerHeight,
    r: Math.random() * 1.8 + 0.4,
    vx: (Math.random() - 0.5) * 0.12,
    vy: -(Math.random() * 0.25 + 0.04),
    a: Math.random() * 0.35 + 0.07,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    sq: Math.random() > 0.55,
  }));

  (function loop() {
    ctx.clearRect(0, 0, W, H);
    for (const p of pts) {
      ctx.globalAlpha = p.a;
      ctx.fillStyle = p.color;
      if (p.sq) ctx.fillRect(p.x - p.r, p.y - p.r, p.r*2, p.r*2);
      else { ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2); ctx.fill(); }
      p.x += p.vx; p.y += p.vy;
      if (p.y < -8) { p.y = H + 8; p.x = Math.random() * W; }
      if (p.x < -8) p.x = W + 8;
      if (p.x > W + 8) p.x = -8;
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(loop);
  })();
}

// ---- Fade-in al cargar ----
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  document.body.style.opacity = '0';
  requestAnimationFrame(() => {
    document.body.style.transition = 'opacity 0.45s ease';
    document.body.style.opacity = '1';
  });
});
