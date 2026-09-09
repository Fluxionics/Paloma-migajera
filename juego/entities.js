// =============================================
//  PALOMA MIGAJERA v4 — ENTITIES
//  Mejoras: más enemigos, mejor distribución,
//  bosses mejorados, más migajas
// =============================================

function getDiff() {
  const s = getSave();
  return DIFICULTAD[s?.dificultad || 'normal'];
}

// =============================================
//  JUGADOR
// =============================================
function createPlayer(save) {
  const diff = DIFICULTAD[save.dificultad || 'normal'];
  return {
    x: save.checkpoint?.x || 240,
    y: 0,
    w: 14, h: 14,
    vx: 0, vy: 0,
    onGround: false,
    facing: 1,
    jumpsLeft: 1,
    maxJumps: save.habilidades.dobleSalto ? 2 : 1,
    dashing: false, dashCooldown: 0, dashDir: 1, dashTimer: 0,
    gliding: false,
    wallSliding: false,
    isPounding: false,
    hp: save.vida, hpMax: save.vidaMax,
    mp: 100, mpMax: 100,
    energy: save.energia, energyMax: save.energiaMax,
    migajas: save.migajas,
    invincible: false, invTimer: 0,
    attacking: false, atkTimer: 0,
    attackFrame: 0,
    palouCooldown: 0,
    comboCount: 0, comboTimer: 0,
    habilidades: { ...save.habilidades },
    diff,
    animFrame: 0, animTimer: 0, walkCycle: 0,
    coyoteTimer: 0, jumpBufferTimer: 0,
    afterimages: [],
    hasDoubleJumped: false,
    alive: true,
  };
}

// =============================================
//  ENEMIGOS
// =============================================
const ENEMY_DEFS = {
  gato: {
    w: 20, h: 16, hp: 3, speed: 1.2, dmg: 1,
    aggroRange: 200, atkRange: 24, atkCooldown: 800, stunDur: 260,
    xp: 15, migajas: 3, color: '#605868',
    aiState: 'patrol',
  },
  rata: {
    w: 16, h: 12, hp: 1, speed: 1.8, dmg: 1,
    aggroRange: 130, atkRange: 18, atkCooldown: 500, stunDur: 180,
    xp: 8, migajas: 2, color: '#3a301e',
    aiState: 'patrol',
  },
  cuervo: {
    w: 24, h: 20, hp: 8, speed: 2.0, dmg: 2,
    aggroRange: 280, atkRange: 30, atkCooldown: 700, stunDur: 200,
    xp: 40, migajas: 8, color: '#202028',
    aiState: 'patrol',
  },
  gato_grande: {
    w: 28, h: 22, hp: 12, speed: 1.0, dmg: 2,
    aggroRange: 220, atkRange: 30, atkCooldown: 1100, stunDur: 350,
    xp: 60, migajas: 12, color: '#504848',
    aiState: 'patrol',
  },
  rata_voladora: {
    w: 18, h: 14, hp: 3, speed: 1.4, dmg: 1,
    aggroRange: 200, atkRange: 20, atkCooldown: 600, stunDur: 200,
    xp: 20, migajas: 4, color: '#3a2828',
    aiState: 'patrol',
  },
  jefe_cuervo: {
    w: 52, h: 44, hp: 50, speed: 2.4, dmg: 3,
    aggroRange: 500, atkRange: 60, atkCooldown: 1000, stunDur: 350,
    xp: 250, migajas: 40, color: '#101018', isBoss: true,
    aiState: 'patrol',
  },
  jefe_rata: {
    w: 44, h: 36, hp: 35, speed: 2.0, dmg: 2,
    aggroRange: 400, atkRange: 45, atkCooldown: 800, stunDur: 300,
    xp: 180, migajas: 25, color: '#2a1808', isBoss: true,
    aiState: 'patrol',
  },
};

function spawnEnemies(zoneId, diff) {
  const base = ZONE_ENEMIES[zoneId] || ZONE_ENEMIES['ciudad_alta'];
  return base.map(def => {
    const template = ENEMY_DEFS[def.type];
    if (!template) return null;
    return {
      ...template,
      type: def.type,
      x: def.x, y: def.y || 0,
      vx: def.dir * template.speed,
      dir: def.dir || 1,
      patrolMin: def.patrolMin,
      patrolMax: def.patrolMax,
      alive: true,
      stunTimer: 0,
      atkCdTimer: 0,
      atkTimer: 0,
      hp: Math.round(template.hp * diff.enemigoHp),
      maxHp: Math.round(template.hp * diff.enemigoHp),
      aggroActive: false,
      aiState: 'patrol',
      animTimer: Math.random() * 1000,
      chargeTimer: 0,
      isCharging: false,
      attackTelegraph: false,
      retreatTimer: 0,
      onGround: false,
    };
  }).filter(Boolean);
}

const ZONE_ENEMIES = {
  ciudad_alta: [
    // Zona 1: intro fácil
    { type: 'rata', x: 400, dir: 1, patrolMin: 300, patrolMax: 600 },
    { type: 'gato', x: 700, dir: -1, patrolMin: 580, patrolMax: 800 },
    // Zona 2: media
    { type: 'rata', x: 1000, dir: 1, patrolMin: 900, patrolMax: 1150 },
    { type: 'gato', x: 1300, dir: -1, patrolMin: 1180, patrolMax: 1450 },
    { type: 'cuervo', x: 1550, dir: 1, patrolMin: 1450, patrolMax: 1700 },
    { type: 'rata', x: 1750, dir: -1, patrolMin: 1650, patrolMax: 1880 },
    // Zona 3: difícil
    { type: 'cuervo', x: 2000, dir: 1, patrolMin: 1900, patrolMax: 2150 },
    { type: 'gato', x: 2200, dir: -1, patrolMin: 2100, patrolMax: 2380 },
    { type: 'gato_grande', x: 2450, dir: 1, patrolMin: 2350, patrolMax: 2600 },
    { type: 'cuervo', x: 2700, dir: -1, patrolMin: 2600, patrolMax: 2850 },
    { type: 'rata', x: 2850, dir: 1, patrolMin: 2780, patrolMax: 3000 },
    // Zona 4: antes del boss
    { type: 'cuervo', x: 2950, dir: -1, patrolMin: 2900, patrolMax: 3100 },
    // Boss
    { type: 'jefe_cuervo', x: 3080, dir: -1, patrolMin: 2980, patrolMax: 3150 },
  ],
  alcantarillas: [
    { type: 'rata', x: 250, dir: 1, patrolMin: 150, patrolMax: 400 },
    { type: 'rata', x: 500, dir: -1, patrolMin: 380, patrolMax: 650 },
    { type: 'rata_voladora', x: 700, dir: 1, patrolMin: 580, patrolMax: 850 },
    { type: 'gato', x: 950, dir: -1, patrolMin: 830, patrolMax: 1100 },
    { type: 'rata', x: 1150, dir: 1, patrolMin: 1050, patrolMax: 1350 },
    { type: 'rata_voladora', x: 1350, dir: -1, patrolMin: 1250, patrolMax: 1500 },
    // Boss de alcantarillas
    { type: 'jefe_rata', x: 1500, dir: -1, patrolMin: 1400, patrolMax: 1580 },
  ],
};

// =============================================
//  MIGAJAS DEL MUNDO
// =============================================
function spawnWorldMigajas(zoneId) {
  return (ZONE_MIGAJAS[zoneId] || []).map((pos, i) => ({
    id: i, x: pos[0], y: pos[1],
    r: 4, alive: true,
    bob: Math.random() * Math.PI * 2,
    value: pos[2] || 1,
  }));
}

const ZONE_MIGAJAS = {
  ciudad_alta: [
    [120, 745, 1], [140, 745, 1], [160, 745, 1],
    [335, 705, 1], [355, 705, 1],
    [515, 665, 1], [535, 665, 1],
    [680, 705, 2], [700, 705, 2],
    [860, 645, 1], [880, 645, 1], [900, 645, 1],
    [1020, 685, 1], [1040, 685, 1],
    [1180, 625, 2], [1200, 625, 2],
    [1320, 685, 1], [1350, 685, 1], [1380, 685, 1],
    [1500, 625, 2],
    [1620, 685, 1], [1650, 685, 1],
    [1770, 625, 2], [1800, 625, 2],
    [1940, 565, 3], [1960, 565, 3],
    [2080, 625, 2], [2100, 625, 2],
    [2220, 545, 3], [2240, 545, 3],
    [2500, 545, 3], [2530, 545, 3],
    [460, 545, 5], [780, 505, 5], [1390, 485, 5],
    [2110, 425, 5], [2790, 405, 5],
    [300, 820, 1], [600, 820, 1], [900, 820, 1],
    [1200, 820, 1], [1500, 820, 1], [1800, 820, 1],
    [2100, 820, 1], [2400, 820, 1], [2700, 820, 1],
  ],
  alcantarillas: [
    [150, 730, 1], [170, 730, 1],
    [350, 680, 1], [370, 680, 1], [390, 680, 2],
    [530, 640, 1], [550, 640, 1],
    [720, 700, 2], [740, 700, 2],
    [930, 660, 1], [950, 660, 1], [970, 660, 1],
    [1120, 620, 2], [1140, 620, 3],
    [250, 140, 5], [600, 360, 5], [900, 580, 5],
  ],
};

// =============================================
//  NPCs
// =============================================
function spawnNPCs(zoneId) {
  return (ZONE_NPCS[zoneId] || []).map(n => ({ ...n }));
}

const ZONE_NPCS = {
  ciudad_alta: [
    {
      x: 50, y: 0, w: 14, h: 18, color: '#c8a040', name: 'Lechuza Sabia',
      dialogues: [
        'Las migajas del Tejado de los Gansos son las más doradas de la ciudad.',
        'Si dominas el Planeo Silencioso, los gatos jamás te oirán caer.',
        'Al este encontrarás las Alcantarillas... Cuidado con las ratas del alcantarillado.',
        'Dicen que el Cuervo de la Chimenea guarda el doble salto. Derrótalo y será tuyo.',
        'Recuerda: un dash bien Timing puede salvarte de cualquier ataque.',
        'Las plataformas de cadena se mueven... espera, no, eso era en otra vida.',
      ],
      dIdx: 0,
    },
  ],
  alcantarillas: [
    {
      x: 120, y: 0, w: 14, h: 18, color: '#50a050', name: 'Rata Erudita',
      dialogues: [
        'Bienvenido a las profundidades... cuidado con los charcos.',
        'La Rata Reina es poderosa, pero tiene un punto débil: su arrogancia.',
        'Las migajas aquí son menos valiosas, pero más fáciles de encontrar.',
        'Si ves una plataforma de metal, ¡no confíes! Se mueve cuando menos lo esperas.',
      ],
      dIdx: 0,
    },
  ],
};

// =============================================
//  PORTALES DE ZONA
// =============================================
const ZONE_PORTALS = {
  ciudad_alta: [
    { x: 3150, y: 0, w: 40, h: 900, toZone: 'alcantarillas', label: 'Alcantarillas →' },
  ],
  alcantarillas: [
    { x: 0, y: 0, w: 40, h: 900, toZone: 'ciudad_alta', label: '← Ciudad Alta' },
  ],
};

// =============================================
//  CHECKPOINTS
// =============================================
const ZONE_CHECKPOINTS = {
  ciudad_alta: [
    { x: 240, y: 0, id: 'cp_inicio', lit: true },
    { x: 900, y: 0, id: 'cp_medio1', lit: false },
    { x: 1700, y: 0, id: 'cp_medio2', lit: false },
    { x: 2600, y: 0, id: 'cp_final', lit: false },
  ],
  alcantarillas: [
    { x: 200, y: 0, id: 'cp_alc_1', lit: true },
    { x: 750, y: 0, id: 'cp_alc_2', lit: false },
    { x: 1300, y: 0, id: 'cp_alc_3', lit: false },
  ],
};
