// ========================================
// GAMEPLAY MEJORADO - PALOMA MIGAJERA
// ========================================

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const cCanvas = document.getElementById('collisionCanvas');
const cCtx = cCanvas.getContext('2d');

// ========================================
// SISTEMA DE JUEGO
// ========================================

const gameState = {
    pausado: false,
    cargando: true,
    mostrandoMapa: false,
    tiempoInicio: Date.now(),
    tiempoJugado: 0
};

const playerStats = {
    vidaMax: 100,
    vidaActual: 100,
    energiaMax: 100,
    energiaActual: 100,
    migajasRecolectadas: 0,
    muertes: 0
};

// ========================================
// ASSETS
// ========================================

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

// ========================================
// JUGADOR
// ========================================

const p = {
    x: 150,
    y: 50,
    w: 90,
    h: 90,
    vx: 0,
    vy: 0,
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

// ========================================
// CÁMARA
// ========================================

const cam = {
    x: 0,
    y: 0,
    suavizado: 0.1
};

// ========================================
// CONTROLES
// ========================================

const keys = {};
let configuracion = null;

window.onkeydown = (e) => {
    if (gameState.pausado && e.code !== 'Escape') return;
    
    keys[e.code] = true;
    
    // Mapa
    if (e.code === 'KeyM') {
        p.mirando = !p.mirando;
        gameState.mostrandoMapa = p.mirando;
    }
    
    // Pausa
    if (e.code === 'Escape') {
        togglePausa();
    }
};

window.onkeyup = (e) => {
    keys[e.code] = false;
};

// ========================================
// COLISIONES
// ========================================

function esSuelo(x, y) {
    if (x < 0 || x >= cCanvas.width || y < 0 || y >= cCanvas.height) return false;
    const pixel = cCtx.getImageData(Math.floor(x), Math.floor(y), 1, 1).data;
    return (pixel[0] < 100 && pixel[3] > 0);
}

// ========================================
// ACTUALIZACIÓN
// ========================================

function update() {
    if (gameState.pausado || gameState.cargando) return;
    
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
    
    // COLISIÓN LATERAL
    if (!esSuelo(p.x + (p.dir === 1 ? p.w : 0) + p.vx, p.y + p.h - 20)) {
        p.x += p.vx;
    }
    
    // MOVIMIENTO VERTICAL
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
        
        // Ajustar posición en el suelo
        while (esSuelo(p.x + p.w / 2, p.y + p.h - 1)) p.y--;
        
        // SALTO
        if (keys['Space'] || keys['KeyW']) {
            p.vy = p.fuerzaSalto;
            p.enSuelo = false;
            consumirEnergia(5);
        }
    } else {
        p.enSuelo = false;
    }
    
    // DOBLE SALTO (si está desbloqueado)
    if ((keys['Space'] || keys['KeyW']) && !p.enSuelo && p.saltosRestantes > 0) {
        // Placeholder para cuando implementen habilidades
        // p.vy = p.fuerzaSalto * 0.8;
        // p.saltosRestantes--;
    }
    
    // REGENERACIÓN DE ENERGÍA
    if (playerStats.energiaActual < playerStats.energiaMax) {
        playerStats.energiaActual += 0.2;
        actualizarHUD();
    }
    
    // ACTUALIZAR CÁMARA
    actualizarCamara();
    
    // LÍMITES DEL MUNDO
    if (p.y > canvas.height + 200) {
        morir();
    }
}

// ========================================
// DIBUJO
// ========================================

function draw() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 1. FONDO
    ctx.drawImage(assets.fondo, 0, 0, canvas.width, canvas.height);
    
    ctx.save();
    ctx.translate(-cam.x, -cam.y);
    
    // 2. TERRENO VISUAL
    ctx.drawImage(assets.visual, 0, 0);
    
    // 3. JUGADOR
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

// ========================================
// LOOP PRINCIPAL
// ========================================

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

// ========================================
// CÁMARA
// ========================================

function actualizarCamara() {
    const targetX = p.x - canvas.width / 2;
    const targetY = p.y - canvas.height / 2;
    
    cam.x += (targetX - cam.x) * cam.suavizado;
    cam.y += (targetY - cam.y) * cam.suavizado;
    
    // Límites de la cámara
    if (cam.x < 0) cam.x = 0;
    if (cam.y < 0) cam.y = 0;
}

// ========================================
// HUD
// ========================================

function actualizarHUD() {
    // Vida
    const vidaPorcentaje = (playerStats.vidaActual / playerStats.vidaMax) * 100;
    document.getElementById('vida-fill').style.width = vidaPorcentaje + '%';
    document.getElementById('vida-text').textContent = 
        `${Math.ceil(playerStats.vidaActual)} / ${playerStats.vidaMax}`;
    
    // Energía
    const energiaPorcentaje = (playerStats.energiaActual / playerStats.energiaMax) * 100;
    document.getElementById('energia-fill').style.width = energiaPorcentaje + '%';
    
    // Migajas
    document.getElementById('migajas-count').textContent = playerStats.migajasRecolectadas;
}

function recibirDanio(cantidad) {
    playerStats.vidaActual -= cantidad;
    if (playerStats.vidaActual < 0) playerStats.vidaActual = 0;
    actualizarHUD();
    
    // Efecto visual de daño
    canvas.style.filter = 'brightness(1.5) saturate(1.5)';
    setTimeout(() => {
        canvas.style.filter = 'none';
    }, 100);
    
    if (playerStats.vidaActual <= 0) {
        morir();
    }
}

function consumirEnergia(cantidad) {
    playerStats.energiaActual -= cantidad;
    if (playerStats.energiaActual < 0) playerStats.energiaActual = 0;
    actualizarHUD();
}

function recolectarMigaja() {
    playerStats.migajasRecolectadas++;
    actualizarHUD();
    mostrarNotificacion('¡Migaja recolectada!');
}

// ========================================
// SISTEMA DE PAUSA
// ========================================

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
    p.x = 150;
    p.y = 50;
    p.vx = 0;
    p.vy = 0;
    playerStats.vidaActual = playerStats.vidaMax;
    playerStats.energiaActual = playerStats.energiaMax;
    actualizarHUD();
    reanudarJuego();
    mostrarNotificacion('Nivel reiniciado');
}

// ========================================
// MUERTE Y RESPAWN
// ========================================

function morir() {
    playerStats.muertes++;
    mostrarNotificacion('¡Has muerto! Respawneando...', 'error');
    
    setTimeout(() => {
        reiniciarNivel();
    }, 2000);
}

// ========================================
// NOTIFICACIONES
// ========================================

function mostrarNotificacion(mensaje, tipo = 'info') {
    const notif = document.createElement('div');
    notif.className = 'notificacion-juego';
    notif.textContent = mensaje;
    
    if (tipo === 'error') {
        notif.style.borderColor = 'rgba(255, 50, 50, 0.5)';
        notif.style.background = 'rgba(50, 0, 0, 0.9)';
    }
    
    document.body.appendChild(notif);
    
    setTimeout(() => {
        notif.style.animation = 'slideDown 0.5s ease-out';
        setTimeout(() => notif.remove(), 500);
    }, 2500);
}

// ========================================
// GUARDADO AUTOMÁTICO
// ========================================

function guardarProgreso() {
    const saveData = {
        posicion: { x: p.x, y: p.y },
        vida: playerStats.vidaActual,
        energia: playerStats.energiaActual,
        migajas: playerStats.migajasRecolectadas,
        muertes: playerStats.muertes,
        tiempoJugado: gameState.tiempoJugado,
        fecha: new Date().toLocaleDateString()
    };
    
    const currentSave = localStorage.getItem('paloma_current_save') || '1';
    localStorage.setItem(`paloma_save_${currentSave}`, JSON.stringify(saveData));
    
    mostrarNotificacion('Progreso guardado automáticamente');
}

// Guardar cada 60 segundos
setInterval(() => {
    if (!gameState.pausado && !gameState.cargando) {
        const settings = JSON.parse(localStorage.getItem('paloma_settings'));
        if (settings && settings.juego.autoGuardar) {
            guardarProgreso();
        }
    }
}, 60000);

// ========================================
// CARGA DE ASSETS
// ========================================

let cargados = 0;
const totalAssets = Object.keys(assets).length;

Object.values(assets).forEach(img => {
    img.onload = () => {
        cargados++;
        
        // Actualizar loading
        const loadingText = document.querySelector('.loading-text');
        loadingText.textContent = `CARGANDO... ${Math.floor((cargados / totalAssets) * 100)}%`;
        
        if (cargados === totalAssets) {
            iniciarJuego();
        }
    };
    
    img.onerror = () => {
        console.error('Error cargando imagen:', img.src);
        cargados++;
        if (cargados === totalAssets) {
            iniciarJuego();
        }
    };
});

function iniciarJuego() {
    // Configurar canvas de colisión
    cCanvas.width = assets.visual.width;
    cCanvas.height = assets.visual.height;
    cCtx.drawImage(assets.colision, 0, 0);
    
    // Cargar configuración
    configuracion = JSON.parse(localStorage.getItem('paloma_settings'));
    
    // Cargar progreso guardado si existe
    cargarProgreso();
    
    // Ocultar loading
    setTimeout(() => {
        document.getElementById('loading-screen').style.display = 'none';
        gameState.cargando = false;
        mostrarNotificacion('¡Bienvenido de vuelta!');
    }, 500);
    
    // Iniciar HUD
    actualizarHUD();
    
    // Iniciar loop
    loop();
}

function cargarProgreso() {
    const currentSave = localStorage.getItem('paloma_current_save') || '1';
    const savedData = localStorage.getItem(`paloma_save_${currentSave}`);
    
    if (savedData) {
        const data = JSON.parse(savedData);
        if (data.posicion) {
            p.x = data.posicion.x;
            p.y = data.posicion.y;
        }
        if (data.vida) playerStats.vidaActual = data.vida;
        if (data.energia) playerStats.energiaActual = data.energia;
        if (data.migajas) playerStats.migajasRecolectadas = data.migajas;
        if (data.muertes) playerStats.muertes = data.muertes;
        if (data.tiempoJugado) gameState.tiempoJugado = data.tiempoJugado;
    }
}

// ========================================
// INICIALIZACIÓN
// ========================================

console.log('🕊️ Gameplay Mejorado de Paloma Migajera cargado');

// Manejar pérdida de foco
window.addEventListener('blur', () => {
    if (!gameState.pausado && !gameState.cargando) {
        togglePausa();
    }
});
