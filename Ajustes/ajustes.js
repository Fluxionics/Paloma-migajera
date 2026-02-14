// ========================================
// SISTEMA DE CONFIGURACIÓN - PALOMA MIGAJERA
// ========================================

// Configuración por defecto
const DEFAULT_SETTINGS = {
    audio: {
        musica: 70,
        efectos: 80,
        ambiente: 60
    },
    graficos: {
        calidad: 'media',
        particulas: true,
        pantallaCompleta: false,
        vsync: true
    },
    controles: {
        izquierda: ['KeyA', 'ArrowLeft'],
        derecha: ['KeyD', 'ArrowRight'],
        saltar: ['Space', 'KeyW'],
        mapa: ['KeyM'],
        pausa: ['Escape'],
        habilidad: ['ShiftLeft', 'ShiftRight']
    },
    juego: {
        idioma: 'es',
        autoGuardar: true,
        tutoriales: true,
        subtitulos: true
    },
    estadisticas: {
        tiempoTotal: 0,
        migajasTotal: 0,
        logrosTotal: 0,
        muertesTotal: 0
    }
};

// Cargar configuración guardada o usar por defecto
function cargarConfiguracion() {
    const saved = localStorage.getItem('paloma_settings');
    if (saved) {
        return JSON.parse(saved);
    }
    return JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
}

// Guardar configuración
function guardarConfiguracion(config) {
    localStorage.setItem('paloma_settings', JSON.stringify(config));
}

let currentSettings = cargarConfiguracion();

// ========================================
// INICIALIZACIÓN
// ========================================
window.addEventListener('DOMContentLoaded', () => {
    inicializarAudio();
    inicializarGraficos();
    inicializarControles();
    inicializarJuego();
    inicializarDatos();
    inicializarEstadisticas();
    
    // Notificación de carga
    mostrarNotificacion('Configuración cargada', 'success');
});

// ========================================
// AUDIO
// ========================================
function inicializarAudio() {
    const musicaSlider = document.getElementById('volumen-musica');
    const efectosSlider = document.getElementById('volumen-efectos');
    const ambienteSlider = document.getElementById('volumen-ambiente');

    // Establecer valores guardados
    musicaSlider.value = currentSettings.audio.musica;
    efectosSlider.value = currentSettings.audio.efectos;
    ambienteSlider.value = currentSettings.audio.ambiente;

    // Actualizar displays
    actualizarSliderDisplay(musicaSlider);
    actualizarSliderDisplay(efectosSlider);
    actualizarSliderDisplay(ambienteSlider);

    // Event listeners
    musicaSlider.addEventListener('input', (e) => {
        actualizarSliderDisplay(e.target);
        currentSettings.audio.musica = parseInt(e.target.value);
        aplicarVolumenMusica(currentSettings.audio.musica);
    });

    efectosSlider.addEventListener('input', (e) => {
        actualizarSliderDisplay(e.target);
        currentSettings.audio.efectos = parseInt(e.target.value);
        // Reproducir sonido de prueba
        reproducirSonidoPrueba();
    });

    ambienteSlider.addEventListener('input', (e) => {
        actualizarSliderDisplay(e.target);
        currentSettings.audio.ambiente = parseInt(e.target.value);
    });
}

function actualizarSliderDisplay(slider) {
    const valueDisplay = slider.nextElementSibling;
    if (valueDisplay && valueDisplay.classList.contains('slider-value')) {
        valueDisplay.textContent = slider.value + '%';
    }
}

function aplicarVolumenMusica(volumen) {
    // Esta función será llamada por el sistema de audio del juego
    window.GAME_AUDIO_VOLUME = volumen / 100;
}

function reproducirSonidoPrueba() {
    // Placeholder para cuando tengan archivos de audio
    // const audio = new Audio('path/to/test-sound.mp3');
    // audio.volume = currentSettings.audio.efectos / 100;
    // audio.play();
    console.log('🔊 Reproduciendo sonido de prueba al ' + currentSettings.audio.efectos + '%');
}

// ========================================
// GRÁFICOS
// ========================================
function inicializarGraficos() {
    const calidadSelect = document.getElementById('calidad');
    const particulasCheck = document.getElementById('particulas');
    const pantallaCompletaCheck = document.getElementById('pantalla-completa');
    const vsyncCheck = document.getElementById('vsync');

    // Establecer valores guardados
    calidadSelect.value = currentSettings.graficos.calidad;
    particulasCheck.checked = currentSettings.graficos.particulas;
    pantallaCompletaCheck.checked = currentSettings.graficos.pantallaCompleta;
    vsyncCheck.checked = currentSettings.graficos.vsync;

    // Event listeners
    calidadSelect.addEventListener('change', (e) => {
        currentSettings.graficos.calidad = e.target.value;
        aplicarCalidadGrafica(e.target.value);
    });

    particulasCheck.addEventListener('change', (e) => {
        currentSettings.graficos.particulas = e.target.checked;
    });

    pantallaCompletaCheck.addEventListener('change', (e) => {
        currentSettings.graficos.pantallaCompleta = e.target.checked;
        togglePantallaCompleta(e.target.checked);
    });

    vsyncCheck.addEventListener('change', (e) => {
        currentSettings.graficos.vsync = e.target.checked;
    });
}

function aplicarCalidadGrafica(calidad) {
    // Esta configuración será leída por el juego
    window.GAME_QUALITY = calidad;
    console.log('🎨 Calidad gráfica cambiada a: ' + calidad);
}

function togglePantallaCompleta(activar) {
    if (activar) {
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

// ========================================
// CONTROLES
// ========================================
function inicializarControles() {
    const keyButtons = document.querySelectorAll('.key-btn');
    const resetBtn = document.querySelector('.reset-controls-btn');

    keyButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            cambiarTecla(btn);
        });
    });

    resetBtn.addEventListener('click', () => {
        if (confirm('¿Restaurar controles a los valores por defecto?')) {
            currentSettings.controles = JSON.parse(JSON.stringify(DEFAULT_SETTINGS.controles));
            mostrarNotificacion('Controles restaurados', 'success');
            location.reload();
        }
    });
}

function cambiarTecla(button) {
    const action = button.dataset.action;
    button.textContent = 'Presiona una tecla...';
    button.style.background = 'rgba(255, 255, 100, 0.3)';
    
    const listener = (e) => {
        e.preventDefault();
        currentSettings.controles[action] = [e.code];
        button.textContent = formatearTecla(e.code);
        button.style.background = '';
        document.removeEventListener('keydown', listener);
        mostrarNotificacion('Tecla actualizada: ' + formatearTecla(e.code), 'success');
    };
    
    document.addEventListener('keydown', listener);
}

function formatearTecla(code) {
    const nombres = {
        'Space': 'ESPACIO',
        'ArrowUp': '↑',
        'ArrowDown': '↓',
        'ArrowLeft': '←',
        'ArrowRight': '→',
        'Escape': 'ESC',
        'ShiftLeft': 'SHIFT IZQ',
        'ShiftRight': 'SHIFT DER'
    };
    
    if (nombres[code]) return nombres[code];
    if (code.startsWith('Key')) return code.replace('Key', '');
    return code;
}

// ========================================
// JUEGO
// ========================================
function inicializarJuego() {
    const idiomaSelect = document.getElementById('idioma');
    const autoGuardarCheck = document.getElementById('auto-guardar');
    const tutorialesCheck = document.getElementById('tutoriales');
    const subtitulosCheck = document.getElementById('subtitulos');

    // Establecer valores guardados
    idiomaSelect.value = currentSettings.juego.idioma;
    autoGuardarCheck.checked = currentSettings.juego.autoGuardar;
    tutorialesCheck.checked = currentSettings.juego.tutoriales;
    subtitulosCheck.checked = currentSettings.juego.subtitulos;

    // Event listeners
    idiomaSelect.addEventListener('change', (e) => {
        currentSettings.juego.idioma = e.target.value;
        mostrarNotificacion('Idioma cambiado (se aplicará al reiniciar)', 'info');
    });

    autoGuardarCheck.addEventListener('change', (e) => {
        currentSettings.juego.autoGuardar = e.target.checked;
    });

    tutorialesCheck.addEventListener('change', (e) => {
        currentSettings.juego.tutoriales = e.target.checked;
    });

    subtitulosCheck.addEventListener('change', (e) => {
        currentSettings.juego.subtitulos = e.target.checked;
    });
}

// ========================================
// DATOS
// ========================================
function inicializarDatos() {
    actualizarInfoDatos();
}

function actualizarInfoDatos() {
    // Calcular espacio usado
    let totalSize = 0;
    for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
            totalSize += localStorage[key].length + key.length;
        }
    }
    
    const sizeKB = (totalSize / 1024).toFixed(2);
    document.getElementById('datos-usados').textContent = sizeKB + ' KB';

    // Contar partidas guardadas
    let partidasCount = 0;
    for (let i = 1; i <= 3; i++) {
        if (localStorage.getItem(`paloma_save_${i}`)) {
            partidasCount++;
        }
    }
    document.getElementById('partidas-count').textContent = partidasCount;
}

function borrarTodosDatos() {
    const confirmacion = prompt('⚠️ ESTA ACCIÓN NO SE PUEDE DESHACER.\n\nEscribe "BORRAR TODO" para confirmar:');
    
    if (confirmacion === 'BORRAR TODO') {
        localStorage.clear();
        mostrarNotificacion('Todos los datos han sido eliminados', 'warning');
        setTimeout(() => {
            window.location.href = '../Menu Principal/index.html';
        }, 2000);
    } else {
        mostrarNotificacion('Acción cancelada', 'info');
    }
}

// ========================================
// ESTADÍSTICAS
// ========================================
function inicializarEstadisticas() {
    const stats = currentSettings.estadisticas;
    
    // Convertir tiempo total de minutos a formato legible
    const horas = Math.floor(stats.tiempoTotal / 60);
    const minutos = stats.tiempoTotal % 60;
    document.getElementById('tiempo-total').textContent = `${horas}h ${minutos}m`;
    
    document.getElementById('migajas-total').textContent = stats.migajasTotal;
    document.getElementById('logros-total').textContent = `${stats.logrosTotal} / 20`;
    document.getElementById('muertes-total').textContent = stats.muertesTotal;
}

// ========================================
// ACCIONES PRINCIPALES
// ========================================
function guardarAjustes() {
    guardarConfiguracion(currentSettings);
    mostrarNotificacion('¡Configuración guardada exitosamente!', 'success');
    
    // Efecto visual de guardado
    const btnPrimary = document.querySelector('.btn-primary');
    btnPrimary.textContent = '✓ Guardado';
    setTimeout(() => {
        btnPrimary.textContent = 'Guardar Cambios';
    }, 2000);
}

function resetearAjustes() {
    if (confirm('¿Restaurar toda la configuración a los valores por defecto?')) {
        currentSettings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
        guardarConfiguracion(currentSettings);
        mostrarNotificacion('Configuración restaurada', 'success');
        setTimeout(() => {
            location.reload();
        }, 1000);
    }
}

// ========================================
// SISTEMA DE NOTIFICACIONES
// ========================================
function mostrarNotificacion(mensaje, tipo = 'info') {
    // Eliminar notificación anterior si existe
    const notifAnterior = document.querySelector('.notificacion');
    if (notifAnterior) {
        notifAnterior.remove();
    }

    const notif = document.createElement('div');
    notif.className = `notificacion notif-${tipo}`;
    notif.textContent = mensaje;
    
    // Estilos inline para la notificación
    Object.assign(notif.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px 25px',
        background: tipo === 'success' ? 'rgba(50, 255, 50, 0.2)' : 
                    tipo === 'warning' ? 'rgba(255, 200, 50, 0.2)' : 
                    tipo === 'error' ? 'rgba(255, 50, 50, 0.2)' : 
                    'rgba(100, 150, 255, 0.2)',
        border: `2px solid ${tipo === 'success' ? 'rgba(50, 255, 50, 0.5)' : 
                              tipo === 'warning' ? 'rgba(255, 200, 50, 0.5)' : 
                              tipo === 'error' ? 'rgba(255, 50, 50, 0.5)' : 
                              'rgba(100, 150, 255, 0.5)'}`,
        color: 'white',
        borderRadius: '4px',
        zIndex: '1000',
        fontSize: '0.95rem',
        letterSpacing: '1px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
        animation: 'slideIn 0.3s ease-out'
    });

    document.body.appendChild(notif);

    setTimeout(() => {
        notif.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notif.remove(), 300);
    }, 3000);
}

// Agregar estilos de animación
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ========================================
// EXPORTAR CONFIGURACIÓN PARA EL JUEGO
// ========================================
window.PALOMA_CONFIG = currentSettings;

console.log('⚙️ Sistema de configuración cargado correctamente');
