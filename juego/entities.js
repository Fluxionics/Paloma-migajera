// =============================================
//  PALOMA MIGAJERA v3 — ENTITIES
// =============================================

// ---- Multiplicadores de dificultad ----
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
    // Posición y tamaño
    x: save.checkpoint?.x || 240,
    y: 0,           // se ajusta al suelo en primer frame
    w: 14, h: 14,
    // Física
    vx: 0, vy: 0,
    onGround: false,
    // Estado
    facing: 1,      // 1 derecha, -1 izquierda
    // Salto
    jumpsLeft: 1,
    maxJumps: save.habilidades.dobleSalto ? 2 : 1,
    // Dash
    dashing: false, dashCooldown: 0, dashDir: 1, dashTimer: 0,
    // Planeo
    gliding: false,
    // Stats
    hp:  save.vida,    hpMax: save.vidaMax,
    mp:  100,          mpMax: 100,
    energy: save.energia, energyMax: save.energiaMax,
    migajas: save.migajas,
    // Combate
    invincible: false, invTimer: 0,
    attacking: false,  atkTimer: 0,
    palouCooldown: 0,
    // Habilidades
    habilidades: { ...save.habilidades },
    // Dificultad
    diff,
    // Animación
    animFrame: 0, animTimer: 0, walkCycle: 0,
  };
}

// =============================================
//  ENEMIGOS
// =============================================
const ENEMY_DEFS = {
  gato: {
    w:18, h:14, hp:3, speed:1.1, dmg:1,
    aggroRange:180, atkRange:22, atkCooldown:900, stunDur:280,
    xp:15, migajas:3, color:'#605868',
  },
  rata: {
    w:14, h:10, hp:1, speed:1.5, dmg:1,
    aggroRange:120, atkRange:16, atkCooldown:600, stunDur:200,
    xp:8, migajas:2, color:'#3a301e',
  },
  cuervo: {
    w:22, h:18, hp:8, speed:1.8, dmg:2,
    aggroRange:250, atkRange:28, atkCooldown:700, stunDur:180,
    xp:40, migajas:8, color:'#202028',
  },
  jefe_cuervo: {
    w:48, h:40, hp:40, speed:2.2, dmg:3,
    aggroRange:400, atkRange:55, atkCooldown:1200, stunDur:400,
    xp:200, migajas:30, color:'#101018', isBoss:true,
  },
};

function spawnEnemies(zoneId, diff) {
  const base = ZONE_ENEMIES[zoneId] || ZONE_ENEMIES['ciudad_alta'];
  return base.map(def => {
    const template = ENEMY_DEFS[def.type];
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
      atkTimer: 0,
      hp: Math.round(template.hp * diff.enemigoHp),
      maxHp: Math.round(template.hp * diff.enemigoHp),
      aggroActive: false,
    };
  });
}

const ZONE_ENEMIES = {
  ciudad_alta: [
    {type:'gato',  x:520,  dir:-1, patrolMin:420, patrolMax:650},
    {type:'rata',  x:820,  dir:1,  patrolMin:720, patrolMax:980},
    {type:'gato',  x:1200, dir:-1, patrolMin:1100,patrolMax:1420},
    {type:'rata',  x:1650, dir:1,  patrolMin:1550,patrolMax:1800},
    {type:'cuervo',x:2150, dir:-1, patrolMin:2000,patrolMax:2380},
    {type:'gato',  x:2600, dir:1,  patrolMin:2500,patrolMax:2800},
    {type:'rata',  x:2900, dir:-1, patrolMin:2820,patrolMax:3080},
    {type:'jefe_cuervo', x:3050, dir:-1, patrolMin:2980, patrolMax:3150},
  ],
  alcantarillas: [
    {type:'rata', x:300, dir:1,  patrolMin:200,patrolMax:500},
    {type:'rata', x:700, dir:-1, patrolMin:580,patrolMax:900},
    {type:'gato', x:1100,dir:1,  patrolMin:980,patrolMax:1250},
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
    // Zona 1
    [120,745,1],[140,745,1],[160,745,1],
    [335,705,1],[355,705,1],
    [515,665,1],[535,665,1],
    [680,705,2],[700,705,2],
    [860,645,1],[880,645,1],[900,645,1],
    // Zona 2
    [1020,685,1],[1040,685,1],
    [1180,625,2],[1200,625,2],
    [1320,685,1],[1350,685,1],[1380,685,1],
    [1500,625,2],
    [1620,685,1],[1650,685,1],
    [1770,625,2],[1800,625,2],
    // Zona 3 (más difícil = más reward)
    [1940,565,3],[1960,565,3],
    [2080,625,2],[2100,625,2],
    [2220,545,3],[2240,545,3],
    [2500,545,3],[2530,545,3],
    // Cornisas altas (bonus)
    [460,545,5],[780,505,5],[1390,485,5],
    [2110,425,5],[2790,405,5],
    // Suelo (fáciles)
    [300,820,1],[600,820,1],[900,820,1],[1200,820,1],
    [1500,820,1],[1800,820,1],[2100,820,1],[2400,820,1],[2700,820,1],
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
      x:50, y:0, w:14, h:16, color:'#c8a040', name:'Lechuza Sabia',
      dialogues:[
        'Las migajas del Tejado de los Gansos son las más doradas de la ciudad.',
        'Si dominas el Planeo Silencioso, los gatos jamás te oirán caer.',
        'Al este encontrarás las Alcantarillas... Cuidado con las ratas del alcantarillado.',
        'Dicen que el Cuervo de la Chimenea guarda el doble salto. Derrótalo y será tuyo.',
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
//  CHECKPOINTS (antorchas)
// =============================================
const ZONE_CHECKPOINTS = {
  ciudad_alta: [
    { x: 240, y: 0, id: 'cp_inicio',  lit: true  },
    { x: 1350,y: 0, id: 'cp_medio',   lit: false },
    { x: 2600,y: 0, id: 'cp_final',   lit: false },
  ],
};
