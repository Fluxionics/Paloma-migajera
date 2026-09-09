const GRAVITY        = 0.52;
const JUMP_FORCE     = -11.5;
const SPEED          = 3.8;
const DASH_SPEED     = 10;
const DASH_DUR       = 140;
const ATK_DUR        = 200;
const PALOU_SPEED    = 9;
const PALOU_ENERGY   = 18;
const PALOU_COOLDOWN = 450;
const DASH_COOLDOWN  = 650;
const ATK_COOLDOWN   = 180;

const COYOTE_TIME    = 90;
const JUMP_BUFFER    = 120;
const WALL_SLIDE_SPD = 1.8;
const WALL_JUMP_X    = 7;
const WALL_JUMP_Y    = -10.5;
const WALL_CHECK_DIST = 3;
const COMBO_WINDOW   = 400;
const COMBO_RESET    = 600;

let screenShake = { x: 0, y: 0, intensity: 0, decay: 0.88 };
let damageNumbers = [];

function addScreenShake(intensity) {
  screenShake.intensity = Math.min(screenShake.intensity + intensity, 16);
}

function updateScreenShake() {
  if (screenShake.intensity > 0.3) {
    screenShake.x = (Math.random() - 0.5) * screenShake.intensity * 2;
    screenShake.y = (Math.random() - 0.5) * screenShake.intensity * 2;
    screenShake.intensity *= screenShake.decay;
  } else {
    screenShake.x = 0;
    screenShake.y = 0;
    screenShake.intensity = 0;
  }
}

function spawnDamageNumber(x, y, value, color) {
  damageNumbers.push({
    x, y, value, color: color || '#fff',
    vy: -2.5, life: 800, maxLife: 800,
    scale: 1.3,
  });
}

function updateDamageNumbers(dt) {
  for (let i = damageNumbers.length - 1; i >= 0; i--) {
    const d = damageNumbers[i];
    d.y += d.vy;
    d.vy += 0.04;
    d.life -= dt;
    d.scale = Math.max(0.5, d.scale - dt * 0.001);
    if (d.life <= 0) damageNumbers.splice(i, 1);
  }
}

function drawDamageNumbers(ctx, camX, camY) {
  for (const d of damageNumbers) {
    const a = Math.min(1, d.life / 300);
    const rx = d.x - camX;
    const ry = d.y - camY;
    ctx.save();
    ctx.globalAlpha = a;
    ctx.font = `bold ${Math.round(13 * d.scale)}px Cinzel, serif`;
    ctx.textAlign = 'center';
    ctx.fillStyle = '#000';
    ctx.fillText(d.value, rx + 1, ry + 1);
    ctx.fillStyle = d.color;
    ctx.fillText(d.value, rx, ry);
    ctx.restore();
  }
}

function physicsPlayer(player, colData, dt, input) {
  const { izq, der, saltar, dash, ataque, especial, abajo } = input;
  const { justPressed } = input;

  const touchingWallLeft  = isTouchingWall(player, colData, -1);
  const touchingWallRight = isTouchingWall(player, colData, 1);
  const touchingWall = touchingWallLeft || touchingWallRight;
  const wallDir = touchingWallLeft ? -1 : touchingWallRight ? 1 : 0;

  if (player.onGround) {
    player.coyoteTimer = COYOTE_TIME;
    player.hasDoubleJumped = false;
  } else {
    player.coyoteTimer = Math.max(0, player.coyoteTimer - dt);
  }

  if (justPressed.saltar) {
    player.jumpBufferTimer = JUMP_BUFFER;
  } else {
    player.jumpBufferTimer = Math.max(0, player.jumpBufferTimer - dt);
  }

  if (!player.dashing) {
    if (izq)       { player.vx = -SPEED; player.facing = -1; }
    else if (der)  { player.vx =  SPEED; player.facing =  1; }
    else           { player.vx *= 0.70; }

    if (!player.onGround && touchingWall && player.vy > 0 && (izq || der)) {
      const sliding = (izq && touchingWallLeft) || (der && touchingWallRight);
      if (sliding) {
        player.vy = Math.min(player.vy, WALL_SLIDE_SPD);
        player.wallSliding = true;
        player.jumpsLeft = player.maxJumps;
      }
    } else {
      player.wallSliding = false;
    }
  }

  if (player.jumpBufferTimer > 0) {
    if (player.coyoteTimer > 0 && !player.dashing) {
      player.vy = JUMP_FORCE;
      player.coyoteTimer = 0;
      player.jumpBufferTimer = 0;
      player.jumpsLeft = player.maxJumps - 1;
      return { action: 'jump', double: false };
    }

    else if (player.wallSliding && !player.onGround) {
      player.vy = WALL_JUMP_Y;
      player.vx = -wallDir * WALL_JUMP_X;
      player.facing = -wallDir;
      player.wallSliding = false;
      player.jumpBufferTimer = 0;
      player.jumpsLeft = player.maxJumps - 1;
      addScreenShake(3);
      return { action: 'jump', double: false, wallJump: true };
    }

    else if (player.jumpsLeft > 0 && !player.onGround && !player.wallSliding) {
      player.vy = JUMP_FORCE * 0.92;
      player.jumpsLeft--;
      player.jumpBufferTimer = 0;
      player.hasDoubleJumped = true;
      return { action: 'jump', double: true };
    }
  }

  if (player.habilidades.planeo && saltar && !player.onGround && player.vy > 0) {
    player.vy = Math.min(player.vy, 0.8);
    player.gliding = true;
  } else {
    player.gliding = false;
  }

  if (player.habilidades.picado && abajo && !player.onGround) {
    player.vy = Math.min(player.vy + 2.8, 17);
    player.isPounding = true;
  } else {
    player.isPounding = false;
  }

  if (justPressed.dash && player.habilidades.dash && player.dashCooldown <= 0 && !player.dashing) {
    player.dashing = true;
    player.dashDir = player.facing;
    player.dashTimer = DASH_DUR;
    player.dashCooldown = DASH_COOLDOWN;
    player.invincible = true;
    player.invTimer = DASH_DUR + 40;
    player.afterimages = [];
    return { action: 'dash' };
  }

  if (player.dashing) {
    player.vx = player.dashDir * DASH_SPEED;
    player.vy = 0;
    player.dashTimer -= dt;

    if (!player.afterimages) player.afterimages = [];
    if (Math.random() > 0.3) {
      player.afterimages.push({
        x: player.x, y: player.y,
        alpha: 0.6, facing: player.facing,
      });
    }

    if (player.dashTimer <= 0) {
      player.dashing = false;
      player.vx *= 0.5;
    }
  }

  if (player.afterimages) {
    if (player.afterimages.length > 20) player.afterimages.splice(0, player.afterimages.length - 20);
    for (let i = player.afterimages.length - 1; i >= 0; i--) {
      player.afterimages[i].alpha -= 0.04;
      if (player.afterimages[i].alpha <= 0) player.afterimages.splice(i, 1);
    }
  }

  if (!player.dashing) {
    player.vy += GRAVITY;
    player.vy = Math.min(player.vy, 16);
  }

  if (player.comboTimer > 0) player.comboTimer -= dt;
  if (player.comboTimer <= 0) player.comboCount = 0;

  if (justPressed.ataque && player.atkTimer <= 0) {
    player.attacking = true;
    player.atkTimer = ATK_DUR;
    player.comboCount = (player.comboCount % 3) + 1;
    player.comboTimer = COMBO_WINDOW;
    player.attackFrame = 0;
    return { action: 'attack', combo: player.comboCount };
  }

  if (justPressed.especial && player.energy >= PALOU_ENERGY && player.palouCooldown <= 0) {
    player.energy -= PALOU_ENERGY;
    player.palouCooldown = PALOU_COOLDOWN;
    return { action: 'palou', dir: player.facing };
  }

  return null;
}

function isTouchingWall(player, colData, dir) {
  const checkX = dir > 0 ? player.x + player.w + WALL_CHECK_DIST : player.x - WALL_CHECK_DIST;
  for (let i = 0; i <= 3; i++) {
    const ty = player.y + (i / 3) * player.h;
    if (isSolid(colData, checkX, ty)) return true;
  }
  return false;
}

function resolvePlayerMap(player, colData, mapW, mapH) {
  player.onGround = false;

  player.x += player.vx;
  player.x = Math.max(0, Math.min(player.x, mapW - player.w));
  resolveAxisX(player, colData);

  player.y += player.vy;
  resolveAxisY(player, colData, mapH);

  if (player.onGround) {
    player.jumpsLeft = player.maxJumps;
    player.walkCycle += Math.abs(player.vx) * 0.15;
  }
}

const RESOLVE_GUARD = 60;

function resolveAxisX(player, colData) {
  const steps = 4;
  for (let i = 0; i <= steps; i++) {
    const ty = player.y + (i / steps) * player.h;
    if (player.vx > 0 && isSolid(colData, player.x + player.w, ty)) {
      let g = 0;
      while (isSolid(colData, player.x + player.w, player.y + player.h * 0.5) && g++ < RESOLVE_GUARD) player.x--;
      player.vx = 0;
      return;
    }
    if (player.vx < 0 && isSolid(colData, player.x, ty)) {
      let g = 0;
      while (isSolid(colData, player.x, player.y + player.h * 0.5) && g++ < RESOLVE_GUARD) player.x++;
      player.vx = 0;
      return;
    }
  }
}

function resolveAxisY(player, colData, mapH) {
  const steps = 3;
  if (player.vy >= 0) {
    for (let i = 0; i <= steps; i++) {
      const tx = player.x + (i / steps) * player.w;
      if (isSolid(colData, tx, player.y + player.h)) {
        let g = 0;
        while (isSolid(colData, tx, player.y + player.h) && g++ < RESOLVE_GUARD) player.y--;
        if (player.isPounding) addScreenShake(5);
        player.vy = 0;
        player.onGround = true;
        return;
      }
    }
  }
  if (player.vy < 0) {
    for (let i = 0; i <= steps; i++) {
      const tx = player.x + (i / steps) * player.w;
      if (isSolid(colData, tx, player.y)) {
        let g = 0;
        while (isSolid(colData, tx, player.y) && g++ < RESOLVE_GUARD) player.y++;
        player.vy = 0;
        return;
      }
    }
  }
  if (player.y > mapH + 50) player.y = mapH + 150;
}

function physicsEnemies(enemies, colData, mapW, mapH, dt) {
  for (const e of enemies) {
    if (!e.alive) continue;
    if (e.stunTimer > 0) { e.stunTimer -= dt; continue; }

    if (e.atkCdTimer > 0) e.atkCdTimer -= dt;

    updateEnemyAI(e, dt);

    switch (e.aiState) {
      case 'patrol':
        e.x += e.vx;
        if (e.x <= e.patrolMin) { e.x = e.patrolMin; e.vx = Math.abs(e.vx); e.dir = 1; }
        if (e.x >= e.patrolMax) { e.x = e.patrolMax; e.vx = -Math.abs(e.vx); e.dir = -1; }
        break;
      case 'chase':
        e.x += e.vx;
        break;
      case 'attack':
        if (e.chargeTimer > 0) {
          e.chargeTimer -= dt;
          if (e.chargeTimer <= 0) {
            e.vx = e.dir * e.speed * 2.5;
            e.isCharging = true;
          }
        }
        if (e.isCharging) {
          e.x += e.vx;
        }
        break;
      case 'retreat':
        e.x += e.vx;
        break;
    }

    e.vy = (e.vy || 0) + GRAVITY;
    e.vy = Math.min(e.vy, 14);
    e.y += e.vy;

    const steps = 3;
    for (let i = 0; i <= steps; i++) {
      const tx = e.x + (i / steps) * e.w;
      if (isSolid(colData, tx, e.y + e.h)) {
        let g = 0;
        while (isSolid(colData, tx, e.y + e.h) && g++ < RESOLVE_GUARD) e.y--;
        e.vy = 0;
        e.onGround = true;
        break;
      }
    }

    if (e.y > mapH + 40) {
      e.y = 0;
      e.vy = 0;
    }

    e.animTimer = (e.animTimer || 0) + dt;
  }
}

function updateEnemyAI(e, dt) {
  if (!e.aiState) e.aiState = 'patrol';
  if (!e.aggroRange) e.aggroRange = 180;
  if (!e.atkRange) e.atkRange = 22;
  if (!e.atkCdTimer) e.atkCdTimer = 0;

  const p = window._gamePlayer;
  if (!p || !p.alive) return;

  const dx = p.x - e.x;
  const dy = p.y - e.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const chaseDir = dx > 0 ? 1 : -1;

  e.aggroActive = dist < e.aggroRange;

  switch (e.aiState) {
    case 'patrol':
      if (e.aggroActive) {
        e.aiState = 'chase';
        e.dir = chaseDir;
      }
      break;

    case 'chase':
      e.dir = chaseDir;
      e.vx = chaseDir * e.speed * 1.3;
      if (!e.aggroActive && dist > e.aggroRange * 1.5) {
        e.aiState = 'patrol';
        e.vx = e.dir * e.speed * 0.6;
      }
      if (dist < e.atkRange && e.atkCdTimer <= 0) {
        e.aiState = 'attack';
        e.chargeTimer = e.type === 'cuervo' || e.type === 'jefe_cuervo' ? 400 : 250;
        e.isCharging = false;
        e.attackTelegraph = true;
      }
      break;

    case 'attack':
      e.dir = chaseDir;
      if (e.attackTelegraph) {

        e.vx = 0;
      }
      if (!e.isCharging && e.chargeTimer <= 0) {

        e.aiState = 'chase';
        e.isCharging = false;
        e.attackTelegraph = false;
        e.atkCdTimer = e.atkCooldown || 900;
        e._doAtk = true;
      }
      if (e.isCharging) {

        if (rectsOverlap(e.x, e.y, e.w, e.h, p.x, p.y, p.w, p.h)) {
          e._doAtk = true;
          e.aiState = 'retreat';
          e.retreatTimer = 600;
          e.vx = -chaseDir * e.speed;
        }

        if (e.x <= e.patrolMin + 5 || e.x >= e.patrolMax - 5) {
          e.isCharging = false;
          e.aiState = 'retreat';
          e.retreatTimer = 400;
          e.vx = -chaseDir * e.speed * 0.8;
          addScreenShake(2);
        }
      }
      break;

    case 'retreat':
      e.retreatTimer = (e.retreatTimer || 0) - dt;
      if (e.retreatTimer <= 0) {
        e.aiState = 'chase';
        e.vx = chaseDir * e.speed;
      }
      break;
  }
}

function doMeleeAttack(player, enemies, particles) {
  const combo = player.comboCount || 1;
  const baseDmg = 1;
  const comboBonus = combo >= 3 ? 2 : combo >= 2 ? 1 : 0;
  const dmg = baseDmg + comboBonus;

  const atkW = 24 + combo * 2;
  const atkH = player.h + (combo >= 3 ? 4 : 0);
  const ax = player.facing > 0 ? player.x + player.w + 2 : player.x - atkW - 2;
  const ay = player.y - (combo >= 3 ? 2 : 0);

  spawnHitFx(particles, ax + atkW / 2, ay + atkH / 2, combo >= 3 ? '#ffe060' : '#e8f0ff', 5 + combo * 2);

  if (combo >= 3) addScreenShake(4);
  else addScreenShake(2);

  for (const e of enemies) {
    if (!e.alive) continue;
    if (rectsOverlap(ax, ay, atkW, atkH, e.x, e.y, e.w, e.h)) {
      damageEnemy(e, dmg, player, particles);
      if (window.PM_AUDIO) window.PM_AUDIO.sfx.attackHit();
      if (combo > 1 && window.PM_AUDIO) window.PM_AUDIO.sfx.combo(combo);
    }
  }
}

function damageEnemy(e, dmg, player, particles) {
  e.hp -= dmg;
  e.stunTimer = e.stunDur || 280;
  e.vx = -(e.vx || 0) * 1.5;
  e.vy = -3;
  e.aiState = 'retreat';
  e.retreatTimer = 500;
  spawnHitFx(particles, e.x + e.w / 2, e.y + e.h / 2, '#ff6060', 8);
  spawnDamageNumber(e.x + e.w / 2, e.y - 10, dmg, dmg >= 3 ? '#ffe060' : '#ff6060');
  addScreenShake(dmg >= 3 ? 6 : 3);

  if (e.hp <= 0) killEnemy(e, particles);
}

function killEnemy(e, particles) {
  e.alive = false;
  spawnDeathFx(particles, e.x + e.w / 2, e.y + e.h / 2, e.color || '#606070', 18);
  addScreenShake(5);
  spawnDamageNumber(e.x + e.w / 2, e.y - 20, 'X', '#ffe060');

  if (window.PALOMA_LOGROS) {
    window.PALOMA_LOGROS.incrementarEnemigoDerrotado();
  }
}

function firePalou(player, projectiles) {
  projectiles.push({
    x: player.x + (player.facing > 0 ? player.w + 2 : -16),
    y: player.y + player.h / 2 - 3,
    w: 16, h: 6,
    dir: player.facing,
    vx: player.facing * PALOU_SPEED,
    alive: true, type: 'palou', age: 0,
  });
  addScreenShake(2);
  if (window.PALOMA_LOGROS) {
    window.PALOMA_LOGROS.incrementarPalomaduken();
  }
}

function updateProjectiles(projs, enemies, colData, dt, particles) {
  for (const p of projs) {
    if (!p.alive) continue;
    p.x += p.vx;
    p.age += dt;
    if (p.age > 1400) { p.alive = false; continue; }

    if (isSolid(colData, p.x + (p.dir > 0 ? p.w : 0), p.y + p.h / 2)) {
      p.alive = false;
      spawnHitFx(particles, p.x, p.y, '#6ab0d8', 5);
      continue;
    }

    for (const e of enemies) {
      if (!e.alive) continue;
      if (rectsOverlap(p.x, p.y, p.w, p.h, e.x, e.y, e.w, e.h)) {
        damageEnemy(e, 15, null, particles);
        p.alive = false;
        break;
      }
    }
  }
}

function hurtPlayer(player, dmg, particles) {
  if (player.invincible) return false;
  const realDmg = Math.max(1, Math.round(dmg * player.diff.dmgRecibido));
  player.hp -= realDmg;
  player.invincible = true;
  player.invTimer = 1400;
  player.vy = -5;
  player.vx = -player.facing * 3.5;
  spawnHitFx(particles, player.x + player.w / 2, player.y + player.h / 2, '#ff3030', 10);
  spawnDamageNumber(player.x + player.w / 2, player.y - 12, realDmg, '#ff3030');
  addScreenShake(7);
  return true;
}

function collectMigajas(player, migajas) {
  const collected = [];
  for (const m of migajas) {
    if (!m.alive) continue;
    const dx = (player.x + player.w / 2) - m.x;
    const dy = (player.y + player.h / 2) - m.y;
    if (Math.abs(dx) < 20 && Math.abs(dy) < 20) {
      m.alive = false;
      player.migajas += m.value;
      collected.push(m);
    }
  }
  return collected;
}

function spawnHitFx(particles, x, y, color, n = 6) {
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    particles.push({
      x, y,
      vx: Math.cos(a) * (Math.random() * 4 + 1),
      vy: Math.sin(a) * (Math.random() * 4 + 1),
      life: 300, maxLife: 300, color, r: 2.5, sq: Math.random() > 0.5,
    });
  }
}

function spawnDeathFx(particles, x, y, color, n = 14) {
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2;
    const s = Math.random() * 5 + 1.5;
    particles.push({
      x: x + (Math.random() - 0.5) * 10,
      y: y + (Math.random() - 0.5) * 10,
      vx: Math.cos(a) * s,
      vy: Math.sin(a) * s - 2,
      life: 600, maxLife: 600, color, r: Math.random() * 3.5 + 1, sq: Math.random() > 0.4,
    });
  }

  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    particles.push({
      x, y,
      vx: Math.cos(a) * 3, vy: Math.sin(a) * 3,
      life: 400, maxLife: 400, color: '#ffffff', r: 1.5, sq: true,
    });
  }
}

function spawnJumpFx(particles, x, y, double = false, wallJump = false) {
  const color = wallJump ? '#60d060' : double ? '#6ab0d8' : '#e0e0f0';
  const count = wallJump ? 12 : double ? 10 : 7;
  for (let i = 0; i < count; i++) {
    particles.push({
      x: x + (Math.random() - 0.5) * 12,
      y,
      vx: (Math.random() - 0.5) * 3,
      vy: Math.random() * 3 + 0.5,
      life: 250, maxLife: 250, color, r: 1.8, sq: true,
    });
  }
}

function spawnDashFx(particles, x, y, dir) {
  for (let i = 0; i < 16; i++) {
    particles.push({
      x: x + (Math.random() - 0.5) * 6,
      y: y + (Math.random() - 0.5) * 4,
      vx: -dir * (Math.random() * 5 + 2),
      vy: (Math.random() - 0.5) * 1.5,
      life: 220, maxLife: 220, color: '#6ab0d8', r: 1.5, sq: true,
    });
  }
}

function spawnWallSlideFx(particles, x, y) {
  for (let i = 0; i < 2; i++) {
    particles.push({
      x: x + (Math.random() - 0.5) * 4,
      y: y + Math.random() * 8,
      vx: (Math.random() - 0.5) * 1.5,
      vy: Math.random() * -1,
      life: 180, maxLife: 180, color: '#c8c8e0', r: 1.2, sq: true,
    });
  }
}

function spawnGroundPoundFx(particles, x, y) {
  for (let i = 0; i < 20; i++) {
    const a = Math.random() * Math.PI * 2;
    const s = Math.random() * 4 + 2;
    particles.push({
      x, y,
      vx: Math.cos(a) * s,
      vy: -Math.abs(Math.sin(a)) * s * 0.8 - 1,
      life: 400, maxLife: 400, color: '#e0b030', r: 2, sq: Math.random() > 0.5,
    });
  }
}

function spawnPickupFx(particles, x, y, value) {
  const color = value >= 5 ? '#ffe060' : '#e8c840';
  for (let i = 0; i < value * 2 + 4; i++) {
    const a = Math.random() * Math.PI * 2;
    particles.push({
      x, y,
      vx: Math.cos(a) * (Math.random() * 3 + 0.5),
      vy: Math.sin(a) * (Math.random() * 3 + 0.5) - 2,
      life: 400, maxLife: 400, color, r: 1.8, sq: true,
    });
  }
}

function spawnDustFx(particles, x, y, dir) {
  for (let i = 0; i < 3; i++) {
    particles.push({
      x: x + (Math.random() - 0.5) * 6,
      y: y - Math.random() * 2,
      vx: -dir * (Math.random() * 1.5 + 0.5),
      vy: -(Math.random() * 1.5 + 0.3),
      life: 200, maxLife: 200, color: '#a0a0b0', r: 1, sq: true,
    });
  }
}

function spawnFeatherFx(particles, x, y, dir, n = 3) {
  for (let i = 0; i < n; i++) {
    particles.push({
      x: x - dir * (Math.random() * 6 + 3),
      y: y + (Math.random() - 0.5) * 8,
      vx: -dir * (Math.random() * 1.2 + 0.4) + (Math.random() - 0.5) * 0.6,
      vy: -(Math.random() * 0.8 + 0.3),
      life: 380, maxLife: 380,
      color: Math.random() > 0.6 ? '#e8ecff' : '#bcc4e8',
      r: 1.6 + Math.random() * 0.8, sq: Math.random() > 0.5,
    });
  }
}

function updateParticles(particles, dt) {
  if (particles.length > 900) particles.splice(0, particles.length - 900);
  for (const p of particles) {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.06;
    p.vx *= 0.98;
    p.life -= dt;
  }
  let i = particles.length;
  while (i--) { if (particles[i].life <= 0) particles.splice(i, 1); }
}

function updateCooldowns(player, dt) {
  if (player.dashCooldown  > 0) player.dashCooldown  -= dt;
  if (player.palouCooldown > 0) player.palouCooldown -= dt;
  if (player.atkTimer > 0) {
    player.atkTimer -= dt;
    if (player.attackFrame !== undefined) player.attackFrame += dt;
    if (player.atkTimer <= 0) player.attacking = false;
  }
  if (player.invTimer > 0) { player.invTimer -= dt; if (player.invTimer <= 0) player.invincible = false; }
  player.energy = Math.min(player.energyMax, player.energy + dt * 0.018);
  player.mp = Math.min(player.mpMax, player.mp + dt * 0.012);
}

function rectsOverlap(ax, ay, aw, ah, bx, by, bw, bh) {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}

function checkEnemyAggro(enemies, player) {

}
