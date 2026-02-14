// ========================================
// CONFIGURACIÓN GLOBAL - PALOMA MIGAJERA
// ========================================

const gameConfig = {
    // Información básica
    nombre: "PALOMA MIGAJERA",
    version: "v1.0.2",
    estado: "Alpha",
    desarrollador: "Guillermo R. - Francisco D. - Daila J.",
    
    // Build info
    fechaCompilacion: "2024-02-14",
    
    // URLs y enlaces
    repositorio: "https://github.com/tu-repo/paloma-migajera",
    discord: null,
    web: null
};

// ========================================
// CONFIGURACIÓN DEL JUGADOR
// ========================================

const playerConfig = {
    // Stats base
    vidaMaxima: 100,
    energiaMaxima: 100,
    velocidadBase: 6,
    fuerzaSaltoBase: -16,
    gravedadBase: 0.8,
    
    // Tamaño del sprite
    ancho: 90,
    alto: 90,
    
    // Habilidades desbloqueables
    habilidades: {
        dobleSalto: {
            desbloqueado: false,
            nombre: "Ascenso Térmico",
            descripcion: "Aprovecha una corriente de aire para elevarte una segunda vez",
            consumoEnergia: 15,
            fuerzaSalto: -13
        },
        dash: {
            desbloqueado: false,
            nombre: "Impulso de Pluma",
            descripcion: "Un rápido desplazamiento lateral en el aire",
            consumoEnergia: 20,
            velocidad: 15,
            cooldown: 500 // milisegundos
        },
        palomaduken: {
            desbloqueado: false,
            nombre: "Palomaduken",
            descripcion: "Lanza una ráfaga de migas comprimidas a alta velocidad",
            consumoEnergia: 30,
            danio: 25,
            cooldown: 800
        },
        planeo: {
            desbloqueado: false,
            nombre: "Planeo Silencioso",
            descripcion: "Mantén el botón de salto para descender lentamente",
            consumoEnergia: 5, // por segundo
            velocidadCaida: 2
        },
        picado: {
            desbloqueado: false,
            nombre: "Picado Balístico",
            descripcion: "Cae a gran velocidad para romper obstáculos",
            consumoEnergia: 25,
            velocidad: 25,
            danio: 40
        }
    }
};

// ========================================
// CONFIGURACIÓN DE ENEMIGOS
// ========================================

const enemiesConfig = {
    gato: {
        nombre: "Gato Callejero",
        vida: 30,
        danio: 15,
        velocidad: 3,
        rangoDeteccion: 200,
        experiencia: 10
    },
    rata: {
        nombre: "Rata Urbana",
        vida: 20,
        danio: 10,
        velocidad: 5,
        rangoDeteccion: 150,
        experiencia: 8
    },
    perro: {
        nombre: "Perro Guardián",
        vida: 50,
        danio: 25,
        velocidad: 4,
        rangoDeteccion: 250,
        experiencia: 20
    },
    halcon: {
        nombre: "Halcón Cazador",
        vida: 40,
        danio: 30,
        velocidad: 7,
        rangoDeteccion: 300,
        experiencia: 25,
        jefe: true
    }
};

// ========================================
// CONFIGURACIÓN DE ITEMS
// ========================================

const itemsConfig = {
    migaja: {
        nombre: "Migaja de Pan",
        tipo: "consumible",
        efecto: "energia",
        valor: 10,
        rareza: "comun"
    },
    migajaGrande: {
        nombre: "Pan Entero",
        tipo: "consumible",
        efecto: "energia",
        valor: 50,
        rareza: "raro"
    },
    semilla: {
        nombre: "Semilla Nutritiva",
        tipo: "consumible",
        efecto: "vida",
        valor: 20,
        rareza: "comun"
    },
    frutilla: {
        nombre: "Frutilla Fresca",
        tipo: "consumible",
        efecto: "vida",
        valor: 50,
        rareza: "raro"
    },
    
    // Plumas de poder (amuletos)
    plumaPlomo: {
        nombre: "Pluma de Plomo",
        tipo: "amuleto",
        efecto: "caida_rapida_inmune_viento",
        rareza: "epico"
    },
    migaIman: {
        nombre: "Miga Imán",
        tipo: "amuleto",
        efecto: "atrae_migajas",
        rareza: "raro"
    },
    corazonGorrion: {
        nombre: "Corazón de Gorrión",
        tipo: "amuleto",
        efecto: "vida_max_+1_velocidad_planeo_-10%",
        rareza: "epico"
    },
    cantoCiudad: {
        nombre: "Canto de Ciudad",
        tipo: "amuleto",
        efecto: "npcs_generosos",
        rareza: "legendario"
    }
};

// ========================================
// CONFIGURACIÓN DE AUDIO (Para cuando tengan archivos)
// ========================================

const audioConfig = {
    musica: {
        menuPrincipal: {
            archivo: "audio/musica/menu-principal.mp3",
            volumen: 0.7,
            loop: true
        },
        gameplay: {
            archivo: "audio/musica/gameplay-ambiente.mp3",
            volumen: 0.6,
            loop: true
        },
        jefe: {
            archivo: "audio/musica/batalla-jefe.mp3",
            volumen: 0.8,
            loop: true
        }
    },
    efectos: {
        salto: { archivo: "audio/sfx/salto.mp3", volumen: 0.5 },
        dobleSlato: { archivo: "audio/sfx/doble-salto.mp3", volumen: 0.6 },
        dano: { archivo: "audio/sfx/dano.mp3", volumen: 0.7 },
        muerte: { archivo: "audio/sfx/muerte.mp3", volumen: 0.8 },
        recolectarMigaja: { archivo: "audio/sfx/migaja.mp3", volumen: 0.4 },
        palomaduken: { archivo: "audio/sfx/palomaduken.mp3", volumen: 0.8 },
        hoverMenu: { archivo: "audio/sfx/menu-hover.mp3", volumen: 0.3 },
        clickMenu: { archivo: "audio/sfx/menu-click.mp3", volumen: 0.4 },
        logroDesbloqueado: { archivo: "audio/sfx/logro.mp3", volumen: 0.9 }
    },
    ambiente: {
        ciudad: { archivo: "audio/ambiente/ciudad.mp3", volumen: 0.5, loop: true },
        parque: { archivo: "audio/ambiente/parque.mp3", volumen: 0.5, loop: true },
        noche: { archivo: "audio/ambiente/noche.mp3", volumen: 0.4, loop: true }
    }
};

// ========================================
// CONFIGURACIÓN DE NIVELES
// ========================================

const nivelesConfig = {
    tutorial: {
        nombre: "El Despertar",
        descripcion: "Aprende los controles básicos",
        tiempoEstimado: 5,
        dificultad: "facil",
        migajasObjetivo: 20,
        enemigos: false
    },
    nivel1: {
        nombre: "Calles de la Ciudad",
        descripcion: "Explora las calles urbanas",
        tiempoEstimado: 15,
        dificultad: "facil",
        migajasObjetivo: 50,
        enemigos: true
    },
    nivel2: {
        nombre: "El Parque Central",
        descripcion: "Un oasis en medio del concreto",
        tiempoEstimado: 20,
        dificultad: "media",
        migajasObjetivo: 100,
        enemigos: true
    },
    jefe1: {
        nombre: "El Halcón de la Chimenea",
        descripcion: "Enfréntate al guardián del cielo",
        tiempoEstimado: 10,
        dificultad: "dificil",
        migajasObjetivo: 0,
        enemigos: true,
        jefe: true
    }
};

// ========================================
// CONTROLES POR DEFECTO
// ========================================

const controlesDefault = {
    izquierda: ['KeyA', 'ArrowLeft'],
    derecha: ['KeyD', 'ArrowRight'],
    saltar: ['Space', 'KeyW', 'ArrowUp'],
    agacharse: ['KeyS', 'ArrowDown'],
    mapa: ['KeyM'],
    pausa: ['Escape'],
    habilidad1: ['ShiftLeft', 'ShiftRight'],
    habilidad2: ['KeyE'],
    interactuar: ['KeyF']
};

// ========================================
// CONFIGURACIÓN DE CALIDAD GRÁFICA
// ========================================

const calidadGraficaConfig = {
    baja: {
        particulas: 20,
        sombras: false,
        efectosLuz: false,
        fps: 30
    },
    media: {
        particulas: 35,
        sombras: true,
        efectosLuz: false,
        fps: 60
    },
    alta: {
        particulas: 50,
        sombras: true,
        efectosLuz: true,
        fps: 60
    }
};

// ========================================
// TEXTOS Y LOCALIZACIÓN
// ========================================

const textos = {
    es: {
        menuPrincipal: {
            continuar: "CONTINUAR",
            iniciarVuelo: "INICIAR VUELO",
            ajustes: "AJUSTES",
            creditos: "CRÉDITOS",
            salir: "SALIR"
        },
        gameplay: {
            pausado: "PAUSA",
            gameOver: "FIN DEL VUELO",
            nivelCompletado: "¡NIVEL COMPLETADO!",
            logroDesbloqueado: "¡LOGRO DESBLOQUEADO!"
        },
        hud: {
            vida: "Vida",
            energia: "Energía",
            migajas: "Migajas"
        }
    },
    en: {
        menuPrincipal: {
            continuar: "CONTINUE",
            iniciarVuelo: "START FLIGHT",
            ajustes: "SETTINGS",
            creditos: "CREDITS",
            salir: "EXIT"
        },
        gameplay: {
            pausado: "PAUSED",
            gameOver: "FLIGHT END",
            nivelCompletado: "LEVEL COMPLETE!",
            logroDesbloqueado: "ACHIEVEMENT UNLOCKED!"
        },
        hud: {
            vida: "Health",
            energia: "Energy",
            migajas: "Crumbs"
        }
    }
};

// ========================================
// CONSTANTES DEL JUEGO
// ========================================

const CONSTANTES = {
    FPS_TARGET: 60,
    GRAVEDAD_BASE: 0.8,
    FRICCION_SUELO: 0.85,
    FRICCION_AIRE: 0.98,
    VELOCIDAD_MAXIMA_CAIDA: 20,
    DISTANCIA_RENDER: 1500,
    MIGAJAS_POR_NIVEL: {
        facil: 50,
        media: 100,
        dificil: 200
    }
};

// ========================================
// DEBUGGING
// ========================================

const DEBUG = {
    activado: false, // Cambiar a true para modo debug
    mostrarColisiones: false,
    mostrarFPS: false,
    mostrarPosicion: false,
    invencible: false,
    energiaInfinita: false,
    todasHabilidades: false
};

// ========================================
// EXPORTAR TODO
// ========================================

// Para compatibilidad con versión antigua
if (typeof window !== 'undefined') {
    window.gameConfig = gameConfig;
    window.PALOMA_CONFIG = {
        game: gameConfig,
        player: playerConfig,
        enemies: enemiesConfig,
        items: itemsConfig,
        audio: audioConfig,
        niveles: nivelesConfig,
        controles: controlesDefault,
        calidad: calidadGraficaConfig,
        textos: textos,
        CONSTANTES: CONSTANTES,
        DEBUG: DEBUG
    };
}

console.log(`🕊️ ${gameConfig.nombre} ${gameConfig.version} - Configuración cargada`);
