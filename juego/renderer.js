// =============================================
//  PALOMA MIGAJERA v3 — RENDERER
// =============================================

// ---- Paloma (pixel art dibujado con canvas) ----
function drawPlayer(ctx, player, camX, camY) {
  const rx = Math.floor(player.x - camX);
  const ry = Math.floor(player.y - camY);
  const fw = player.facing;

  ctx.save();

  // Parpadeo de invencibilidad
  if (player.invincible && Math.floor(Date.now()/75)%2===0) { ctx.globalAlpha = 0.35; }

  // Brillo de dash
  if (player.dashing) {
    ctx.shadowColor = '#6ab0d8'; ctx.shadowBlur = 18;
  }

  // Sombra suave
  ctx.save();
  ctx.globalAlpha = 0.18;
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.ellipse(rx + player.w/2, ry + player.h + 2, player.w*0.55, 3, 0, 0, Math.PI*2);
  ctx.fill();
  ctx.restore();

  // -- Cola --
  ctx.fillStyle = '#d8d8ee';
  if(fw>0) ctx.fillRect(rx-4, ry+8, 6, 5);
  else     ctx.fillRect(rx+player.w-2, ry+8, 6, 5);

  // -- Cuerpo --
  ctx.fillStyle = '#e8e8f8';
  ctx.fillRect(rx+1, ry+4, player.w-2, player.h-4);

  // -- Cabeza --
  ctx.fillStyle = '#f0f0ff';
  if(fw>0) ctx.fillRect(rx+4, ry, 10, 9);
  else     ctx.fillRect(rx,   ry, 10, 9);

  // -- Pico --
  ctx.fillStyle = '#e8c040';
  if(fw>0) ctx.fillRect(rx+14, ry+3, 4, 3);
  else     ctx.fillRect(rx-4,  ry+3, 4, 3);

  // -- Ojo --
  ctx.fillStyle = '#080810';
  if(fw>0) ctx.fillRect(rx+11, ry+1, 2, 2);
  else     ctx.fillRect(rx+1,  ry+1, 2, 2);

  // -- Alas --
  if(player.gliding) {
    ctx.fillStyle = '#b0b8e0';
    ctx.fillRect(rx-7, ry+3, 9, 7);
    ctx.fillRect(rx+player.w-2, ry+3, 9, 7);
    // Plumas individuales
    ctx.fillStyle = '#c8d0f0';
    ctx.fillRect(rx-9, ry+6, 4, 3);
    ctx.fillRect(rx+player.w+2, ry+6, 4, 3);
  } else if(!player.onGround) {
    const wingY = Math.sin(Date.now()/120)*2;
    ctx.fillStyle = '#c8c8e8';
    ctx.fillRect(rx-4, ry+4+wingY, 6, 5);
    ctx.fillRect(rx+player.w-2, ry+4+wingY, 6, 5);
  } else {
    ctx.fillStyle = '#c0c0e0';
    ctx.fillRect(rx-2, ry+6, 4, 4);
    ctx.fillRect(rx+player.w-2, ry+6, 4, 4);
  }

  // -- Patas --
  ctx.fillStyle = '#e0b030';
  if(player.onGround) {
    // Caminar
    const step = Math.sin(player.walkCycle)*2;
    ctx.fillRect(rx+2,            ry+player.h,   3, 3+step);
    ctx.fillRect(rx+player.w-5,   ry+player.h,   3, 3-step);
  } else {
    ctx.fillRect(rx+2,           ry+player.h,   3, 4);
    ctx.fillRect(rx+player.w-5,  ry+player.h,   3, 4);
  }

  // -- Hitbox de ataque --
  if(player.attacking) {
    ctx.save();
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = '#fff';
    const ax = fw>0 ? rx+player.w+2 : rx-22;
    ctx.fillRect(ax, ry, 20, player.h);
    ctx.restore();
  }

  ctx.restore();
}

// ---- Enemigos ----
function drawEnemy(ctx, e, camX, camY) {
  const rx = Math.floor(e.x - camX);
  const ry = Math.floor(e.y - camY);
  ctx.save();

  if(e.stunTimer > 0) ctx.globalAlpha = 0.7;

  if(e.type === 'gato' || e.type === 'jefe_cuervo' && false) {
    drawCat(ctx, e, rx, ry);
  } else if(e.type === 'rata') {
    drawRat(ctx, e, rx, ry);
  } else if(e.type === 'cuervo') {
    drawCrow(ctx, e, rx, ry);
  } else if(e.type === 'jefe_cuervo') {
    drawBossCrow(ctx, e, rx, ry);
  }

  // Barra HP (si tiene más de 1 de HP máx)
  if(e.maxHp > 1) {
    ctx.globalAlpha = 1;
    const bw = e.w + 8;
    const bx = rx - 4;
    const by = ry - 8;
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(bx, by, bw, 4);
    const pct = e.hp / e.maxHp;
    const hpColor = pct > 0.5 ? '#c03030' : pct > 0.25 ? '#c06020' : '#c0c020';
    ctx.fillStyle = hpColor;
    ctx.fillRect(bx, by, Math.round(bw * pct), 4);
    if(e.isBoss) {
      // Nombre del jefe
      ctx.fillStyle = '#e0d0a0';
      ctx.font = 'bold 9px serif';
      ctx.textAlign = 'center';
      ctx.fillText(e.type.replace('_',' ').toUpperCase(), rx + e.w/2, ry-12);
    }
  }

  ctx.restore();
}

function drawCat(ctx, e, rx, ry) {
  const agro = e.aggroActive;
  ctx.fillStyle = agro ? '#808070' : '#605868';
  ctx.fillRect(rx, ry, e.w, e.h);
  // Cabeza
  ctx.fillRect(rx+(e.dir>0?2:0), ry-8, e.w-4, 8);
  // Orejas
  ctx.fillStyle = agro ? '#a0a090' : '#807888';
  ctx.fillRect(rx+1, ry-13, 4, 5);
  ctx.fillRect(rx+e.w-5, ry-13, 4, 5);
  // Ojos
  ctx.fillStyle = agro ? '#ff3030' : '#ff7070';
  const eo = e.dir>0 ? 2 : 0;
  ctx.fillRect(rx+3+eo, ry-6, 2, 2);
  ctx.fillRect(rx+9+eo, ry-6, 2, 2);
  // Cola
  ctx.fillStyle = '#605868';
  ctx.fillRect(e.dir>0 ? rx-3:rx+e.w, ry+2, 4, 3);
}

function drawRat(ctx, e, rx, ry) {
  ctx.fillStyle = '#3a301e';
  ctx.fillRect(rx, ry, e.w, e.h);
  ctx.fillRect(e.dir>0 ? rx+e.w:rx-6, ry+3, 7, 2); // cola
  ctx.fillStyle = '#ff4040';
  ctx.fillRect(rx+1, ry+1, 2, 2);
  ctx.fillRect(rx+e.w-3, ry+1, 2, 2);
}

function drawCrow(ctx, e, rx, ry) {
  ctx.fillStyle = '#202028';
  ctx.fillRect(rx, ry, e.w, e.h);
  // Cabeza
  ctx.fillRect(rx+(e.dir>0?4:0), ry-10, e.w-6, 10);
  // Pico
  ctx.fillStyle = '#a08020';
  ctx.fillRect(e.dir>0 ? rx+e.w-2:rx-4, ry-7, 6, 3);
  // Ojos brillantes
  ctx.fillStyle = '#8040c0';
  ctx.fillRect(rx+4, ry-7, 3, 3);
  // Alas
  ctx.fillStyle = '#181820';
  ctx.fillRect(rx-4, ry+2, 6, 8);
  ctx.fillRect(rx+e.w-2, ry+2, 6, 8);
}

function drawBossCrow(ctx, e, rx, ry) {
  // Brillo
  ctx.save();
  ctx.shadowColor = '#8040c0'; ctx.shadowBlur = 24;
  ctx.fillStyle = '#101018';
  ctx.fillRect(rx, ry, e.w, e.h);
  // Plumas decorativas
  ctx.fillStyle = '#202028';
  ctx.fillRect(rx-8, ry, 10, e.h);
  ctx.fillRect(rx+e.w-2, ry, 10, e.h);
  // Cabeza grande
  ctx.fillRect(rx+8, ry-20, e.w-16, 22);
  // Corona de plumas
  [0,1,2,3,4].forEach(i => {
    ctx.fillStyle = i%2===0 ? '#303040' : '#1a1828';
    ctx.fillRect(rx+8+i*7, ry-28+Math.sin(i)*4, 5, 12);
  });
  // Ojos
  ctx.fillStyle = '#c040ff';
  ctx.shadowColor = '#c040ff'; ctx.shadowBlur = 10;
  ctx.fillRect(rx+12, ry-14, 5, 5);
  ctx.fillRect(rx+e.w-17, ry-14, 5, 5);
  ctx.restore();
}

// ---- Migajas ----
function drawMigajas(ctx, migajas, camX, camY) {
  const t = performance.now()/1000;
  for(const m of migajas) {
    if(!m.alive) continue;
    const rx = Math.floor(m.x - camX);
    const ry = Math.floor(m.y - camY + Math.sin(t*2.2+m.bob)*2.5);
    if(rx<-20||rx>ctx.canvas.width+20) continue;

    ctx.save();
    ctx.shadowColor = '#e8c840'; ctx.shadowBlur = 10;
    // Valor 5 = dorado grande, valor 2-3 = dorado, valor 1 = tostado
    if(m.value >= 5) {
      ctx.fillStyle = '#ffe060';
      ctx.fillRect(rx-m.r, ry-m.r, m.r*2, m.r*2);
      ctx.fillStyle = '#fff8a0';
      ctx.fillRect(rx-m.r, ry-m.r, m.r, m.r); // brillo esquina
    } else if(m.value >= 2) {
      ctx.fillStyle = '#e8c840';
      ctx.fillRect(rx-m.r*.75, ry-m.r*.75, m.r*1.5, m.r*1.5);
      ctx.fillStyle = '#f8e060';
      ctx.fillRect(rx-m.r*.75, ry-m.r*.75, m.r*.75, m.r*.75);
    } else {
      ctx.fillStyle = '#c09028';
      ctx.fillRect(rx-m.r*.6, ry-m.r*.6, m.r*1.2, m.r*1.2);
    }
    ctx.restore();
  }
}

// ---- Proyectiles ----
function drawProjectiles(ctx, projs, camX, camY) {
  for(const p of projs) {
    const rx = p.x - camX;
    const ry = p.y - camY;
    ctx.save();
    if(p.type === 'palou') {
      ctx.shadowColor = '#6ab0d8'; ctx.shadowBlur = 16;
      // Cola de estela
      const grad = ctx.createLinearGradient(rx, 0, rx+p.w*p.dir, 0);
      grad.addColorStop(0,'rgba(106,176,216,0)');
      grad.addColorStop(1,'#6ab0d8');
      ctx.fillStyle = grad;
      ctx.fillRect(rx, ry, p.w*p.dir, p.h);
      // Punta brillante
      ctx.fillStyle = '#c0e8ff';
      ctx.fillRect(rx+(p.dir>0?p.w-4:-p.w), ry+1, 4, p.h-2);
    } else if(p.type === 'arpegio') {
      // Onda sonora concéntrica
      ctx.globalAlpha = 0.5 - p.age/500;
      ctx.strokeStyle = '#e8c040';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(rx, ry, p.radius, 0, Math.PI*2);
      ctx.stroke();
    }
    ctx.restore();
  }
}

// ---- Partículas ----
function drawParticles(ctx, particles, camX, camY) {
  for(const p of particles) {
    const rx = p.x - camX;
    const ry = p.y - camY;
    const a = p.life / p.maxLife;
    ctx.globalAlpha = a * 0.85;
    ctx.fillStyle = p.color;
    const sz = p.r * a + 0.5;
    if(p.sq) ctx.fillRect(rx-sz/2, ry-sz/2, sz, sz);
    else     { ctx.beginPath(); ctx.arc(rx, ry, sz/2, 0, Math.PI*2); ctx.fill(); }
  }
  ctx.globalAlpha = 1;
}

// ---- NPCs ----
function drawNPCs(ctx, npcs, camX, camY, playerX, playerY) {
  const t = performance.now()/1000;
  for(const n of npcs) {
    const rx = Math.floor(n.x - camX);
    const ry = Math.floor(n.y - camY);
    ctx.save();
    ctx.fillStyle = n.color;
    ctx.fillRect(rx, ry, n.w, n.h);
    ctx.fillRect(rx+1, ry-8, n.w-2, 9);
    // Corona
    ctx.fillStyle = '#f8e060';
    [2,7,12].forEach(cx => ctx.fillRect(rx+cx, ry-14+(cx===7?-3:0), 4, 6+(cx===7?3:0)));
    // Indicador
    const dx = Math.abs(playerX - n.x);
    const dy = Math.abs(playerY - n.y);
    if(dx < 50 && dy < 40) {
      ctx.globalAlpha = 0.6 + Math.sin(t*4)*0.3;
      ctx.fillStyle = '#f8e060';
      ctx.font = 'bold 10px serif';
      ctx.textAlign = 'center';
      ctx.fillText('!', rx+n.w/2, ry-18);
    }
    ctx.restore();
  }
}

// ---- Checkpoints (antorchas) ----
function drawCheckpoints(ctx, checkpoints, camX, camY) {
  if(!checkpoints) return;
  const t = performance.now()/1000;
  for(const cp of checkpoints) {
    const rx = cp.x - camX;
    const ry = cp.y - camY;
    // Poste
    ctx.fillStyle = '#282830';
    ctx.fillRect(rx-3, ry-40, 6, 40);
    // Taza de antorcha
    ctx.fillStyle = '#3a3020';
    ctx.fillRect(rx-6, ry-50, 12, 12);
    if(cp.lit) {
      ctx.save();
      ctx.shadowColor = '#f0a020'; ctx.shadowBlur = 20+Math.sin(t*5)*5;
      ctx.fillStyle = '#f0a020';
      ctx.beginPath(); ctx.arc(rx, ry-50, 5+Math.sin(t*7)*1.5, 0, Math.PI*2); ctx.fill();
      // Llama
      ctx.fillStyle = '#ff6010';
      ctx.beginPath(); ctx.arc(rx, ry-57+Math.sin(t*8)*2, 4, 0, Math.PI*2); ctx.fill();
      ctx.restore();
    } else {
      ctx.fillStyle = '#282820';
      ctx.beginPath(); ctx.arc(rx, ry-50, 4, 0, Math.PI*2); ctx.fill();
    }
  }
}

// ---- Portales de zona ----
function drawPortals(ctx, portals, camX, camY) {
  if(!portals) return;
  const t = performance.now()/1000;
  for(const portal of portals) {
    const rx = portal.x - camX;
    const ry = portal.y - camY;
    if(rx < -60 || rx > ctx.canvas.width + 60) continue;
    ctx.save();
    // Brillo parpadeante
    const a = 0.4 + Math.sin(t*2)*0.2;
    ctx.fillStyle = `rgba(106,176,216,${a*0.15})`;
    ctx.fillRect(rx, 0, portal.w, ctx.canvas.height);
    ctx.strokeStyle = `rgba(106,176,216,${a})`;
    ctx.lineWidth = 2;
    ctx.strokeRect(rx, 0, portal.w, ctx.canvas.height);
    // Label
    ctx.fillStyle = `rgba(200,230,255,${a})`;
    ctx.font = 'bold 10px serif';
    ctx.textAlign = 'center';
    ctx.fillText(portal.label, rx+portal.w/2, ctx.canvas.height/2);
    ctx.restore();
  }
}
