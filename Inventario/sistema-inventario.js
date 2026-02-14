// ========================================
// SISTEMA DE INVENTARIO - PALOMA MIGAJERA
// ========================================

class Inventario {
    constructor() {
        this.items = this.cargarInventario();
        this.capacidadMax = 50;
        this.amuletos = [];
        this.amuletosEquipados = [];
        this.maxAmuletosEquipados = 3;
    }

    // ========================================
    // GESTIÓN BÁSICA
    // ========================================

    cargarInventario() {
        const saved = localStorage.getItem('paloma_inventario');
        return saved ? JSON.parse(saved) : {};
    }

    guardarInventario() {
        localStorage.setItem('paloma_inventario', JSON.stringify(this.items));
        localStorage.setItem('paloma_amuletos_equipados', JSON.stringify(this.amuletosEquipados));
    }

    agregarItem(itemId, cantidad = 1) {
        if (!this.items[itemId]) {
            this.items[itemId] = 0;
        }
        
        const espacioDisponible = this.capacidadMax - this.contarTotalItems();
        const cantidadReal = Math.min(cantidad, espacioDisponible);
        
        if (cantidadReal > 0) {
            this.items[itemId] += cantidadReal;
            this.guardarInventario();
            return cantidadReal;
        }
        
        return 0;
    }

    removerItem(itemId, cantidad = 1) {
        if (!this.items[itemId]) return false;
        
        if (this.items[itemId] >= cantidad) {
            this.items[itemId] -= cantidad;
            
            if (this.items[itemId] === 0) {
                delete this.items[itemId];
            }
            
            this.guardarInventario();
            return true;
        }
        
        return false;
    }

    tieneItem(itemId, cantidad = 1) {
        return this.items[itemId] >= cantidad;
    }

    contarItem(itemId) {
        return this.items[itemId] || 0;
    }

    contarTotalItems() {
        return Object.values(this.items).reduce((sum, val) => sum + val, 0);
    }

    // ========================================
    // CONSUMIBLES
    // ========================================

    usarConsumible(itemId) {
        if (!itemsConfig[itemId]) {
            console.error('Item no existe:', itemId);
            return false;
        }

        const item = itemsConfig[itemId];
        if (item.tipo !== 'consumible') {
            console.error('El item no es consumible');
            return false;
        }

        if (!this.tieneItem(itemId)) {
            console.error('No tienes este item');
            return false;
        }

        // Aplicar efecto
        let exito = false;

        switch(item.efecto) {
            case 'vida':
                if (playerStats.vidaActual < playerStats.vidaMax) {
                    playerStats.vidaActual = Math.min(
                        playerStats.vidaActual + item.valor,
                        playerStats.vidaMax
                    );
                    exito = true;
                }
                break;

            case 'energia':
                if (playerStats.energiaActual < playerStats.energiaMax) {
                    playerStats.energiaActual = Math.min(
                        playerStats.energiaActual + item.valor,
                        playerStats.energiaMax
                    );
                    exito = true;
                }
                break;

            case 'vida_completa':
                playerStats.vidaActual = playerStats.vidaMax;
                exito = true;
                break;

            case 'energia_completa':
                playerStats.energiaActual = playerStats.energiaMax;
                exito = true;
                break;
        }

        if (exito) {
            this.removerItem(itemId, 1);
            if (typeof actualizarHUD === 'function') {
                actualizarHUD();
            }
            return true;
        }

        return false;
    }

    // ========================================
    // AMULETOS (EQUIPABLES)
    // ========================================

    equiparAmuleto(itemId) {
        if (!itemsConfig[itemId]) {
            console.error('Amuleto no existe:', itemId);
            return false;
        }

        const item = itemsConfig[itemId];
        if (item.tipo !== 'amuleto') {
            console.error('El item no es un amuleto');
            return false;
        }

        if (!this.tieneItem(itemId)) {
            console.error('No tienes este amuleto');
            return false;
        }

        if (this.amuletosEquipados.includes(itemId)) {
            console.log('Este amuleto ya está equipado');
            return false;
        }

        if (this.amuletosEquipados.length >= this.maxAmuletosEquipados) {
            console.error('Máximo de amuletos equipados alcanzado');
            return false;
        }

        this.amuletosEquipados.push(itemId);
        this.aplicarEfectoAmuleto(itemId, true);
        this.guardarInventario();
        return true;
    }

    desequiparAmuleto(itemId) {
        const index = this.amuletosEquipados.indexOf(itemId);
        if (index === -1) {
            console.error('Este amuleto no está equipado');
            return false;
        }

        this.amuletosEquipados.splice(index, 1);
        this.aplicarEfectoAmuleto(itemId, false);
        this.guardarInventario();
        return true;
    }

    aplicarEfectoAmuleto(itemId, equipar) {
        const item = itemsConfig[itemId];
        const multiplicador = equipar ? 1 : -1;

        // Parsear y aplicar efectos
        const efecto = item.efecto;

        if (efecto.includes('vida_max')) {
            const match = efecto.match(/vida_max_\+(\d+)/);
            if (match) {
                playerStats.vidaMax += parseInt(match[1]) * multiplicador;
                if (equipar) {
                    playerStats.vidaActual = Math.min(playerStats.vidaActual, playerStats.vidaMax);
                }
            }
        }

        if (efecto.includes('energia_max')) {
            const match = efecto.match(/energia_max_\+(\d+)/);
            if (match) {
                playerStats.energiaMax += parseInt(match[1]) * multiplicador;
                if (equipar) {
                    playerStats.energiaActual = Math.min(playerStats.energiaActual, playerStats.energiaMax);
                }
            }
        }

        // Efectos especiales
        if (efecto === 'atrae_migajas') {
            window.ATRAE_MIGAJAS = equipar;
        }

        if (efecto === 'caida_rapida_inmune_viento') {
            window.CAIDA_RAPIDA = equipar;
            window.INMUNE_VIENTO = equipar;
        }

        if (efecto === 'npcs_generosos') {
            window.NPCS_GENEROSOS = equipar;
        }

        if (typeof actualizarHUD === 'function') {
            actualizarHUD();
        }
    }

    obtenerAmuletosEquipados() {
        return this.amuletosEquipados.map(id => ({
            id: id,
            ...itemsConfig[id]
        }));
    }

    // ========================================
    // INTERFAZ DE INVENTARIO
    // ========================================

    mostrarInventario() {
        const modal = document.createElement('div');
        modal.id = 'modal-inventario';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            z-index: 200;
            display: flex;
            justify-content: center;
            align-items: center;
        `;

        const contenido = document.createElement('div');
        contenido.style.cssText = `
            background: linear-gradient(135deg, rgba(20, 20, 30, 0.95), rgba(10, 10, 20, 0.95));
            border: 2px solid rgba(255, 255, 255, 0.2);
            border-radius: 10px;
            padding: 40px;
            max-width: 800px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            color: white;
        `;

        let html = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
                <h2 style="font-size: 2rem; letter-spacing: 4px; margin: 0;">INVENTARIO</h2>
                <span style="color: rgba(255,255,255,0.5);">${this.contarTotalItems()} / ${this.capacidadMax}</span>
            </div>
            
            <div style="margin-bottom: 30px;">
                <h3 style="font-size: 1.2rem; letter-spacing: 2px; margin-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 10px;">
                    CONSUMIBLES
                </h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 15px;">
        `;

        // Listar consumibles
        for (const [itemId, cantidad] of Object.entries(this.items)) {
            const item = itemsConfig[itemId];
            if (!item || item.tipo !== 'consumible') continue;

            html += `
                <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.2); padding: 15px; border-radius: 5px; text-align: center; cursor: pointer;" 
                     onclick="inventario.usarConsumible('${itemId}')">
                    <div style="font-size: 2rem; margin-bottom: 10px;">🍞</div>
                    <div style="font-size: 0.9rem; margin-bottom: 5px;">${item.nombre}</div>
                    <div style="color: rgba(255,255,255,0.5); font-size: 0.8rem;">x${cantidad}</div>
                </div>
            `;
        }

        html += `
                </div>
            </div>
            
            <div>
                <h3 style="font-size: 1.2rem; letter-spacing: 2px; margin-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 10px;">
                    AMULETOS EQUIPADOS (${this.amuletosEquipados.length}/${this.maxAmuletosEquipados})
                </h3>
                <div style="display: flex; gap: 15px; margin-bottom: 20px; flex-wrap: wrap;">
        `;

        // Amuletos equipados
        this.amuletosEquipados.forEach(itemId => {
            const item = itemsConfig[itemId];
            html += `
                <div style="background: rgba(255,215,0,0.1); border: 2px solid rgba(255,215,0,0.5); padding: 15px; border-radius: 5px; cursor: pointer;"
                     onclick="inventario.desequiparAmuleto('${itemId}')">
                    <div style="font-size: 1.5rem; margin-bottom: 5px;">🪶</div>
                    <div style="font-size: 0.85rem;">${item.nombre}</div>
                    <div style="color: rgba(255,215,0,0.7); font-size: 0.7rem; margin-top: 5px;">Click para desequipar</div>
                </div>
            `;
        });

        html += `
                </div>
                
                <h3 style="font-size: 1rem; letter-spacing: 2px; margin-bottom: 15px; opacity: 0.7;">
                    AMULETOS DISPONIBLES
                </h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px;">
        `;

        // Amuletos no equipados
        for (const [itemId, cantidad] of Object.entries(this.items)) {
            const item = itemsConfig[itemId];
            if (!item || item.tipo !== 'amuleto') continue;
            if (this.amuletosEquipados.includes(itemId)) continue;

            html += `
                <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.2); padding: 15px; border-radius: 5px; cursor: pointer;"
                     onclick="inventario.equiparAmuleto('${itemId}')">
                    <div style="font-size: 1.5rem; margin-bottom: 10px;">🪶</div>
                    <div style="font-size: 0.9rem; margin-bottom: 5px;">${item.nombre}</div>
                    <div style="color: rgba(255,255,255,0.5); font-size: 0.75rem; margin-bottom: 5px;">${item.descripcion}</div>
                    <div style="color: gold; font-size: 0.7rem;">${item.rareza.toUpperCase()}</div>
                </div>
            `;
        }

        html += `
                </div>
            </div>
            
            <button onclick="document.getElementById('modal-inventario').remove()" 
                    style="margin-top: 30px; padding: 12px 30px; background: rgba(255,255,255,0.1); border: 2px solid rgba(255,255,255,0.3); color: white; cursor: pointer; border-radius: 5px; font-size: 1rem; letter-spacing: 2px; width: 100%;">
                CERRAR INVENTARIO
            </button>
        `;

        contenido.innerHTML = html;
        modal.appendChild(contenido);
        document.body.appendChild(modal);
    }

    // ========================================
    // UTILIDADES
    // ========================================

    limpiarInventario() {
        this.items = {};
        this.amuletosEquipados.forEach(id => this.aplicarEfectoAmuleto(id, false));
        this.amuletosEquipados = [];
        this.guardarInventario();
    }

    exportarInventario() {
        return {
            items: this.items,
            amuletos: this.amuletosEquipados,
            fecha: new Date().toISOString()
        };
    }

    importarInventario(data) {
        this.items = data.items || {};
        this.amuletosEquipados = data.amuletos || [];
        this.amuletosEquipados.forEach(id => this.aplicarEfectoAmuleto(id, true));
        this.guardarInventario();
    }
}

// ========================================
// INSTANCIA GLOBAL
// ========================================

const inventario = new Inventario();

// Cargar amuletos equipados al iniciar
const amuletosGuardados = localStorage.getItem('paloma_amuletos_equipados');
if (amuletosGuardados) {
    inventario.amuletosEquipados = JSON.parse(amuletosGuardados);
    inventario.amuletosEquipados.forEach(id => inventario.aplicarEfectoAmuleto(id, true));
}

// ========================================
// ATAJO DE TECLADO
// ========================================

document.addEventListener('keydown', (e) => {
    if (e.code === 'KeyI' && !gameState?.pausado && !gameState?.cargando) {
        inventario.mostrarInventario();
    }
});

// ========================================
// EXPORTAR
// ========================================

window.PALOMA_INVENTARIO = inventario;

console.log('🎒 Sistema de inventario cargado');
