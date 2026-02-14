// ========================================
// SISTEMA DE LOGROS - PALOMA MIGAJERA
// ========================================

const LOGROS = {
    primer_vuelo: {
        id: 'primer_vuelo',
        nombre: 'Primer Vuelo',
        descripcion: 'Completa tu primer viaje',
        icono: '🕊️',
        desbloqueado: false,
        condicion: () => {
            // Se desbloquea al completar el tutorial
            return false;
        }
    },
    recolector: {
        id: 'recolector',
        nombre: 'Recolector Novato',
        descripcion: 'Recoge 50 migajas',
        icono: '🍞',
        desbloqueado: false,
        condicion: () => {
            const stats = JSON.parse(localStorage.getItem('paloma_settings'))?.estadisticas;
            return stats && stats.migajasTotal >= 50;
        }
    },
    maestro_recolector: {
        id: 'maestro_recolector',
        nombre: 'Maestro Recolector',
        descripcion: 'Recoge 500 migajas',
        icono: '🥖',
        desbloqueado: false,
        condicion: () => {
            const stats = JSON.parse(localStorage.getItem('paloma_settings'))?.estadisticas;
            return stats && stats.migajasTotal >= 500;
        }
    },
    explorador: {
        id: 'explorador',
        nombre: 'Explorador',
        descripcion: 'Descubre 5 áreas secretas',
        icono: '🗺️',
        desbloqueado: false,
        condicion: () => {
            const data = JSON.parse(localStorage.getItem('paloma_areas_descubiertas'));
            return data && data.length >= 5;
        }
    },
    superviviente: {
        id: 'superviviente',
        nombre: 'Superviviente',
        descripcion: 'Completa un nivel sin morir',
        icono: '💚',
        desbloqueado: false,
        condicion: () => false
    },
    volador_experto: {
        id: 'volador_experto',
        nombre: 'Volador Experto',
        descripcion: 'Desbloquea todas las habilidades de vuelo',
        icono: '✨',
        desbloqueado: false,
        condicion: () => {
            const habilidades = JSON.parse(localStorage.getItem('paloma_habilidades'));
            return habilidades && Object.keys(habilidades).length >= 4;
        }
    },
    cazador: {
        id: 'cazador',
        nombre: 'Cazador',
        descripcion: 'Derrota 10 enemigos',
        icono: '⚔️',
        desbloqueado: false,
        condicion: () => {
            const enemigos = JSON.parse(localStorage.getItem('paloma_enemigos_derrotados'));
            return enemigos && enemigos >= 10;
        }
    },
    velocista: {
        id: 'velocista',
        nombre: 'Velocista',
        descripcion: 'Completa un nivel en menos de 5 minutos',
        icono: '⚡',
        desbloqueado: false,
        condicion: () => false
    },
    coleccionista: {
        id: 'coleccionista',
        nombre: 'Coleccionista',
        descripcion: 'Encuentra todas las plumas especiales',
        icono: '🪶',
        desbloqueado: false,
        condicion: () => {
            const plumas = JSON.parse(localStorage.getItem('paloma_plumas'));
            return plumas && plumas.length >= 10;
        }
    },
    inmune: {
        id: 'inmune',
        nombre: 'Inmune al Peligro',
        descripcion: 'Evita 100 ataques enemigos',
        icono: '🛡️',
        desbloqueado: false,
        condicion: () => {
            const evasiones = JSON.parse(localStorage.getItem('paloma_evasiones'));
            return evasiones && evasiones >= 100;
        }
    },
    pacifista: {
        id: 'pacifista',
        nombre: 'Pacifista',
        descripcion: 'Completa un nivel sin atacar a nadie',
        icono: '☮️',
        desbloqueado: false,
        condicion: () => false
    },
    perfeccionista: {
        id: 'perfeccionista',
        nombre: 'Perfeccionista',
        descripcion: 'Completa un nivel al 100%',
        icono: '💯',
        desbloqueado: false,
        condicion: () => false
    },
    madrugador: {
        id: 'madrugador',
        nombre: 'Madrugador',
        descripcion: 'Juega al amanecer (6:00 - 8:00 AM)',
        icono: '🌅',
        desbloqueado: false,
        condicion: () => {
            const hora = new Date().getHours();
            return hora >= 6 && hora < 8;
        }
    },
    noctambulo: {
        id: 'noctambulo',
        nombre: 'Noctámbulo',
        descripcion: 'Juega a medianoche (12:00 - 2:00 AM)',
        icono: '🌙',
        desbloqueado: false,
        condicion: () => {
            const hora = new Date().getHours();
            return hora >= 0 && hora < 2;
        }
    },
    dedicado: {
        id: 'dedicado',
        nombre: 'Dedicado',
        descripcion: 'Juega durante 10 horas',
        icono: '⏰',
        desbloqueado: false,
        condicion: () => {
            const stats = JSON.parse(localStorage.getItem('paloma_settings'))?.estadisticas;
            return stats && stats.tiempoTotal >= 600;
        }
    },
    leyenda: {
        id: 'leyenda',
        nombre: 'Leyenda Alada',
        descripcion: 'Desbloquea todos los logros',
        icono: '👑',
        desbloqueado: false,
        condicion: () => {
            const logros = cargarLogros();
            const total = Object.keys(LOGROS).length - 1; // -1 porque no contamos este mismo
            const desbloqueados = Object.values(logros).filter(l => l && l !== 'leyenda').length;
            return desbloqueados >= total;
        }
    },
    social: {
        id: 'social',
        nombre: 'Paloma Social',
        descripcion: 'Interactúa con 20 NPCs diferentes',
        icono: '💬',
        desbloqueado: false,
        condicion: () => {
            const npcs = JSON.parse(localStorage.getItem('paloma_npcs_conocidos'));
            return npcs && npcs.length >= 20;
        }
    },
    saltarin: {
        id: 'saltarin',
        nombre: 'Saltarín Profesional',
        descripcion: 'Realiza 1000 saltos',
        icono: '🦘',
        desbloqueado: false,
        condicion: () => {
            const saltos = JSON.parse(localStorage.getItem('paloma_saltos_totales'));
            return saltos >= 1000;
        }
    },
    palomaduken_maestro: {
        id: 'palomaduken_maestro',
        nombre: 'Maestro del Palomaduken',
        descripcion: 'Lanza 100 Palomadukens exitosos',
        icono: '💥',
        desbloqueado: false,
        condicion: () => {
            const palomadukens = JSON.parse(localStorage.getItem('paloma_palomadukens'));
            return palomadukens >= 100;
        }
    },
    resistente: {
        id: 'resistente',
        nombre: 'Resistente',
        descripcion: 'Sobrevive con 1 punto de vida durante 60 segundos',
        icono: '❤️',
        desbloqueado: false,
        condicion: () => false
    }
};

// ========================================
// FUNCIONES DEL SISTEMA
// ========================================

function cargarLogros() {
    const saved = localStorage.getItem('paloma_logros');
    return saved ? JSON.parse(saved) : {};
}

function guardarLogros(logros) {
    localStorage.setItem('paloma_logros', JSON.stringify(logros));
}

function verificarLogros() {
    const logrosGuardados = cargarLogros();
    const nuevosLogros = [];
    
    for (const [id, logro] of Object.entries(LOGROS)) {
        // Si ya está desbloqueado, skip
        if (logrosGuardados[id]) continue;
        
        // Verificar condición
        if (logro.condicion()) {
            logrosGuardados[id] = {
                desbloqueado: true,
                fecha: new Date().toISOString()
            };
            nuevosLogros.push(logro);
        }
    }
    
    // Guardar si hay cambios
    if (nuevosLogros.length > 0) {
        guardarLogros(logrosGuardados);
        
        // Actualizar estadísticas
        actualizarEstadisticasLogros();
        
        // Notificar cada nuevo logro
        nuevosLogros.forEach((logro, index) => {
            setTimeout(() => {
                mostrarNotificacionLogro(logro);
            }, index * 2000);
        });
    }
    
    return nuevosLogros;
}

function mostrarNotificacionLogro(logro) {
    const notif = document.createElement('div');
    notif.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.95);
        border: 3px solid gold;
        padding: 30px 40px;
        border-radius: 10px;
        z-index: 1000;
        text-align: center;
        min-width: 300px;
        box-shadow: 0 0 30px rgba(255, 215, 0, 0.5);
        animation: logroPopup 0.5s ease-out;
    `;
    
    notif.innerHTML = `
        <div style="font-size: 3rem; margin-bottom: 10px;">${logro.icono}</div>
        <div style="color: gold; font-size: 1.5rem; letter-spacing: 3px; margin-bottom: 10px; text-transform: uppercase;">
            ¡LOGRO DESBLOQUEADO!
        </div>
        <div style="color: white; font-size: 1.2rem; letter-spacing: 2px; margin-bottom: 5px;">
            ${logro.nombre}
        </div>
        <div style="color: rgba(255,255,255,0.7); font-size: 0.9rem; letter-spacing: 1px;">
            ${logro.descripcion}
        </div>
    `;
    
    // Añadir animación
    const style = document.createElement('style');
    style.textContent = `
        @keyframes logroPopup {
            0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
            50% { transform: translate(-50%, -50%) scale(1.1); }
            100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notif);
    
    // Reproducir sonido de logro (cuando tengan audio)
    // reproducirSonido('logro-desbloqueado');
    
    setTimeout(() => {
        notif.style.animation = 'logroPopup 0.5s ease-out reverse';
        setTimeout(() => notif.remove(), 500);
    }, 4000);
}

function actualizarEstadisticasLogros() {
    const settings = JSON.parse(localStorage.getItem('paloma_settings')) || {};
    if (!settings.estadisticas) settings.estadisticas = {};
    
    const logrosDesbloqueados = Object.keys(cargarLogros()).length;
    settings.estadisticas.logrosTotal = logrosDesbloqueados;
    
    localStorage.setItem('paloma_settings', JSON.stringify(settings));
}

function obtenerProgreso() {
    const logrosDesbloqueados = Object.keys(cargarLogros()).length;
    const totalLogros = Object.keys(LOGROS).length;
    return {
        desbloqueados: logrosDesbloqueados,
        total: totalLogros,
        porcentaje: Math.floor((logrosDesbloqueados / totalLogros) * 100)
    };
}

// ========================================
// FUNCIONES DE DESBLOQUEO MANUAL
// ========================================

function desbloquearLogro(id) {
    const logrosGuardados = cargarLogros();
    
    if (!logrosGuardados[id]) {
        logrosGuardados[id] = {
            desbloqueado: true,
            fecha: new Date().toISOString()
        };
        
        guardarLogros(logrosGuardados);
        actualizarEstadisticasLogros();
        
        const logro = LOGROS[id];
        if (logro) {
            mostrarNotificacionLogro(logro);
        }
    }
}

// ========================================
// HELPERS PARA TRACKING
// ========================================

function incrementarSaltos() {
    let saltos = parseInt(localStorage.getItem('paloma_saltos_totales')) || 0;
    saltos++;
    localStorage.setItem('paloma_saltos_totales', saltos);
    verificarLogros();
}

function incrementarEnemigoDerrotado() {
    let enemigos = parseInt(localStorage.getItem('paloma_enemigos_derrotados')) || 0;
    enemigos++;
    localStorage.setItem('paloma_enemigos_derrotados', enemigos);
    verificarLogros();
}

function incrementarPalomaduken() {
    let palomadukens = parseInt(localStorage.getItem('paloma_palomadukens')) || 0;
    palomadukens++;
    localStorage.setItem('paloma_palomadukens', palomadukens);
    verificarLogros();
}

function registrarAreaDescubierta(areaId) {
    let areas = JSON.parse(localStorage.getItem('paloma_areas_descubiertas')) || [];
    if (!areas.includes(areaId)) {
        areas.push(areaId);
        localStorage.setItem('paloma_areas_descubiertas', JSON.stringify(areas));
        verificarLogros();
    }
}

function registrarNPCConocido(npcId) {
    let npcs = JSON.parse(localStorage.getItem('paloma_npcs_conocidos')) || [];
    if (!npcs.includes(npcId)) {
        npcs.push(npcId);
        localStorage.setItem('paloma_npcs_conocidos', JSON.stringify(npcs));
        verificarLogros();
    }
}

// ========================================
// VERIFICACIÓN AUTOMÁTICA
// ========================================

// Verificar logros cada 30 segundos
setInterval(() => {
    verificarLogros();
}, 30000);

// Verificar al cargar
window.addEventListener('DOMContentLoaded', () => {
    verificarLogros();
});

// ========================================
// EXPORTAR PARA USO GLOBAL
// ========================================

window.PALOMA_LOGROS = {
    LOGROS,
    verificarLogros,
    desbloquearLogro,
    obtenerProgreso,
    incrementarSaltos,
    incrementarEnemigoDerrotado,
    incrementarPalomaduken,
    registrarAreaDescubierta,
    registrarNPCConocido
};

console.log('🏆 Sistema de logros cargado - ' + Object.keys(LOGROS).length + ' logros disponibles');
