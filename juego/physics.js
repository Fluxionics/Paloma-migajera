// =============================================
//  PALOMA MIGAJERA v3 — PHYSICS & COMBAT
// =============================================

const GRAVITY      = 0.52;
const JUMP_FORCE   = -11;
const SPEED        = 3.6;
const DASH_SPEED   = 9.5;
const DASH_DUR     = 130;
const ATK_DUR      = 240;
const PALOU_SPEED  = 8;
const PALOU_ENERGY = 20;
const PALOU_COOLDOWN = 500;
const DASH_COOLDOWN  = 750;
const ATK_COOLDOWN   = 220;

// =============================================
//  FÍSICA DEL JUGADOR
// =============================================
function physicsPlayer(player, colData, dt, input) {
  const { izq, der, saltar, dash, ataque, especial, abajo } = input;
  const { justPressed } = input;

  // ---- Horizontal ----
  if(!player.dashing) {
    if(izq)       { player.vx = -SPEED; player.facing = -1; }
    else if(der)  { player.vx =  SPEED; player.facing =  1; }
    else          { player.vx *= 0.72; }
  }

  // ---- Salto ----
  if(justPressed.saltar && player.jumpsLeft > 0) {
    player.vy = JUMP_FORCE;
    player.jumpsLeft--;
    return { action: 'jump', double: player.jumpsLeft === 0 };
  }

  // ---- Planeo ----
  if(player.habilidades.planeo && saltar && !player.onGround && player.vy > 0) {
    player.vy = Math.min(player.vy, 1.0);
    player.gliding = true;
  } else {
    player.gliding = false;
  }

  // ---- Picado ----
  if(player.habilidades.picado && abajo && !player.onGround) {
    player.vy = Math.min(player.vy + 2.5, 16);
  }

  // ---- Dash ----
  if(justPressed.dash && player.habilidades.dash && player.dashCooldown <= 0) {
    player.dashing = true;
    player.dashDir = player.facing;
    player.dashTimer = DASH_DUR;
    player.dashCooldown = DASH_COOLDOWN;
    player.invincible = true;
    player.invTimer = DASH_DUR + 60;
    return { action: 'dash' };
  }

  if(player.dashing) {
    player.vx = player.dashDir * DASH_SPEED;
    player.vy = 0;
    player.dashTimer -= dt;
    if(player.dashTimer <= 0) { player.dashing = false; }
  }

  // ---- Gravedad ----
  if(!player.dashing) {
    player.vy += GRAVITY;
    player.vy = Math.min(player.vy, 15);
  }

  // ---- Ataque cuerpo a cuerpo ----
  if(justPressed.ataque && player.atkTimer <= 0) {
    player.attacking = true;
    player.atkTimer = ATK_DUR;
    return { action: 'attack' };
  }

  // ---- PALOMADUKEN ----
  if(justPressed.especial && player.energy >= PALOU_ENERGY && player.palouCooldown <= 0) {
    player.energy -= PALOU_ENERGY;
    player.palouCooldown = PALOU_COOLDOWN;
    return { action: 'palou', dir: player.facing };
  }

  return null;
}

// =============================================
//  COLISIÓN PÍXEL-PERFECTA CON EL MAPA
// =============================================
function resolvePlayerMap(player, colData, mapW, mapH) {
  player.onGround = false;

  // Mover en X primero
  player.x += player.vx;
  player.x = Math.max(0, Math.min(player.x, mapW - player.w));
  resolveAxisX(player, colData);

  // Luego en Y
  player.y += player.vy;
  resolveAxisY(player, colData, mapH);

  if(player.onGround) {
    player.jumpsLeft = player.maxJumps;
    player.walkCycle += Math.abs(player.vx) * 0.15;
  }
}

function resolveAxisX(player, colData) {
  // Comprueba puntos de la hitbox lateral
  const steps = 4;
  for(let i=0; i<=steps; i++) {
    const ty = player.y + (i/steps) * player.h;
    // Lado derecho
    if(player.vx > 0 && isSolid(colData, player.x+player.w, ty)) {
      while(isSolid(colData, player.x+player.w, player.y+player.h*0.5)) {
        player.x--;
      }
      player.vx = 0;
      break;
    }
    // Lado izquierdo
    if(player.vx < 0 && isSolid(colData, player.x, ty)) {
      while(isSolid(colData, player.x, player.y+player.h*0.5)) {
        player.x++;
      }
      player.vx = 0;
      break;
    }
  }
}

function resolveAxisY(player, colData, mapH) {
  const steps = 3;
  // Pies (caer)
  if(player.vy >= 0) {
    for(let i=0; i<=steps; i++) {
      const tx = player.x + (i/steps) * player.w;
      if(isSolid(colData, tx, player.y+player.h)) {
        // Ajustar a la superficie
        while(isSolid(colData, tx, player.y+player.h)) {
          player.y--;
        }
        player.vy = 0;
        player.onGround = true;
        break;
      }
    }
  }
  // Cabeza (saltar)
  if(player.vy < 0) {
    for(let i=0; i<=steps; i++) {
      const tx = player.x + (i/steps) * player.w;
      if(isSolid(colData, tx, player.y)) {
        while(isSolid(colData, tx, player.y)) {
          player.y++;
        }
        player.vy = 0;
        break;
      }
    }
  }
  // Límite inferior: muerte por caída
  if(player.y > mapH + 50) player.y = mapH + 200;
}

// =============================================
//  FÍSICA DE ENEMIGOS (simple AABB + suelo)
// =============================================
function physicsEnemies(enemies, colData, mapW, mapH, dt) {
  for(const e of enemies) {
    if(!e.alive) continue;
    if(e.stunTimer > 0) { e.stunTimer -= dt; continue; }

    // Patrulla
    e.x += e.vx;
    if(e.x <= e.patrolMin) { e.x = e.patrolMin; e.vx = Math.abs(e.vx); e.dir = 1; }
    if(e.x >= e.patrolMax) { e.x = e.patrolMax; e.vx = -Math.abs(e.vx); e.dir = -1; }

    // Gravedad simple
    e.vy = (e.vy || 0) + GRAVITY;
    e.vy = Math.min(e.vy, 14);
    e.y += e.vy;

    // Colisión suelo
    const steps = 3;
    let grounded = false;
    for(let i=0; i<=steps; i++) {
      const tx = e.x + (i/steps)*e.w;
      if(isSolid(colData, tx, e.y+e.h)) {
        while(isSolid(colData, tx, e.y+e.h)) e.y--;
        e.vy = 0; grounded = true; break;
      }
    }
    if(e.y > mapH) { e.y = 0; }
  }
}

// =============================================
//  COMBATE
// =============================================
function doMeleeAttack(player, enemies, particles) {
  const atkW = 22, atkH = player.h;
  const ax = player.facing > 0 ? player.x+player.w+2 : player.x-atkW-2;
  const ay = player.y;

  spawnHitFx(particles, ax+atkW/2, ay+atkH/2, '#e8f0ff', 5);

  for(const e of enemies) {
    if(!e.alive) continue;
    if(rectsOverlap(ax,ay,atkW,atkH, e.x,e.y,e.w,e.h)) {
      damageEnemy(e, 1, player, particles);
    }
  }
}

function damageEnemy(e, dmg, player, particles) {
  e.hp -= dmg;
  e.stunTimer = e.stunDur || 280;
  e.vx = -(e.vx); // rebote
  spawnHitFx(particles, e.x+e.w/2, e.y+e.h/2, '#ff6060', 6);

  if(e.hp <= 0) killEnemy(e, particles);
}

function killEnemy(e, particles) {
  e.alive = false;
  spawnDeathFx(particles, e.x+e.w/2, e.y+e.h/2, e.color || '#606070', 14);
}

function firePalou(player, projectiles) {
  projectiles.push({
    x: player.x + (player.facing>0 ? player.w+2 : -14),
    y: player.y + player.h/2 - 3,
    w: 14, h: 6,
    dir: player.facing,
    vx: player.facing * PALOU_SPEED,
    alive: true, type:'palou', age:0,
  });
}

function updateProjectiles(projs, enemies, colData, dt, particles) {
  for(const p of projs) {
    if(!p.alive) continue;
    p.x += p.vx;
    p.age += dt;
    if(p.age > 1400) { p.alive = false; continue; }

    // Colisión con mapa
    if(isSolid(colData, p.x+(p.dir>0?p.w:0), p.y+p.h/2)) {
      p.alive = false;
      spawnHitFx(particles, p.x, p.y, '#6ab0d8', 5);
      continue;
    }

    // Colisión con enemigos
    for(const e of enemies) {
      if(!e.alive) continue;
      if(rectsOverlap(p.x,p.y,p.w,p.h, e.x,e.y,e.w,e.h)) {
        damageEnemy(e, 15, null, particles);
        p.alive = false;
        break;
      }
    }
  }
}

function hurtPlayer(player, dmg, particles) {
  if(player.invincible) return false;
  const realDmg = Math.max(1, Math.round(dmg * player.diff.dmgRecibido));
  player.hp -= realDmg;
  player.invincible = true;
  player.invTimer = 1400;
  player.vy = -5;
  player.vx = -player.facing * 3.5;
  spawnHitFx(particles, player.x+player.w/2, player.y+player.h/2, '#ff3030', 8);
  return true;
}

// =============================================
//  RECOLECCIÓN DE MIGAJAS
// =============================================
function collectMigajas(player, migajas) {
  const collected = [];
  for(const m of migajas) {
    if(!m.alive) continue;
    const dx = (player.x+player.w/2) - m.x;
    const dy = (player.y+player.h/2) - m.y;
    if(Math.abs(dx) < 18 && Math.abs(dy) < 18) {
      m.alive = false;
      player.migajas += m.value;
      collected.push(m);
    }
  }
  return collected;
}

// =============================================
//  PARTÍCULAS
// =============================================
function spawnHitFx(particles, x, y, color, n=6) {
  for(let i=0; i<n; i++) {
    const a = (i/n)*Math.PI*2;
    particles.push({
      x, y,
      vx: Math.cos(a)*(Math.random()*3+1),
      vy: Math.sin(a)*(Math.random()*3+1),
      life:280, maxLife:280, color, r:2.5, sq:Math.random()>0.5,
    });
  }
}

function spawnDeathFx(particles, x, y, color, n=12) {
  for(let i=0; i<n; i++) {
    const a = Math.random()*Math.PI*2;
    const s = Math.random()*4+1;
    particles.push({
      x: x + (Math.random()-0.5)*8,
      y: y + (Math.random()-0.5)*8,
      vx: Math.cos(a)*s,
      vy: Math.sin(a)*s - 1,
      life:500, maxLife:500, color, r:Math.random()*3+1, sq:Math.random()>0.4,
    });
  }
}

function spawnJumpFx(particles, x, y, double=false) {
  const color = double ? '#6ab0d8' : '#e0e0f0';
  for(let i=0; i<(double?10:6); i++) {
    particles.push({
      x: x + (Math.random()-0.5)*10,
      y,
      vx:(Math.random()-0.5)*2.5,
      vy: Math.random()*2.5+0.5,
      life:220, maxLife:220, color, r:1.8, sq:true,
    });
  }
}

function spawnDashFx(particles, x, y, dir) {
  for(let i=0; i<14; i++) {
    particles.push({
      x: x + (Math.random()-0.5)*6,
      y: y + (Math.random()-0.5)*4,
      vx: -dir*(Math.random()*4+2),
      vy: (Math.random()-0.5)*1.5,
      life:200, maxLife:200, color:'#6ab0d8', r:1.5, sq:true,
    });
  }
}

function spawnPickupFx(particles, x, y, value) {
  const color = value >= 5 ? '#ffe060' : '#e8c840';
  for(let i=0; i<value*2+3; i++) {
    const a = Math.random()*Math.PI*2;
    particles.push({
      x, y,
      vx:Math.cos(a)*(Math.random()*2+0.5),
      vy:Math.sin(a)*(Math.random()*2+0.5)-1.5,
      life:350, maxLife:350, color, r:1.5, sq:true,
    });
  }
}

function updateParticles(particles, dt) {
  for(const p of particles) {
    p.x += p.vx; p.y += p.vy;
    p.vy += 0.06;
    p.life -= dt;
  }
  // Limpiar muertos
  let i = particles.length;
  while(i--) { if(particles[i].life <= 0) particles.splice(i,1); }
}

// =============================================
//  COOLDOWNS
// =============================================
function updateCooldowns(player, dt) {
  if(player.dashCooldown  > 0) player.dashCooldown  -= dt;
  if(player.palouCooldown > 0) player.palouCooldown -= dt;
  if(player.atkTimer      > 0) { player.atkTimer -= dt; if(player.atkTimer<=0) player.attacking=false; }
  if(player.invTimer      > 0) { player.invTimer -= dt; if(player.invTimer<=0) player.invincible=false; }
  // Regen energía lenta
  if(player.energy < player.energyMax) player.energy = Math.min(player.energyMax, player.energy + dt*0.015);
  // Regen MP lenta
  if(player.mp < player.mpMax) player.mp = Math.min(player.mpMax, player.mp + dt*0.01);
}

// =============================================
//  UTILIDAD
// =============================================
function rectsOverlap(ax,ay,aw,ah, bx,by,bw,bh) {
  return ax<bx+bw && ax+aw>bx && ay<by+bh && ay+ah>by;
}

function checkEnemyAggro(enemies, player) {
  for(const e of enemies) {
    if(!e.alive) continue;
    const dx = player.x - e.x;
    const dy = player.y - e.y;
    const dist = Math.sqrt(dx*dx+dy*dy);
    e.aggroActive = dist < e.aggroRange;
    if(e.aggroActive) {
      // Perseguir
      const chaseDir = dx > 0 ? 1 : -1;
      e.vx = chaseDir * e.speed;
      e.dir = chaseDir;
    }
    // Atacar
    e.atkTimer = (e.atkTimer||0);
    if(dist < e.atkRange) {
      e.atkTimer += 16;
      if(e.atkTimer >= e.atkCooldown) {
        e.atkTimer = 0;
        e._doAtk = true;
      }
    } else {
      e.atkTimer = Math.max(0, e.atkTimer - 16);
      e._doAtk = false;
    }
  }
}
