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
  parque_palomas: [
    { type: 'rata', x: 300, dir: 1, patrolMin: 220, patrolMax: 480 },
    { type: 'gato', x: 650, dir: -1, patrolMin: 520, patrolMax: 780 },
    { type: 'gato', x: 950, dir: 1, patrolMin: 850, patrolMax: 1150 },
    { type: 'cuervo', x: 1200, dir: -1, patrolMin: 1100, patrolMax: 1350 },
    { type: 'rata', x: 1500, dir: 1, patrolMin: 1400, patrolMax: 1650 },
    { type: 'gato_grande', x: 1850, dir: -1, patrolMin: 1750, patrolMax: 2000 },
    { type: 'cuervo', x: 2100, dir: 1, patrolMin: 2000, patrolMax: 2300 },
    { type: 'gato', x: 2450, dir: -1, patrolMin: 2350, patrolMax: 2600 },
    { type: 'rata_voladora', x: 2700, dir: 1, patrolMin: 2600, patrolMax: 2850 },
    { type: 'rata', x: 3000, dir: -1, patrolMin: 2900, patrolMax: 3120 },
  ],
  torre_reloj: [
    { type: 'rata', x: 300, dir: 1, patrolMin: 180, patrolMax: 400 },
    { type: 'rata_voladora', x: 520, dir: -1, patrolMin: 420, patrolMax: 650 },
    { type: 'cuervo', x: 800, dir: 1, patrolMin: 700, patrolMax: 980 },
    { type: 'gato_grande', x: 1100, dir: -1, patrolMin: 1000, patrolMax: 1250 },
    { type: 'rata', x: 1350, dir: 1, patrolMin: 1250, patrolMax: 1520 },
    { type: 'rata_voladora', x: 1650, dir: -1, patrolMin: 1550, patrolMax: 1800 },
    { type: 'cuervo', x: 1950, dir: 1, patrolMin: 1850, patrolMax: 2100 },
    { type: 'gato', x: 2250, dir: -1, patrolMin: 2150, patrolMax: 2420 },
    { type: 'rata_voladora', x: 2500, dir: 1, patrolMin: 2400, patrolMax: 2680 },
    { type: 'gato_grande', x: 2800, dir: -1, patrolMin: 2700, patrolMax: 2980 },
    { type: 'cuervo', x: 3050, dir: 1, patrolMin: 2980, patrolMax: 3140 },
  ],
  bosque_encantado: [
    { type: 'rata', x: 260, dir: 1, patrolMin: 150, patrolMax: 480 },
    { type: 'rata_voladora', x: 550, dir: 1, patrolMin: 500, patrolMax: 720 },
    { type: 'gato', x: 850, dir: -1, patrolMin: 780, patrolMax: 1040 },
    { type: 'cuervo', x: 1180, dir: 1, patrolMin: 1120, patrolMax: 1380 },
    { type: 'gato', x: 1500, dir: -1, patrolMin: 1450, patrolMax: 1630 },
    { type: 'rata', x: 1760, dir: 1, patrolMin: 1700, patrolMax: 1940 },
    { type: 'gato_grande', x: 2060, dir: -1, patrolMin: 2020, patrolMax: 2220 },
    { type: 'rata_voladora', x: 2330, dir: 1, patrolMin: 2300, patrolMax: 2440 },
    { type: 'cuervo', x: 2600, dir: -1, patrolMin: 2560, patrolMax: 2760 },
    { type: 'gato', x: 2900, dir: 1, patrolMin: 2860, patrolMax: 3010 },
    { type: 'cuervo', x: 3080, dir: -1, patrolMin: 3050, patrolMax: 3150 },
  ],
  tejado_gansos: [
    { type: 'cuervo', x: 360, dir: 1, patrolMin: 320, patrolMax: 470 },
    { type: 'rata', x: 600, dir: -1, patrolMin: 570, patrolMax: 730 },
    { type: 'gato', x: 900, dir: 1, patrolMin: 840, patrolMax: 980 },
    { type: 'rata_voladora', x: 1100, dir: -1, patrolMin: 1060, patrolMax: 1210 },
    { type: 'gato_grande', x: 1360, dir: 1, patrolMin: 1310, patrolMax: 1440 },
    { type: 'cuervo', x: 1560, dir: -1, patrolMin: 1520, patrolMax: 1690 },
    { type: 'rata', x: 1800, dir: 1, patrolMin: 1730, patrolMax: 1880 },
    { type: 'gato', x: 2010, dir: -1, patrolMin: 1960, patrolMax: 2110 },
    { type: 'cuervo', x: 2250, dir: 1, patrolMin: 2200, patrolMax: 2370 },
    { type: 'rata_voladora', x: 2500, dir: -1, patrolMin: 2450, patrolMax: 2580 },
    { type: 'gato_grande', x: 2760, dir: 1, patrolMin: 2680, patrolMax: 2860 },
    { type: 'cuervo', x: 2980, dir: -1, patrolMin: 2930, patrolMax: 3080 },
    { type: 'gato', x: 3120, dir: 1, patrolMin: 3080, patrolMax: 3160 },
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
  parque_palomas: [
    [70, 742, 1], [90, 742, 1], [110, 742, 1],
    [300, 686, 1], [320, 686, 1],
    [455, 745, 2], [475, 745, 2],
    [640, 646, 1], [660, 646, 1], [680, 646, 2],
    [800, 696, 1], [820, 696, 1],
    [940, 616, 2], [960, 616, 2],
    [1090, 544, 3], [1110, 544, 3],
    [1260, 606, 2], [1280, 606, 2],
    [1410, 686, 1], [1430, 686, 1], [1460, 686, 1],
    [1615, 626, 2], [1635, 626, 2],
    [1745, 546, 3],
    [1885, 606, 2], [1910, 606, 2],
    [2065, 526, 3],
    [2210, 586, 2], [2230, 586, 2],
    [2395, 506, 3],
    [2550, 566, 2], [2570, 566, 2],
    [2710, 626, 1], [2730, 626, 1],
    [2910, 586, 2], [2930, 586, 2],
    [3050, 646, 1],
    [790, 486, 5], [1330, 456, 5], [2130, 426, 5], [2730, 426, 5],
    [300, 820, 1], [700, 820, 1], [1150, 820, 1], [1600, 820, 1],
    [2050, 820, 1], [2500, 820, 1], [2950, 820, 1],
  ],
  torre_reloj: [
    [110, 766, 1], [130, 766, 1], [160, 766, 1],
    [340, 666, 1], [360, 666, 1],
    [530, 586, 2], [550, 586, 2],
    [770, 746, 2], [790, 746, 2],
    [950, 626, 1], [970, 626, 1],
    [1150, 686, 2], [1170, 686, 2], [1190, 686, 2],
    [1330, 546, 1], [1350, 546, 1],
    [1520, 626, 2], [1540, 626, 2],
    [1690, 506, 3],
    [1870, 586, 1], [1890, 586, 1], [1910, 586, 1],
    [2050, 466, 3],
    [2230, 566, 2], [2240, 566, 2],
    [2390, 466, 3],
    [2570, 546, 2], [2590, 546, 2],
    [2750, 446, 3],
    [2930, 546, 1], [2950, 546, 1],
    [3090, 606, 1],
    [180, 466, 5], [910, 436, 5], [1890, 366, 5], [2730, 346, 5],
  ],
  bosque_encantado: [
    [170, 686, 1], [190, 686, 1], [210, 686, 1],
    [530, 628, 1], [550, 628, 1],
    [710, 480, 2], [725, 480, 2],
    [850, 686, 2], [870, 686, 2],
    [1100, 540, 2], [1140, 540, 2], [1180, 540, 1],
    [1210, 420, 3], [1240, 420, 3],
    [1480, 610, 2], [1500, 610, 2],
    [1750, 686, 1], [1770, 686, 1],
    [2010, 440, 3], [2030, 440, 3],
    [2060, 610, 2], [2080, 610, 2],
    [2340, 686, 1], [2360, 686, 1],
    [2590, 628, 2], [2610, 628, 2],
    [2900, 686, 2], [2920, 686, 2],
    [2990, 500, 3], [3010, 500, 3],
    [3080, 628, 5],
    [350, 820, 1], [700, 820, 1], [1050, 820, 1], [1400, 820, 1],
    [1750, 820, 1], [2100, 820, 1], [2450, 820, 1], [2800, 820, 1], [3120, 820, 1],
    [620, 460, 5], [1350, 400, 5], [2050, 420, 5],
  ],
  tejado_gansos: [
    [150, 768, 1],
    [360, 708, 1], [380, 708, 1], [400, 708, 1],
    [610, 636, 1], [630, 636, 1], [650, 636, 1],
    [880, 708, 2], [900, 708, 2],
    [1100, 636, 2], [1120, 636, 2],
    [1350, 688, 2], [1370, 688, 2],
    [1560, 580, 3], [1580, 580, 3],
    [1770, 688, 1], [1790, 688, 1],
    [2000, 620, 2], [2020, 620, 2],
    [2240, 560, 3], [2260, 560, 3],
    [2490, 668, 2], [2510, 668, 2],
    [2720, 600, 3], [2740, 600, 3],
    [2950, 688, 2], [2970, 688, 2],
    [3100, 620, 5], [3130, 620, 5],
    [1620, 520, 5], [2280, 500, 5],
    [300, 820, 1], [600, 820, 1], [900, 820, 1], [1200, 820, 1],
    [1500, 820, 1], [1800, 820, 1], [2100, 820, 1], [2400, 820, 1],
    [2700, 820, 1], [3000, 820, 1],
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
  parque_palomas: [
    {
      x: 180, y: 0, w: 14, h: 18, color: '#c8a040', name: 'Ganso del Estanque',
      dialogues: [
        'Bienvenido al Parque de las Palomas. Aquí los gatos son menos, pero más astutos.',
        'La fuente tiene migajas antiguas... he visto palomas robar pan de aquí toda la vida.',
        'Al este se alza la Torre del Reloj. El Relojero mide cada segundo, y cada trampa.',
        'Dicen que los que trepan hasta el campanario son tocados por el reloj y aprenden a planear.',
        'Si el cielo se vuelve frío y las estrellas tiemblan... es que la luna te está observando.',
      ],
      dIdx: 0,
    },
  ],
  torre_reloj: [
    {
      x: 120, y: 0, w: 14, h: 18, color: '#c07040', name: 'Relojero Loco',
      dialogues: [
        '¡Tic-tac! ¿Traes llaves? No. Las llaves no sirven aquí. ¡El tiempo no tiene cerradura!',
        'Mis engranajes guardan secretos. Sube, sube, ¡pero no tropieces con las cadenas!',
        'La gran esfera marca las doce y media... para siempre. El reloj también puede caer.',
        'Las ratas voladoras adoran el polvo de aquí. Huelen las migajas antes de verlas.',
        'Cuida tus alas: aquí arriba el aire sabe a latón y a madera vieja.',
      ],
      dIdx: 0,
    },
  ],
  bosque_encantado: [
    {
      x: 180, y: 0, w: 14, h: 18, color: '#e0a040', name: 'Lumen el Zorro Fuego',
      dialogues: [
        'Shhh... escucha. El bosque respira aquí más profundo que en el parque.',
        'Los hongos resplandecen porque guardan memoria. Cuánta migaja cae, ellos lo saben.',
        'No toques la luna blanca de arriba... o quizá sí, sí puedes. Es solo luz.',
        'Más al este está el Tejado de los Gansos. Lo que allí brilla no es oro, pero sabe a oro.',
        'Las ratas voladoras aquí son más viejas. Vuelan en círculos, como si conocieran tu nombre.',
      ],
      dIdx: 0,
    },
  ],
  tejado_gansos: [
    {
      x: 160, y: 0, w: 14, h: 18, color: '#c8e0c8', name: 'Ganso Capitán',
      dialogues: [
        '¡Ganso capitán! Bienvenido al último tejado. Aquí vive la leyenda de las migajas doradas.',
        'Los gatos grandes guardan la antena. Ampárate en los tendederos, no los esquives.',
        'Ventisca de plumas: cuando veas rojo en el horizonte, es la ciudad despertándose.',
        'Las migajas de valor cinco están escondidas en el aire. Salta dos veces y confía en tus alas.',
        'Has recorrido cada teja de esta ciudad. El cielo te pertenece, pequeña paloma.',
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
    { x: -1, y: 0, w: 40, h: 900, toZone: 'parque_palomas', label: '← Parque de las Palomas' },
  ],
  alcantarillas: [
    { x: 0, y: 0, w: 40, h: 900, toZone: 'ciudad_alta', label: '← Ciudad Alta' },
    { x: 3150, y: 0, w: 40, h: 900, toZone: 'parque_palomas', label: 'Parque de las Palomas →' },
  ],
  parque_palomas: [
    { x: 0, y: 0, w: 40, h: 900, toZone: 'ciudad_alta', label: '← Ciudad Alta' },
    { x: 3150, y: 0, w: 40, h: 900, toZone: 'torre_reloj', label: 'Torre del Reloj →' },
    { x: 2370, y: 480, w: 90, h: 40, toZone: 'bosque_encantado', label: 'Bosque Encantado ↑' },
  ],
  torre_reloj: [
    { x: 0, y: 0, w: 40, h: 900, toZone: 'parque_palomas', label: '← Parque de las Palomas' },
    { x: 3150, y: 0, w: 40, h: 900, toZone: 'alcantarillas', label: 'Alcantarillas →' },
  ],
  bosque_encantado: [
    { x: 0, y: 0, w: 40, h: 900, toZone: 'parque_palomas', label: '← Parque de las Palomas' },
    { x: 3150, y: 0, w: 40, h: 900, toZone: 'tejado_gansos', label: 'Tejado de los Gansos →' },
  ],
  tejado_gansos: [
    { x: 0, y: 0, w: 40, h: 900, toZone: 'bosque_encantado', label: '← Bosque Encantado' },
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
  parque_palomas: [
    { x: 260, y: 0, id: 'cp_parque_1', lit: true },
    { x: 950, y: 0, id: 'cp_parque_2', lit: false },
    { x: 1700, y: 0, id: 'cp_parque_3', lit: false },
    { x: 2450, y: 0, id: 'cp_parque_4', lit: false },
  ],
  torre_reloj: [
    { x: 260, y: 0, id: 'cp_torre_1', lit: true },
    { x: 900, y: 0, id: 'cp_torre_2', lit: false },
    { x: 1600, y: 0, id: 'cp_torre_3', lit: false },
    { x: 2400, y: 0, id: 'cp_torre_4', lit: false },
  ],
  bosque_encantado: [
    { x: 240, y: 0, id: 'cp_bosque_1', lit: true },
    { x: 950, y: 0, id: 'cp_bosque_2', lit: false },
    { x: 1700, y: 0, id: 'cp_bosque_3', lit: false },
    { x: 2400, y: 0, id: 'cp_bosque_4', lit: false },
  ],
  tejado_gansos: [
    { x: 240, y: 0, id: 'cp_tejado_1', lit: true },
    { x: 1000, y: 0, id: 'cp_tejado_2', lit: false },
    { x: 1750, y: 0, id: 'cp_tejado_3', lit: false },
    { x: 2500, y: 0, id: 'cp_tejado_4', lit: false },
  ],
};
