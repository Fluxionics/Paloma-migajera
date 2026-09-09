// =============================================
//  PALOMA MIGAJERA v4 — SVG ICON SYSTEM
//  Reemplaza todos los emojis con SVGs inline
// =============================================

const ICONS = {
  // ---- HUD / Juego ----
  heart: `<svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 14s-5.5-3.5-7-6.5C.5 5 .5 3 2 2s3 .5 4 2c1-1.5 3-2 4-2s3.5 1 3.5 3.5S9.5 10.5 8 14z"/></svg>`,
  heartEmpty: `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M8 14s-5.5-3.5-7-6.5C.5 5 .5 3 2 2s3 .5 4 2c1-1.5 3-2 4-2s3.5 1 3.5 3.5S9.5 10.5 8 14z"/></svg>`,
  bread: `<svg viewBox="0 0 16 16"><ellipse cx="8" cy="9" rx="7" ry="5" fill="#e8c840"/><ellipse cx="8" cy="8" rx="6" ry="4" fill="#f0d860"/><ellipse cx="7" cy="7" rx="2" ry="1.5" fill="#fff8a0" opacity="0.5"/></svg>`,
  mp: `<svg viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="8" r="6" fill="none" stroke="#30a0d8" stroke-width="2"/><path d="M6 5v6l4-3z" fill="#30a0d8"/></svg>`,
  energy: `<svg viewBox="0 0 16 16" fill="#e8c840"><polygon points="9,1 5,8 8,8 7,15 11,8 8,8"/></svg>`,
  level: `<svg viewBox="0 0 16 16" fill="currentColor"><polygon points="8,1 10,6 16,6 11,10 13,15 8,12 3,15 5,10 0,6 6,6"/></svg>`,

  // ---- Ataques / Habilidades ----
  sword: `<svg viewBox="0 0 16 16" fill="currentColor"><rect x="7" y="1" width="2" height="9" rx="1"/><rect x="4" y="9" width="8" height="2" rx="1"/><rect x="7" y="11" width="2" height="4" rx="1"/></svg>`,
  palomaduken: `<svg viewBox="0 0 16 16"><circle cx="8" cy="8" r="5" fill="#6ab0d8" opacity="0.6"/><circle cx="8" cy="8" r="3" fill="#c0e8ff"/><circle cx="8" cy="8" r="1.5" fill="#fff"/></svg>`,
  dash: `<svg viewBox="0 0 16 16" fill="currentColor"><path d="M2 8h10l-3-3 1-1 4 4-4 4-1-1 3-3H2z" opacity="0.7"/></svg>`,
  doubleJump: `<svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 1l3 4H5zM8 6l3 4H5z" opacity="0.8"/></svg>`,
  shield: `<svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 1L2 4v4c0 3.5 2.7 6.8 6 8 3.3-1.2 6-4.5 6-8V4z" opacity="0.6"/></svg>`,
  thunder: `<svg viewBox="0 0 16 16" fill="#e8c840"><polygon points="9,1 5,8 8,8 7,15 11,8 8,8"/></svg>`,

  // ---- Navegación ----
  swordNav: `<svg viewBox="0 0 16 16" fill="currentColor"><rect x="7" y="1" width="2" height="8"/><rect x="4" y="8" width="8" height="2"/><rect x="7" y="10" width="2" height="5"/></svg>`,
  folder: `<svg viewBox="0 0 16 16" fill="currentColor"><path d="M1 3h5l2 2h7v9H1z" opacity="0.6"/></svg>`,
  star: `<svg viewBox="0 0 16 16" fill="currentColor"><polygon points="8,1 10,6 16,6 11,10 13,15 8,12 3,15 5,10 0,6 6,6"/></svg>`,
  backpack: `<svg viewBox="0 0 16 16" fill="currentColor"><rect x="3" y="5" width="10" height="9" rx="2" opacity="0.6"/><rect x="5" y="2" width="6" height="3" rx="1" opacity="0.4"/></svg>`,
  settings: `<svg viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="8" r="3" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3 3l1.5 1.5M11.5 11.5L13 13M13 3l-1.5 1.5M4.5 11.5L3 13" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>`,
  scroll: `<svg viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="2" width="12" height="12" rx="2" opacity="0.5"/><line x1="4" y1="5" x2="12" y2="5" stroke="#080810" stroke-width="1"/><line x1="4" y1="8" x2="10" y2="8" stroke="#080810" stroke-width="1"/><line x1="4" y1="11" x2="11" y2="11" stroke="#080810" stroke-width="1"/></svg>`,
  save: `<svg viewBox="0 0 16 16" fill="currentColor"><path d="M2 2h9l3 3v9H2z" opacity="0.6"/><rect x="4" y="8" width="8" height="5" fill="#080810" opacity="0.4"/><rect x="5" y="9" width="3" height="2" rx="0.5"/></svg>`,
  home: `<svg viewBox="0 0 16 16" fill="currentColor"><path d="M2 8l6-6 6 6v6H2z" opacity="0.6"/><rect x="6" y="10" width="4" height="4"/></svg>`,
  arrowLeft: `<svg viewBox="0 0 16 16" fill="currentColor"><path d="M10 3l-5 5 5 5" fill="none" stroke="currentColor" stroke-width="2"/></svg>`,
  arrowRight: `<svg viewBox="0 0 16 16" fill="currentColor"><path d="M6 3l5 5-5 5" fill="none" stroke="currentColor" stroke-width="2"/></svg>`,
  back: `<svg viewBox="0 0 16 16" fill="currentColor"><path d="M10 3L5 8l5 5" fill="none" stroke="currentColor" stroke-width="2"/></svg>`,

  // ---- Mapa ----
  map: `<svg viewBox="0 0 16 16" fill="currentColor"><rect x="1" y="1" width="14" height="14" rx="1" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="5" y1="1" x2="5" y2="15" stroke="currentColor" stroke-width="1"/><line x1="11" y1="1" x2="11" y2="15" stroke="currentColor" stroke-width="1"/></svg>`,
  lock: `<svg viewBox="0 0 16 16" fill="currentColor"><rect x="3" y="7" width="10" height="8" rx="1" opacity="0.6"/><path d="M5 7V5a3 3 0 016 0v2" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>`,
  check: `<svg viewBox="0 0 16 16" fill="currentColor"><path d="M3 8l4 4 6-8" fill="none" stroke="currentColor" stroke-width="2"/></svg>`,
  cross: `<svg viewBox="0 0 16 16" fill="currentColor"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="2" fill="none"/></svg>`,

  // ---- Misc ----
  flame: `<svg viewBox="0 0 16 16"><path d="M8 1c-1 3-4 4-4 7a4 4 0 008 0c0-3-3-4-4-7z" fill="#f0a020"/><path d="M8 5c-.5 1.5-2 2-2 3.5a2 2 0 004 0c0-1.5-1.5-2-2-3.5z" fill="#ffe060"/></svg>`,
  portal: `<svg viewBox="0 0 16 16"><ellipse cx="8" cy="8" rx="5" ry="7" fill="none" stroke="#6ab0d8" stroke-width="1.5"/><ellipse cx="8" cy="8" rx="2.5" ry="4" fill="#6ab0d8" opacity="0.3"/></svg>`,
  checkpoint: `<svg viewBox="0 0 16 16"><rect x="7" y="4" width="2" height="10" fill="#555"/><path d="M5 4c1-2 2-3 3-3s2 1 3 3z" fill="#f0a020"/><circle cx="8" cy="4" r="2" fill="#ffe060" opacity="0.6"/></svg>`,
  feather: `<svg viewBox="0 0 16 16" fill="currentColor"><path d="M12 1c-2 2-4 5-5 8-1 3-2 5-3 6 1-2 3-4 5-5 2-1 4-2 6-5z" opacity="0.7"/></svg>`,
  pigeon: `<svg viewBox="0 0 24 24" fill="currentColor"><ellipse cx="12" cy="14" rx="5" ry="6" fill="#e8e8f8"/><ellipse cx="12" cy="10" rx="4" ry="4" fill="#f0f0ff"/><circle cx="14" cy="9" r="1.5" fill="#080810"/><circle cx="14.5" cy="8.5" r="0.5" fill="#fff"/><rect x="16" y="9" width="3" height="1.5" rx="0.5" fill="#e8c040"/><ellipse cx="8" cy="13" rx="4" ry="3" fill="#c0c0e0"/></svg>`,
  pigeonSmall: `<svg viewBox="0 0 16 16" fill="currentColor"><ellipse cx="8" cy="9" rx="3" ry="4" fill="#e8e8f8"/><ellipse cx="8" cy="7" rx="2.5" ry="2.5" fill="#f0f0ff"/><circle cx="9.5" cy="6.5" r="1" fill="#080810"/><rect x="11" y="6.5" width="2" height="1" rx="0.3" fill="#e8c040"/></svg>`,
  cat: `<svg viewBox="0 0 16 16" fill="currentColor"><rect x="3" y="5" width="10" height="8" rx="2" fill="#605868"/><rect x="4" y="2" width="3" height="4" fill="#807888"/><rect x="9" y="2" width="3" height="4" fill="#807888"/><circle cx="5.5" cy="7" r="1" fill="#ff7070"/><circle cx="10.5" cy="7" r="1" fill="#ff7070"/><rect x="3" y="8" width="2" height="1.5" rx="0.5" fill="#605868"/></svg>`,
  rat: `<svg viewBox="0 0 16 16" fill="currentColor"><ellipse cx="8" cy="9" rx="4" ry="3" fill="#3a301e"/><ellipse cx="12" cy="8" rx="2" ry="1.5" fill="#4a3828"/><path d="M4 9c-2 0-3 1-3 0" stroke="#5a4030" fill="none" stroke-width="1"/><circle cx="11" cy="8" r="0.7" fill="#ff4040"/><circle cx="4" cy="8" r="0.7" fill="#ff4040"/></svg>`,
  crow: `<svg viewBox="0 0 24 24" fill="currentColor"><ellipse cx="12" cy="14" rx="5" ry="5" fill="#202028"/><ellipse cx="12" cy="10" rx="4" ry="5" fill="#181820"/><rect x="5" y="8" width="5" height="8" fill="#181820"/><rect x="14" y="8" width="5" height="8" fill="#181820"/><rect x="14" y="8" width="4" height="2" fill="#a08020"/><circle cx="10" cy="9" r="1.5" fill="#8040c0"/></svg>`,
  npc: `<svg viewBox="0 0 16 16" fill="currentColor"><rect x="4" y="6" width="8" height="8" rx="1" fill="#c8a040"/><circle cx="8" cy="4" r="3" fill="#d0b050"/><rect x="5" y="1" width="2" height="3" fill="#f8e060"/><rect x="7" y="0" width="2" height="4" fill="#f8e060"/><rect x="9" y="1" width="2" height="3" fill="#f8e060"/></svg>`,
  particle: `<svg viewBox="0 0 8 8"><circle cx="4" cy="4" r="3" fill="#e8c840" opacity="0.6"/></svg>`,

  // ---- Sidebar icons (settings) ----
  audio: `<svg viewBox="0 0 16 16" fill="currentColor"><path d="M2 5h3l4-3v12l-4-3H2z" opacity="0.6"/><path d="M11 5c1 1 1 5 0 6" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M12.5 3c2 2 2 8 0 10" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>`,
  palette: `<svg viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="6" cy="6" r="1.2" fill="#c03030"/><circle cx="10" cy="5" r="1.2" fill="#6ab0d8"/><circle cx="5" cy="9" r="1.2" fill="#40b860"/><circle cx="9" cy="10" r="1.2" fill="#e8c840"/></svg>`,
  gamepad: `<svg viewBox="0 0 16 16" fill="currentColor"><rect x="1" y="4" width="14" height="8" rx="3" opacity="0.6"/><circle cx="5" cy="8" r="1.2" fill="#080810"/><circle cx="11" cy="7" r="0.8" fill="#c03030"/><circle cx="13" cy="8" r="0.8" fill="#6ab0d8"/></svg>`,
  gear: `<svg viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="8" r="2.5" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3 3l1.5 1.5M11.5 11.5L13 13M13 3l-1.5 1.5M4.5 11.5L3 13" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>`,
  chart: `<svg viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="8" width="3" height="6" opacity="0.6"/><rect x="6" y="5" width="3" height="9" opacity="0.6"/><rect x="10" y="2" width="3" height="12" opacity="0.6"/></svg>`,
  database: `<svg viewBox="0 0 16 16" fill="currentColor"><ellipse cx="8" cy="4" rx="6" ry="2.5" opacity="0.6"/><path d="M2 4v8c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5V4" fill="none" stroke="currentColor" stroke-width="1.2"/><ellipse cx="8" cy="8" rx="6" ry="2.5" fill="none" stroke="currentColor" stroke-width="0.8" opacity="0.4"/></svg>`,

  // ---- Alert / Warning ----
  warning: `<svg viewBox="0 0 16 16" fill="#c06030"><path d="M8 1L1 14h14zM8 5v5M8 12v1"/></svg>`,
  info: `<svg viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" stroke-width="1.5"/><text x="8" y="11" text-anchor="middle" font-size="8" font-weight="bold" fill="currentColor">i</text></svg>`,
  delete: `<svg viewBox="0 0 16 16" fill="currentColor"><rect x="4" y="3" width="8" height="11" rx="1" fill="none" stroke="currentColor" stroke-width="1.2"/><line x1="2" y1="4" x2="14" y2="4" stroke="currentColor" stroke-width="1.2"/><line x1="6" y1="1" x2="10" y2="1" stroke="currentColor" stroke-width="1.2"/><line x1="6" y1="7" x2="6" y2="11" stroke="currentColor" stroke-width="1"/><line x1="10" y1="7" x2="10" y2="11" stroke="currentColor" stroke-width="1"/></svg>`,
  refresh: `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 8a6 6 0 0111-3M14 8a6 6 0 01-11 3"/><polyline points="2,3 2,8 7,8" stroke-width="1.5"/><polyline points="14,13 14,8 9,8" stroke-width="1.5"/></svg>`,
  play: `<svg viewBox="0 0 16 16" fill="currentColor"><polygon points="4,2 14,8 4,14"/></svg>`,
  store: `<svg viewBox="0 0 16 16" fill="currentColor"><rect x="1" y="6" width="14" height="8" opacity="0.5"/><path d="M0 6h16l-1-2H1z" opacity="0.7"/><rect x="6" y="9" width="4" height="5" opacity="0.3"/></svg>`,
};

function icon(name, size = 16, cls = '') {
  const svg = ICONS[name] || ICONS.particle;
  return `<span class="svg-icon ${cls}" style="width:${size}px;height:${size}px;display:inline-flex;align-items:center;justify-content:center;">${svg}</span>`;
}
