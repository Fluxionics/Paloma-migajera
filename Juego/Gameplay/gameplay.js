// GAMEPLAY COMPLETO INTEGRADO CON SISTEMA DE USUARIOS
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const cCanvas = document.getElementById('collisionCanvas');
const cCtx = cCanvas.getContext('2d');

// VERIFICAR USUARIO
if (!window.PALOMA_USUARIOS || !window.PALOMA_USUARIOS.usuarioActual) {
    alert('No hay sesión activa. Redirigiendo...');
    window.location.href = '../../seleccion-usuario.html';
}

const usuario = window.PALOMA_USUARIOS.usuarioActual;
const mundoActual = parseInt(localStorage.getItem('paloma_mundo_actual')) || 1;
const config = usuario.configuracionDificultad;

// ESTADO DEL JUEGO
const gameState = {
    pausado: false,
    cargando: true,
    mostrandoMapa: false,
    muerto: false,
    tiempoInicio: Date.now(),
    tiempoUltimoGuardado: Date.now()
};

// JUGADOR
const p = {
    x: usuario.checkpoint.x || 150,
    y: usuario.checkpoint.y || 50,
    w: 90, h: 90,
    vx: 0, vy: 0,
    dir: 1,
    movido: false,
    mirando: false,
    sprite: null,
    enSuelo: false,
    saltosRestantes: 1,
    velocidadMax: 6,
    fuerzaSalto: -16,
    gravedad: 0.8
};

// ASSETS
const assets = {
    fondo: new Image(),
    visual: new Image(),
    colision: new Image(),
    pJPG: new Image(),
    pCaminando: new Image(),
    pDescanso: new Image(),
    pMirando: new Image()
};

Object.values(assets).forEach(img => img.crossOrigin = "anonymous");
assets.fondo.src = 'fondo.jpg';
assets.visual.src = 'terreno_visual.jpg';
assets.colision.src = 'terreno_colision.jpg';
assets.pJPG.src = 'paloma.jpg';
assets.pCaminando.src = 'Caminando.gif';
assets.pDescanso.src = 'Descanso.gif';
assets.pMirando.src = 'Visualisando_Mapa.gif';

const cam = { x: 0, y: 0, suavizado: 0.1 };
const keys = {};

// HUD INICIAL
document.getElementById('usuario-nombre-hud').textContent = usuario.username;
document.getElementById('mundo-actual-hud').textContent = `Mundo ${mundoActual}`;
document.getElementById('dificultad-hud').textContent = usuario.dificultad.toUpperCase();
document.getElementById('dificultad-hud').className = `badge-dif-hud ${usuario.dificultad}`;

// CONTROLES
window.onkeydown = (e) => {
    if (gameState.pausado && e.code !== 'Escape') return;
    if (gameState.muerto) return;
    
    keys[e.code] = true;
    
    if (e.code === 'KeyM') {
        p.mirando = !p.mirando;
        gameState.mostrandoMapa = p.mirando;
    }
    
    if (e.code === 'Escape') {
        togglePausa();
    }
};

window.onkeyup = (e) => keys[e.code] = false;

// COLISIONES
function esSuelo(x, y) {
    if (x < 0 || x >= cCanvas.width || y < 0 || y >= cCanvas.height) return false;
    const pixel = cCtx.getImageData(Math.floor(x), Math.floor(y), 1, 1).data;
    return (pixel[0] < 100 && pixel[3] > 0);
}

// UPDATE
function update() {
    if (gameState.pausado || gameState.cargando || gameState.muerto) return;
    
    // Actualizar tiempo
    const tiempoActual = Date.now();
    const deltaTiempo = (tiempoActual - gameState.tiempoInicio) / 60000; // minutos
    usuario.stats.tiempoJugado += deltaTiempo / 60;
    gameState.tiempoInicio = tiempoActual;
    
    // Auto-guardar cada 60 segundos
    if (tiempoActual - gameState.tiempoUltimoGuardado > 60000) {
        PALOMA_USUARIOS.guardarProgreso();
        gameState.tiempoUltimoGuardado = tiempoActual;
        mostrarNotificacion('Progreso guardado');
    }
    
    // MODO MAPA
    if (p.mirando) {
        p.sprite = assets.pMirando;
        document.getElementById('mapa-ui').style.display = 'flex';
        p.vx = 0;
        return;
    } else {
        document.getElementById('mapa-ui').style.display = 'none';
    }
    
    // GRAVEDAD
    p.vy += p.gravedad;
    
    // MOVIMIENTO HORIZONTAL
    if (keys['ArrowRight'] || keys['KeyD']) {
        p.vx = p.velocidadMax;
        p.dir = 1;
        p.movido = true;
        p.sprite = assets.pCaminando;
    } else if (keys['ArrowLeft'] || keys['KeyA']) {
        p.vx = -p.velocidadMax;
        p.dir = -1;
        p.movido = true;
        p.sprite = assets.pCaminando;
    } else {
        p.vx = 0;
        p.sprite = p.movido ? assets.pDescanso : assets.pJPG;
    }
    
    // Actualizar distancia recorrida
    if (p.vx !== 0) {
        usuario.stats.distanciaRecorrida += Math.abs(p.vx) / 60;
    }
    
    // COLISIÓN LATERAL
    if (!esSuelo(p.x + (p.dir === 1 ? p.w : 0) + p.vx, p.y + p.h - 20)) {
        p.x += p.vx;
    }
    
    p.y += p.vy;
    
    // COLISIÓN DE SUELO
    let toca = false;
    for (let i = 0; i <= p.w; i += p.w / 2) {
        if (esSuelo(p.x + i, p.y + p.h)) {
            toca = true;
            break;
        }
    }
    
    if (toca) {
        p.vy = 0;
        p.enSuelo = true;
        p.saltosRestantes = 1;
        
        while (esSuelo(p.x + p.w / 2, p.y + p.h - 1)) p.y--;
        
        // SALTO
        if (keys['Space'] || keys['KeyW'] || keys['ArrowUp']) {
            p.vy = p.fuerzaSalto;
            p.enSuelo = false;
            consumirEnergia(5);
            usuario.stats.saltosRealizados++;
        }
    } else {
        p.enSuelo = false;
    }
    
    // REGENERACIÓN DE ENERGÍA
    if (usuario.energia < usuario.energiaMax) {
        let regen = 0.2;
        if (config.regeneracionVida && usuario.vida < usuario.vidaMax) {
            usuario.vida += 0.1;
        }
        usuario.energia += regen;
        actualizarHUD();
    }
    
    // LÍMITES DEL MUNDO
    if (p.y > canvas.height + 200) {
        registrarMuerte();
    }
    
    actualizarCamara();
}

// DRAW
function draw() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.drawImage(assets.fondo, 0, 0, canvas.width, canvas.height);
    
    ctx.save();
    ctx.translate(-cam.x, -cam.y);
    
    ctx.drawImage(assets.visual, 0, 0);
    
    ctx.save();
    let img = p.sprite || assets.pJPG;
    if (p.dir === -1) {
        ctx.translate(p.x + p.w, p.y);
        ctx.scale(-1, 1);
        ctx.drawImage(img, 0, 0, p.w, p.h);
    } else {
        ctx.drawImage(img, p.x, p.y, p.w, p.h);
    }
    ctx.restore();
    ctx.restore();
}

// LOOP
function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

// CÁMARA
function actualizarCamara() {
    const targetX = p.x - canvas.width / 2;
    const targetY = p.y - canvas.height / 2;
    
    cam.x += (targetX - cam.x) * cam.suavizado;
    cam.y += (targetY - cam.y) * cam.suavizado;
    
    if (cam.x < 0) cam.x = 0;
    if (cam.y < 0) cam.y = 0;
}

// HUD
function actualizarHUD() {
    const vidaPorcentaje = (usuario.vida / usuario.vidaMax) * 100;
    document.getElementById('vida-fill').style.width = vidaPorcentaje + '%';
    document.getElementById('vida-text').textContent = 
        `${Math.ceil(usuario.vida)} / ${usuario.vidaMax}`;
    
    const energiaPorcentaje = (usuario.energia / usuario.energiaMax) * 100;
    document.getElementById('energia-fill').style.width = energiaPorcentaje + '%';
    
    document.getElementById('migajas-count').textContent = usuario.stats.migajasRecolectadas;
}

function recibirDanio(cantidad) {
    const danioReal = cantidad * config.multiplicadorDanio;
    usuario.vida -= danioReal;
    if (usuario.vida < 0) usuario.vida = 0;
    actualizarHUD();
    
    canvas.style.filter = 'brightness(1.5) saturate(1.5)';
    setTimeout(() => canvas.style.filter = 'none', 100);
    
    if (usuario.vida <= 0) {
        registrarMuerte();
    }
}

function consumirEnergia(cantidad) {
    usuario.energia -= cantidad;
    if (usuario.energia < 0) usuario.energia = 0;
    actualizarHUD();
}

function recolectarMigaja() {
    usuario.stats.migajasRecolectadas++;
    PALOMA_USUARIOS.actualizarEstadistica('migajasRecolectadas', 1);
    actualizarHUD();
    mostrarNotificacion('¡Migaja +1!');
}

// PAUSA
function togglePausa() {
    gameState.pausado = !gameState.pausado;
    document.getElementById('menu-pausa').style.display = 
        gameState.pausado ? 'flex' : 'none';
}

function reanudarJuego() {
    gameState.pausado = false;
    document.getElementById('menu-pausa').style.display = 'none';
}

function reiniciarNivel() {
    p.x = usuario.checkpoint.x;
    p.y = usuario.checkpoint.y;
    p.vx = 0;
    p.vy = 0;
    usuario.vida = usuario.vidaMax;
    usuario.energia = usuario.energiaMax;
    actualizarHUD();
    reanudarJuego();
}

function guardarYSalir() {
    PALOMA_USUARIOS.actualizarCheckpoint(mundoActual, 1, p.x, p.y);
    PALOMA_USUARIOS.guardarProgreso();
    window.location.href = '../index.html';
}

// MUERTE
function registrarMuerte() {
    if (gameState.muerto) return;
    gameState.muerto = true;
    
    usuario.stats.rachaActual = 0;
    const resultado = PALOMA_USUARIOS.registrarMuerte();
    
    if (resultado.tipo === 'permanente') {
        // MODO EXTREMO - MUERTE PERMANENTE
        mostrarGameOverExtremo(resultado);
    } else {
        // MODOS NORMALES
        mostrarGameOverNormal(resultado);
    }
}

function mostrarGameOverExtremo(resultado) {
    const screen = document.getElementById('game-over-screen');
    document.getElementById('game-over-mensaje').innerHTML = `
        <h2 style="color:#9C27B0; font-size:2rem; margin:20px 0;">
            MODO EXTREMO - MUERTE PERMANENTE
        </h2>
        <p style="font-size:1.2rem; color:rgba(255,255,255,0.8);">
            Tu valentía será recordada en el Hall of Fame
        </p>
    `;
    
    document.getElementById('game-over-stats').innerHTML = `
        <div class="game-over-stat">⏱️ Tiempo Sobrevivido: ${formatearTiempo(resultado.tiempoSobrevivido)}</div>
        <div class="game-over-stat">🍞 Migajas Recolectadas: ${resultado.stats.migajasRecolectadas}</div>
        <div class="game-over-stat">⚔️ Enemigos Derrotados: ${resultado.stats.enemigosD errotados}</div>
        <div class="game-over-stat">🗺️ Mundo Alcanzado: Mundo ${mundoActual}</div>
    `;
    
    document.getElementById('btn-respawn').style.display = 'none';
    screen.style.display = 'flex';
    
    setTimeout(() => {
        window.location.href = '../../seleccion-usuario.html';
    }, 10000);
}

function mostrarGameOverNormal(resultado) {
    const screen = document.getElementById('game-over-screen');
    document.getElementById('game-over-mensaje').innerHTML = `
        <p style="font-size:1.1rem; color:rgba(255,255,255,0.7); margin:20px 0;">
            Regresas al checkpoint
        </p>
    `;
    
    document.getElementById('game-over-stats').innerHTML = `
        <div class="game-over-stat">💀 Muertes Totales: ${usuario.stats.muertes}</div>
        <div class="game-over-stat">📍 Checkpoint: Mundo ${resultado.checkpoint.mundo}</div>
    `;
    
    screen.style.display = 'flex';
}

function respawnJugador() {
    const cp = usuario.checkpoint;
    p.x = cp.x;
    p.y = cp.y;
    p.vx = 0;
    p.vy = 0;
    usuario.vida = usuario.vidaMax;
    usuario.energia = usuario.energiaMax;
    actualizarHUD();
    
    gameState.muerto = false;
    document.getElementById('game-over-screen').style.display = 'none';
}

function volverMenu() {
    PALOMA_USUARIOS.guardarProgreso();
    window.location.href = '../index.html';
}

// NOTIFICACIONES
function mostrarNotificacion(mensaje) {
    const notif = document.createElement('div');
    notif.className = 'notificacion-juego';
    notif.textContent = mensaje;
    document.body.appendChild(notif);
    
    setTimeout(() => notif.remove(), 2500);
}

function formatearTiempo(minutos) {
    const h = Math.floor(minutos / 60);
    const m = Math.floor(minutos % 60);
    const s = Math.floor((minutos % 1) * 60);
    return h > 0 ? `${h}h ${m}m ${s}s` : m > 0 ? `${m}m ${s}s` : `${s}s`;
}

// CARGA
let cargados = 0;
const totalAssets = Object.keys(assets).length;

Object.values(assets).forEach(img => {
    img.onload = () => {
        cargados++;
        const loadingText = document.querySelector('.loading-text');
        loadingText.textContent = `CARGANDO... ${Math.floor((cargados / totalAssets) * 100)}%`;
        
        if (cargados === totalAssets) {
            iniciarJuego();
        }
    };
    
    img.onerror = () => {
        console.warn('Error cargando:', img.src);
        cargados++;
        if (cargados === totalAssets) iniciarJuego();
    };
});

function iniciarJuego() {
    cCanvas.width = assets.visual.width;
    cCanvas.height = assets.visual.height;
    cCtx.drawImage(assets.colision, 0, 0);
    
    // Aplicar multiplicador de vida según dificultad
    usuario.vidaMax = Math.floor(100 * config.multiplicadorVida);
    usuario.vida = usuario.vidaMax;
    
    setTimeout(() => {
        document.getElementById('loading-screen').style.display = 'none';
        gameState.cargando = false;
        mostrarNotificacion('¡Mundo ' + mundoActual + ' cargado!');
    }, 500);
    
    actualizarHUD();
    loop();
}

// Detectar pérdida de foco
window.addEventListener('blur', () => {
    if (!gameState.pausado && !gameState.cargando && !gameState.muerto) {
        togglePausa();
    }
});

console.log('🎮 Gameplay cargado - Usuario:', usuario.username, '- Dificultad:', usuario.dificultad);
