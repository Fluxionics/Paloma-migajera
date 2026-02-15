// ========================================
// SISTEMA DE USUARIOS - PALOMA MIGAJERA
// ========================================

class SistemaUsuarios {
    constructor() {
        this.usuarioActual = null;
        this.usuarios = this.cargarUsuarios();
    }

    // ========================================
    // GESTIÓN DE USUARIOS
    // ========================================

    cargarUsuarios() {
        const saved = localStorage.getItem('paloma_usuarios');
        return saved ? JSON.parse(saved) : {};
    }

    guardarUsuarios() {
        localStorage.setItem('paloma_usuarios', JSON.stringify(this.usuarios));
    }

    crearUsuario(username, dificultad = 'normal') {
        if (this.usuarios[username]) {
            return { success: false, error: 'El usuario ya existe' };
        }

        if (username.length < 3 || username.length > 20) {
            return { success: false, error: 'El nombre debe tener entre 3 y 20 caracteres' };
        }

        const nuevoUsuario = {
            username: username,
            fechaCreacion: new Date().toISOString(),
            ultimoAcceso: new Date().toISOString(),
            
            // Configuración
            dificultad: dificultad,
            
            // Progreso
            mundoActual: 1,
            nivelActual: 1,
            checkpoint: { mundo: 1, nivel: 1, x: 150, y: 50 },
            
            // Estadísticas
            stats: {
                tiempoJugado: 0,
                muertes: 0,
                migajasRecolectadas: 0,
                enemigosD errotados: 0,
                saltosRealizados: 0,
                distanciaRecorrida: 0,
                palomadukensLanzados: 0,
                habilidadesUsadas: 0,
                secretosDescubiertos: 0,
                npcConocidos: 0,
                jefesVencidos: [],
                areasExploradas: [],
                mejorTiempo: null,
                rachaActual: 0,
                mejorRacha: 0
            },
            
            // Sistema
            vida: 100,
            vidaMax: 100,
            energia: 100,
            energiaMax: 100,
            
            // Inventario
            inventario: {},
            amuletos: [],
            amuletosEquipados: [],
            
            // Habilidades
            habilidades: {
                dobleSalto: false,
                dash: false,
                palomaduken: false,
                planeo: false,
                picado: false
            },
            
            // Logros
            logros: [],
            
            // Mundos
            mundos: {
                1: { desbloqueado: true, completado: false, tiempo: null, mejorTiempo: null },
                2: { desbloqueado: false, completado: false, tiempo: null, mejorTiempo: null },
                3: { desbloqueado: false, completado: false, tiempo: null, mejorTiempo: null },
                4: { desbloqueado: false, completado: false, tiempo: null, mejorTiempo: null },
                5: { desbloqueado: false, completado: false, tiempo: null, mejorTiempo: null }
            },
            
            // Configuración de dificultad
            configuracionDificultad: this.obtenerConfigDificultad(dificultad)
        };

        this.usuarios[username] = nuevoUsuario;
        this.guardarUsuarios();
        
        return { success: true, usuario: nuevoUsuario };
    }

    obtenerConfigDificultad(dificultad) {
        const configs = {
            'facil': {
                nombre: 'Fácil',
                descripcion: 'Para principiantes. Más vida, menos daño enemigo.',
                multiplicadorVida: 1.5,
                multiplicadorDanio: 0.5,
                multiplicadorEnemigos: 0.7,
                checkpointsAdicionales: true,
                ayudasVisuales: true,
                regeneracionVida: true,
                muertesPermanentes: false,
                multiplicadorRecompensas: 1.0
            },
            'normal': {
                nombre: 'Normal',
                descripcion: 'Experiencia balanceada. Recomendado para la mayoría.',
                multiplicadorVida: 1.0,
                multiplicadorDanio: 1.0,
                multiplicadorEnemigos: 1.0,
                checkpointsAdicionales: false,
                ayudasVisuales: true,
                regeneracionVida: false,
                muertesPermanentes: false,
                multiplicadorRecompensas: 1.2
            },
            'medio': {
                nombre: 'Medio',
                descripcion: 'Más desafiante. Enemigos más fuertes.',
                multiplicadorVida: 0.9,
                multiplicadorDanio: 1.2,
                multiplicadorEnemigos: 1.2,
                checkpointsAdicionales: false,
                ayudasVisuales: false,
                regeneracionVida: false,
                muertesPermanentes: false,
                multiplicadorRecompensas: 1.4
            },
            'dificil': {
                nombre: 'Difícil',
                descripcion: 'Para jugadores experimentados. Combate intenso.',
                multiplicadorVida: 0.75,
                multiplicadorDanio: 1.5,
                multiplicadorEnemigos: 1.5,
                checkpointsAdicionales: false,
                ayudasVisuales: false,
                regeneracionVida: false,
                muertesPermanentes: false,
                multiplicadorRecompensas: 1.6
            },
            'extremo': {
                nombre: 'Extremo',
                descripcion: '¡Un golpe y mueres! Sin checkpoints. Modo hardcore.',
                multiplicadorVida: 0.1, // Prácticamente 1 HP
                multiplicadorDanio: 10.0,
                multiplicadorEnemigos: 2.0,
                checkpointsAdicionales: false,
                ayudasVisuales: false,
                regeneracionVida: false,
                muertesPermanentes: true,
                multiplicadorRecompensas: 3.0
            },
            'pesadilla': {
                nombre: 'Pesadilla',
                descripcion: 'Solo para maestros. Todo está en tu contra.',
                multiplicadorVida: 0.5,
                multiplicadorDanio: 2.0,
                multiplicadorEnemigos: 2.5,
                checkpointsAdicionales: false,
                ayudasVisuales: false,
                regeneracionVida: false,
                muertesPermanentes: false,
                multiplicadorRecompensas: 2.0,
                enemigosExtra: true,
                bossesMasRapidos: true
            }
        };

        return configs[dificultad] || configs['normal'];
    }

    iniciarSesion(username) {
        if (!this.usuarios[username]) {
            return { success: false, error: 'Usuario no encontrado' };
        }

        this.usuarioActual = this.usuarios[username];
        this.usuarioActual.ultimoAcceso = new Date().toISOString();
        this.guardarUsuarios();
        
        localStorage.setItem('paloma_usuario_actual', username);
        
        return { success: true, usuario: this.usuarioActual };
    }

    cerrarSesion() {
        if (this.usuarioActual) {
            this.guardarProgreso();
        }
        this.usuarioActual = null;
        localStorage.removeItem('paloma_usuario_actual');
    }

    eliminarUsuario(username, confirmacion) {
        if (confirmacion !== username) {
            return { success: false, error: 'Confirmación incorrecta' };
        }

        delete this.usuarios[username];
        this.guardarUsuarios();
        
        if (this.usuarioActual && this.usuarioActual.username === username) {
            this.cerrarSesion();
        }
        
        return { success: true };
    }

    // ========================================
    // PROGRESO
    // ========================================

    guardarProgreso() {
        if (!this.usuarioActual) return;
        
        this.usuarios[this.usuarioActual.username] = this.usuarioActual;
        this.guardarUsuarios();
    }

    actualizarCheckpoint(mundo, nivel, x, y) {
        if (!this.usuarioActual) return;
        
        this.usuarioActual.checkpoint = { mundo, nivel, x, y };
        this.guardarProgreso();
    }

    // ========================================
    // MUERTE
    // ========================================

    registrarMuerte() {
        if (!this.usuarioActual) return;
        
        this.usuarioActual.stats.muertes++;
        this.usuarioActual.stats.rachaActual = 0;
        
        // Modo Extremo: Muerte permanente
        if (this.usuarioActual.configuracionDificultad.muertesPermanentes) {
            return this.muertePermamente();
        }
        
        // Modos normales: volver al checkpoint
        const cp = this.usuarioActual.checkpoint;
        this.guardarProgreso();
        
        return {
            tipo: 'checkpoint',
            checkpoint: cp
        };
    }

    muertePermamente() {
        const username = this.usuarioActual.username;
        const stats = { ...this.usuarioActual.stats };
        const tiempoTotal = stats.tiempoJugado;
        
        // Guardar en hall of fame si es bueno
        this.guardarEnHallOfFame(username, stats);
        
        // Eliminar usuario
        this.eliminarUsuario(username, username);
        
        return {
            tipo: 'permanente',
            mensaje: 'GAME OVER - Modo Extremo',
            stats: stats,
            tiempoSobrevivido: tiempoTotal
        };
    }

    guardarEnHallOfFame(username, stats) {
        let hallOfFame = JSON.parse(localStorage.getItem('paloma_hall_of_fame') || '[]');
        
        hallOfFame.push({
            username: username,
            fecha: new Date().toISOString(),
            tiempoSobrevivido: stats.tiempoJugado,
            migajas: stats.migajasRecolectadas,
            enemigos: stats.enemigosD errotados,
            mundoAlcanzado: this.usuarioActual.mundoActual,
            puntuacion: this.calcularPuntuacion(stats)
        });
        
        // Ordenar por puntuación
        hallOfFame.sort((a, b) => b.puntuacion - a.puntuacion);
        
        // Mantener solo top 50
        hallOfFame = hallOfFame.slice(0, 50);
        
        localStorage.setItem('paloma_hall_of_fame', JSON.stringify(hallOfFame));
    }

    calcularPuntuacion(stats) {
        return (
            stats.tiempoJugado * 10 +
            stats.migajasRecolectadas * 5 +
            stats.enemigosD errotados * 20 +
            stats.secretosDescubiertos * 50 +
            stats.jefesVencidos.length * 100
        );
    }

    // ========================================
    // EXPORTAR / IMPORTAR
    // ========================================

    exportarProgreso() {
        if (!this.usuarioActual) {
            return { success: false, error: 'No hay sesión activa' };
        }

        const datos = {
            version: '1.0',
            fecha: new Date().toISOString(),
            usuario: this.usuarioActual,
            verificacion: this.generarHashVerificacion(this.usuarioActual)
        };

        const json = JSON.stringify(datos, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `paloma_${this.usuarioActual.username}_${Date.now()}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
        
        return { success: true };
    }

    exportarTodosLosUsuarios() {
        const datos = {
            version: '1.0',
            fecha: new Date().toISOString(),
            usuarios: this.usuarios,
            verificacion: this.generarHashVerificacion(this.usuarios)
        };

        const json = JSON.stringify(datos, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `paloma_todos_usuarios_${Date.now()}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
        
        return { success: true };
    }

    async importarProgreso(file) {
        try {
            const text = await file.text();
            const datos = JSON.parse(text);
            
            // Verificar versión
            if (datos.version !== '1.0') {
                return { success: false, error: 'Versión incompatible' };
            }
            
            // Verificar integridad
            const hashEsperado = datos.verificacion;
            const hashActual = this.generarHashVerificacion(datos.usuario || datos.usuarios);
            
            if (hashEsperado !== hashActual) {
                return { success: false, error: 'Archivo corrupto o modificado' };
            }
            
            // Importar
            if (datos.usuario) {
                // Un solo usuario
                const username = datos.usuario.username;
                this.usuarios[username] = datos.usuario;
                this.guardarUsuarios();
                return { success: true, tipo: 'usuario', username: username };
            } else if (datos.usuarios) {
                // Múltiples usuarios
                this.usuarios = { ...this.usuarios, ...datos.usuarios };
                this.guardarUsuarios();
                return { success: true, tipo: 'multiples', count: Object.keys(datos.usuarios).length };
            }
            
            return { success: false, error: 'Formato inválido' };
            
        } catch (error) {
            return { success: false, error: 'Error al leer el archivo: ' + error.message };
        }
    }

    generarHashVerificacion(objeto) {
        // Simple hash para verificación (no es criptográfico)
        const str = JSON.stringify(objeto);
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString(36);
    }

    // ========================================
    // ESTADÍSTICAS
    // ========================================

    actualizarEstadistica(nombre, valor) {
        if (!this.usuarioActual) return;
        
        if (typeof this.usuarioActual.stats[nombre] === 'number') {
            this.usuarioActual.stats[nombre] += valor;
        } else if (Array.isArray(this.usuarioActual.stats[nombre])) {
            if (!this.usuarioActual.stats[nombre].includes(valor)) {
                this.usuarioActual.stats[nombre].push(valor);
            }
        }
        
        this.guardarProgreso();
    }

    obtenerEstadisticas() {
        return this.usuarioActual ? this.usuarioActual.stats : null;
    }

    // ========================================
    // MUNDOS
    // ========================================

    desbloquearMundo(numero) {
        if (!this.usuarioActual) return;
        
        if (this.usuarioActual.mundos[numero]) {
            this.usuarioActual.mundos[numero].desbloqueado = true;
            this.guardarProgreso();
        }
    }

    completarMundo(numero, tiempo) {
        if (!this.usuarioActual) return;
        
        if (this.usuarioActual.mundos[numero]) {
            this.usuarioActual.mundos[numero].completado = true;
            this.usuarioActual.mundos[numero].tiempo = tiempo;
            
            // Actualizar mejor tiempo
            if (!this.usuarioActual.mundos[numero].mejorTiempo || 
                tiempo < this.usuarioActual.mundos[numero].mejorTiempo) {
                this.usuarioActual.mundos[numero].mejorTiempo = tiempo;
            }
            
            // Desbloquear siguiente mundo
            if (this.usuarioActual.mundos[numero + 1]) {
                this.desbloquearMundo(numero + 1);
            }
            
            this.guardarProgreso();
        }
    }

    obtenerMundos() {
        return this.usuarioActual ? this.usuarioActual.mundos : null;
    }

    // ========================================
    // UTILIDADES
    // ========================================

    obtenerRanking() {
        const usuarios = Object.values(this.usuarios);
        
        return usuarios
            .map(u => ({
                username: u.username,
                puntuacion: this.calcularPuntuacion(u.stats),
                migajas: u.stats.migajasRecolectadas,
                enemigos: u.stats.enemigosD errotados,
                tiempo: u.stats.tiempoJugado,
                mundoActual: u.mundoActual,
                dificultad: u.dificultad
            }))
            .sort((a, b) => b.puntuacion - a.puntuacion);
    }

    obtenerHallOfFame() {
        return JSON.parse(localStorage.getItem('paloma_hall_of_fame') || '[]');
    }

    cambiarDificultad(nuevaDificultad) {
        if (!this.usuarioActual) return { success: false };
        
        this.usuarioActual.dificultad = nuevaDificultad;
        this.usuarioActual.configuracionDificultad = this.obtenerConfigDificultad(nuevaDificultad);
        
        // Ajustar vida según dificultad
        const multi = this.usuarioActual.configuracionDificultad.multiplicadorVida;
        this.usuarioActual.vidaMax = Math.floor(100 * multi);
        this.usuarioActual.vida = this.usuarioActual.vidaMax;
        
        this.guardarProgreso();
        
        return { success: true };
    }
}

// ========================================
// INSTANCIA GLOBAL
// ========================================

const sistemaUsuarios = new SistemaUsuarios();

// Auto-login si hay sesión guardada
const savedUser = localStorage.getItem('paloma_usuario_actual');
if (savedUser && sistemaUsuarios.usuarios[savedUser]) {
    sistemaUsuarios.iniciarSesion(savedUser);
}

// Exportar
window.PALOMA_USUARIOS = sistemaUsuarios;

console.log('👤 Sistema de usuarios cargado');
