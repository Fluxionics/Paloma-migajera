function sprite(name) {
  return window.__SPRITES ? window.__SPRITES.get(name) : (window.SPRITES ? SPRITES[name] : null);
}
function drawSprite(ctx, s, x, y, w, h) {
  if (!s) return;
  ctx.drawImage(s, Math.floor(x), Math.floor(y), w || s.width, h || s.height);
}

function playerState(p) {
  if (p.dashing) return 'dash';
  if (p.attacking) return 'attack';
  if (p.gliding) return 'glide';
  if (p.wallSliding) return 'wallslide';
  if (!p.onGround) return p.vy < 0 ? 'jump' : 'fall';
  if (Math.abs(p.vx) > 2) return 'run';
  if (Math.abs(p.vx) > 0.4) return 'walk';
  return 'idle';
}

function drawPlayer(ctx, player, camX, camY) {
  const rx = Math.floor(player.x - camX);
  const ry = Math.floor(player.y - camY);
  const fw = player.facing;
  const t = performance.now() / 1000;

  ctx.save();

  if (player.invincible && Math.floor(Date.now() / 75) % 2 === 0) { ctx.globalAlpha = 0.3; }

  if (player.dashing) {
    ctx.shadowColor = '#6ab0d8';
    ctx.shadowBlur = 22;
  }

  ctx.save();
  ctx.globalAlpha = 0.18;
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.ellipse(rx + player.w / 2, ry + player.h + 2, player.w * 0.55, 3, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  if (player.afterimages) {
    for (const ghost of player.afterimages) {
      const gx = Math.floor(ghost.x - camX);
      const gy = Math.floor(ghost.y - camY);
      ctx.save();
      ctx.globalAlpha = ghost.alpha * 0.4;
      ctx.fillStyle = '#6ab0d8';
      ctx.fillRect(gx + 1, gy + 4, player.w - 2, player.h - 4);
      ctx.fillRect(gx + 4, gy, 10, 9);
      ctx.restore();
    }
  }

  const st = playerState(player);
  const dir = fw > 0 ? 'r' : 'l';
  let sprName = `pigeon_${st}_${dir}`;

  if (st === 'fly' || st === 'glide') {
    if (Math.floor(t * 12) % 2 === 0) sprName = `pigeon_${st}2_${dir}`;
  }
  const spr = sprite(sprName);

  let gif = null;
  if (st === 'attack') {
    const hg = window.__SPRITES && window.__SPRITES.getImg('haduken.gif');
    if (hg) gif = hg;
  }
  const gifFx = window._gifFx && performance.now() < window._gifFx.until ? window._gifFx : null;
  if (!gif && gifFx) {
    const g2 = window.__SPRITES && window.__SPRITES.getImg(gifFx.name);
    if (g2) gif = g2;
  }
  if (gifFx && performance.now() >= gifFx.until) window._gifFx = null;

  let bodyShown = false;
  if (gif || spr) {
    const isGif = !!gif;
    const gifBig = gif === (window.__SPRITES && window.__SPRITES.getImg('haduken.gif'));
    const sw = isGif ? (gifBig ? 60 : 48) : Math.max(22, player.w + 8);
    const sh = isGif ? (gifBig ? 40 : 48) : Math.max(24, player.h + 12);
    ctx.save();
    if (isGif) {

      const dW = fw > 0 ? sw : -sw;
      const walk = Math.sin(player.walkCycle * 1.6) * 1.5;
      const lift = st === 'jump' ? -2 : st === 'fall' ? 3 : 0;
      drawSprite(ctx, gif,
        rx + player.w / 2 - dW / 2,
        ry + player.h / 2 - sh / 2 + lift,
        dW, sh);
    } else if (st === 'attack') {
      const prog = Math.min(1, (player.attackFrame || 0) / (window.ATK_DUR || 260));
      const tilt = (fw > 0 ? 1 : -1) * -prog * 0.18;
      ctx.translate(rx + player.w / 2, ry + player.h / 2);
      ctx.rotate(tilt);
      ctx.translate(-(rx + player.w / 2), -(ry + player.h / 2));
      const walk = Math.sin(player.walkCycle * 1.6) * 1.5;
      const lift = st === 'jump' ? -2 : st === 'fall' ? 3 : 0;
      drawSprite(ctx, spr,
        rx + player.w / 2 - sw / 2,
        ry + player.h / 2 - sh / 2 + lift,
        sw, sh);
    } else {
      const walk = Math.sin(player.walkCycle * 1.6) * 1.5;
      const lift = st === 'jump' ? -2 : st === 'fall' ? 3 : 0;
      drawSprite(ctx, spr,
        rx + player.w / 2 - sw / 2,
        ry + player.h / 2 - sh / 2 + lift + (st === 'run' || st === 'walk' ? walk * 0.3 : 0),
        sw, sh);
    }
    ctx.restore();
    bodyShown = true;
  }

  if (!bodyShown) {
    ctx.fillStyle = '#e8e8f8';
    ctx.fillRect(rx + 1, ry + 4, player.w - 2, player.h - 4);
    ctx.fillStyle = '#f0f0ff';
    ctx.fillRect(rx + 4, ry - 1, 10, 10);
    ctx.fillStyle = '#e8c040';
    ctx.fillRect(rx + 14, ry + 2, 5, 3);
  }

  if (player.attacking && player.attackFrame !== undefined) {
    const progress = Math.min(1, player.attackFrame / (window.ATK_DUR || 260));
    const combo = player.comboCount || 1;
    ctx.save();
    const arcStart = fw > 0 ? -Math.PI * 0.6 : Math.PI * 0.4;
    const arcEnd = fw > 0 ? Math.PI * 0.6 : Math.PI * 1.6;
    const arcCurrent = arcStart + (arcEnd - arcStart) * progress;
    const slashLen = 22 + combo * 4;
    const sx = rx + player.w / 2;
    const sy = ry + player.h / 2;
    ctx.globalAlpha = (1 - progress) * 0.7;
    ctx.strokeStyle = combo >= 3 ? '#ffe060' : combo >= 2 ? '#c0e0ff' : '#e8f0ff';
    ctx.lineWidth = 2 + combo;
    ctx.beginPath();
    ctx.arc(sx, sy, slashLen, arcStart, arcCurrent);
    ctx.stroke();
    const tipX = sx + Math.cos(arcCurrent) * slashLen;
    const tipY = sy + Math.sin(arcCurrent) * slashLen;
    ctx.fillStyle = ctx.strokeStyle;
    ctx.beginPath();
    ctx.arc(tipX, tipY, 3 + combo, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  ctx.restore();
}

function enemySpriteName(e) {
  if (e.type === 'gato') return e.aggroActive ? 'gato_agro' : 'gato';
  if (e.type === 'gato_grande') return 'gato_grande';
  if (e.type === 'rata') return 'rata';
  if (e.type === 'rata_voladora') return 'rata_voladora';
  if (e.type === 'cuervo') return e.aggroActive ? 'cuervo_agro' : 'cuervo';
  if (e.type === 'jefe_cuervo') return 'jefe_cuervo';
  if (e.type === 'jefe_rata') return 'jefe_rata';
  return 'rata';
}

function drawEnemy(ctx, e, camX, camY) {
  const rx = Math.floor(e.x - camX);
  const ry = Math.floor(e.y - camY);
  const vw = ctx.canvas.width, vh = ctx.canvas.height;
  if (rx + e.w < -40 || rx > vw + 40 || ry + e.h < -40 || ry > vh + 40) return;
  const t = performance.now() / 1000;
  ctx.save();

  if (e.stunTimer > 0) ctx.globalAlpha = 0.6;

  if (e.attackTelegraph && e.chargeTimer > 0) {
    ctx.save();
    ctx.globalAlpha = 0.3 + Math.sin(t * 15) * 0.2;
    ctx.fillStyle = '#ff3030';
    ctx.beginPath();
    ctx.arc(rx + e.w / 2, ry + e.h / 2, e.w * 0.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  const breathe = Math.sin(t * 2 + (e.x * 0.01)) * 0.5;
  let spr = sprite(enemySpriteName(e));

  if (e.type === 'gato' || e.type === 'gato_grande') {
    const gif = window.__SPRITES && window.__SPRITES.getImg('gato.gif');
    if (gif) spr = gif;
  }
  if (spr) {
    const sw = e.w + 10;
    const sh = e.h + 10;
    const fly = (e.type === 'rata_voladora' || e.type === 'cuervo' || e.type === 'jefe_cuervo');
    const bob = fly ? Math.sin(t * 3) * 2.5 : breathe;
    drawSprite(ctx, spr, rx + e.w / 2 - sw / 2, ry + e.h / 2 - sh / 2 + bob, sw, sh);
  } else {
    ctx.fillStyle = '#605868';
    ctx.fillRect(rx, ry, e.w, e.h);
  }

  if (e.maxHp > 1) {
    ctx.globalAlpha = e.stunTimer > 0 ? 0.6 : 1;
    const bw = e.w + 10;
    const bx = rx - 5;
    const by = ry - 10;
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(bx - 1, by - 1, bw + 2, 6);
    const pct = e.hp / e.maxHp;
    const hpColor = pct > 0.5 ? '#c03030' : pct > 0.25 ? '#c06020' : '#e0c020';
    ctx.fillStyle = '#1a0808';
    ctx.fillRect(bx, by, bw, 4);
    ctx.fillStyle = hpColor;
    ctx.fillRect(bx, by, Math.round(bw * pct), 4);
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 0.5;
    ctx.strokeRect(bx, by, bw, 4);

    if (e.isBoss) {
      ctx.fillStyle = '#e0d0a0';
      ctx.font = 'bold 10px Cinzel, serif';
      ctx.textAlign = 'center';
      ctx.fillText(e.type.replace('_', ' ').toUpperCase(), rx + e.w / 2, ry - 14);
    }
  }

  ctx.restore();
}

function drawMigajas(ctx, migajas, camX, camY) {
  const t = performance.now() / 1000;
  const s1 = sprite('migaja');
  const s2 = sprite('migaja2');
  const s5 = sprite('migaja5');
  for (const m of migajas) {
    if (!m.alive) continue;
    const bob = Math.sin(t * 2.2 + m.bob) * 3;
    const rx = Math.floor(m.x - camX);
    const ry = Math.floor(m.y - camY + bob);
    if (rx < -20 || rx > ctx.canvas.width + 20) continue;

    ctx.save();

    ctx.globalAlpha = 0.25;
    ctx.fillStyle = '#e8c840';
    ctx.beginPath();
    ctx.arc(rx, ry, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    const stretchX = Math.abs(Math.cos(t * 2 + m.bob));

    if (m.value >= 5 && s5) {
      drawSprite(ctx, s5, rx - 6 * stretchX, ry - 6, Math.max(2, 12 * stretchX), 12);
      if (Math.sin(t * 8 + m.bob) > 0.7) {
        ctx.fillStyle = '#fff';
        ctx.fillRect(rx - 1, ry - 8, 2, 2);
      }
    } else if (m.value >= 2 && s2) {
      drawSprite(ctx, s2, rx - 5 * stretchX, ry - 5, Math.max(2, 10 * stretchX), 10);
    } else if (s1) {
      drawSprite(ctx, s1, rx - 4 * stretchX, ry - 4, Math.max(2, 8 * stretchX), 8);
    } else {
      ctx.fillStyle = '#c09028';
      ctx.fillRect(rx - 2, ry - 2, 4, 4);
    }
    ctx.restore();
  }
}

function drawProjectiles(ctx, projs, camX, camY) {
  const t = performance.now() / 1000;
  const palou = sprite('palou');
  for (const p of projs) {
    const rx = p.x - camX;
    const ry = p.y - camY;
    ctx.save();
    if (p.type === 'palou') {
      ctx.shadowColor = '#6ab0d8';
      ctx.shadowBlur = 20;
      ctx.globalAlpha = 0.6;
      ctx.fillStyle = '#6ab0d8';
      ctx.fillRect(rx - 24 * p.dir, ry, 24 * p.dir, p.h);
      ctx.globalAlpha = 1;
      const haduken = window.__SPRITES && window.__SPRITES.getImg('haduken.gif');
      if (haduken) {
        ctx.globalAlpha = 0.95;
        drawSprite(ctx, haduken, rx - 24 * p.dir, ry - 4, 48 * p.dir, 31);
        ctx.globalAlpha = 1;
      } else if (palou) drawSprite(ctx, palou, rx - 10 * p.dir, ry - 1, 20 * p.dir, 10);
      else {
        ctx.fillStyle = '#6ab0d8';
        ctx.fillRect(rx, ry, p.w * p.dir, p.h);
        ctx.fillStyle = '#c0e8ff';
        ctx.fillRect(rx + (p.dir > 0 ? p.w - 5 : -p.w), ry + 1, 5, p.h - 2);
      }
    } else if (p.type === 'arpegio') {
      ctx.globalAlpha = Math.max(0, 0.6 - p.age / 600);
      ctx.strokeStyle = '#e8c040';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(rx, ry, p.radius || 20, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha *= 0.5;
      ctx.beginPath();
      ctx.arc(rx, ry, (p.radius || 20) * 0.6, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }
}

function drawParticles(ctx, particles, camX, camY) {
  const vw = ctx.canvas.width, vh = ctx.canvas.height;
  for (const p of particles) {
    const rx = p.x - camX;
    const ry = p.y - camY;
    if (rx < -10 || rx > vw + 10 || ry < -10 || ry > vh + 10) continue;
    const a = p.life / p.maxLife;
    ctx.globalAlpha = a * 0.9;
    ctx.fillStyle = p.color;
    const sz = p.r * (0.3 + a * 0.7) + 0.5;
    if (p.sq) ctx.fillRect(rx - sz / 2, ry - sz / 2, sz, sz);
    else { ctx.beginPath(); ctx.arc(rx, ry, sz / 2, 0, Math.PI * 2); ctx.fill(); }
  }
  ctx.globalAlpha = 1;
}

function drawDamageNumberEntities(ctx, camX, camY) {
  drawDamageNumbers(ctx, camX, camY);
}

function drawNPCs(ctx, npcs, camX, camY, playerX, playerY) {
  const t = performance.now() / 1000;
  const npcSpr = sprite('npc_lechuga');
  for (const n of npcs) {
    const rx = Math.floor(n.x - camX);
    const ry = Math.floor(n.y - camY);
    ctx.save();

    if (npcSpr) {
      drawSprite(ctx, npcSpr, rx + n.w / 2 - 10, ry, 20, 22);
    } else {
      ctx.fillStyle = n.color;
      ctx.fillRect(rx, ry, n.w, n.h);
      ctx.fillStyle = '#d0b050';
      ctx.fillRect(rx + 1, ry - 9, n.w - 2, 10);
      ctx.fillStyle = '#080810';
      ctx.fillRect(rx + 3, ry - 6, 2, 2);
      ctx.fillRect(rx + n.w - 5, ry - 6, 2, 2);
    }

    ctx.globalAlpha = 0.06 + Math.sin(t * 2) * 0.03;
    ctx.fillStyle = '#f8e060';
    ctx.beginPath();
    ctx.arc(rx + n.w / 2, ry + n.h / 2, 25, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    const dx = Math.abs(playerX - n.x);
    const dy = Math.abs(playerY - n.y);
    if (dx < 50 && dy < 44) {
      ctx.globalAlpha = 0.7 + Math.sin(t * 5) * 0.3;
      ctx.fillStyle = '#f8e060';
      ctx.font = 'bold 12px Cinzel, serif';
      ctx.textAlign = 'center';
      ctx.fillText('!', rx + n.w / 2, ry - 14);
      ctx.globalAlpha = 0.4;
      ctx.font = '9px Cinzel, serif';
      ctx.fillText('[Z]', rx + n.w / 2, ry - 24);
    }
    ctx.restore();
  }
}

function drawCheckpoints(ctx, checkpoints, camX, camY) {
  if (!checkpoints) return;
  const t = performance.now() / 1000;
  for (const cp of checkpoints) {
    const rx = cp.x - camX;
    const ry = cp.y - camY;

    const pg = ctx.createLinearGradient(rx - 3, 0, rx + 3, 0);
    pg.addColorStop(0, '#222230');
    pg.addColorStop(0.5, '#333340');
    pg.addColorStop(1, '#1a1a26');
    ctx.fillStyle = pg;
    ctx.fillRect(rx - 3, ry - 44, 6, 44);
    ctx.fillStyle = '#353540';
    ctx.fillRect(rx - 1, ry - 44, 2, 44);

    ctx.fillStyle = '#3a3020';
    ctx.fillRect(rx - 7, ry - 54, 14, 12);
    ctx.fillStyle = '#4a3828';
    ctx.fillRect(rx - 7, ry - 54, 14, 2);

    if (cp.lit) {

      ctx.save();
      ctx.globalAlpha = 0.05 + Math.sin(t * 1.5) * 0.02;
      ctx.fillStyle = '#f0a020';
      ctx.beginPath();
      ctx.arc(rx, ry - 54, 80, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      ctx.save();
      ctx.shadowColor = '#f0a020';
      ctx.shadowBlur = 18;
      ctx.fillStyle = '#f0a020';
      ctx.beginPath();
      ctx.arc(rx, ry - 54, 6 + Math.sin(t * 7) * 1.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffe060';
      ctx.beginPath();
      ctx.arc(rx, ry - 55, 3 + Math.sin(t * 9) * 1, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ff6010';
      const flickerY = Math.sin(t * 8) * 2;
      ctx.beginPath();
      ctx.arc(rx, ry - 60 + flickerY, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      if (Math.random() > 0.85) {
        spawnHitFx(window._gameParticles || [], rx + (Math.random() - 0.5) * 8, ry - 58, '#ff8030', 1);
      }
    } else {
      ctx.fillStyle = '#282820';
      ctx.beginPath();
      ctx.arc(rx, ry - 54, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function drawPortals(ctx, portals, camX, camY) {
  if (!portals) return;
  const t = performance.now() / 1000;
  const vw = ctx.canvas.width, vh = ctx.canvas.height;
  for (const portal of portals) {
    const rx = portal.x - camX;
    if (rx < -80 || rx > vw + 80) continue;
    ctx.save();

    const a = 0.3 + Math.sin(t * 2) * 0.15;
    const pulseA = 0.5 + Math.sin(t * 3) * 0.2;

    const gw = portal.w * 2;
    ctx.fillStyle = `rgba(106,176,216,${a * 0.10})`;
    ctx.fillRect(rx + portal.w / 2 - gw / 2, 0, gw, vh);
    ctx.fillStyle = `rgba(106,176,216,${a * 0.12})`;
    ctx.fillRect(rx, 0, portal.w, vh);

    ctx.strokeStyle = `rgba(106,176,216,${pulseA})`;
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 4]);
    ctx.lineDashOffset = -t * 30;
    ctx.beginPath();
    ctx.moveTo(rx, 0); ctx.lineTo(rx, vh);
    ctx.moveTo(rx + portal.w, 0); ctx.lineTo(rx + portal.w, vh);
    ctx.stroke();
    ctx.setLineDash([]);

    for (let i = 0; i < 3; i++) {
      const py = (t * 40 + i * 300) % vh;
      const px = rx + portal.w / 2 + Math.sin(t * 3 + i) * 8;
      ctx.globalAlpha = 0.6;
      ctx.fillStyle = '#6ab0d8';
      ctx.beginPath();
      ctx.arc(px, py, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = pulseA;
    ctx.fillStyle = '#c0e8ff';
    ctx.font = 'bold 11px Cinzel, serif';
    ctx.textAlign = 'center';
    ctx.fillText(portal.label, rx + portal.w / 2, vh / 2);

    ctx.restore();
  }
}