# ✨ Habilidades Esenciales: Paloma Migajera

Estas son las mecánicas núcleo que definen el flujo de movimiento y el combate de nuestra protagonista.

---

## 🦅 Movimiento Maestro: Doble Salto
*Inspirado en las "Alas de Monarca".*

| Atributo | Detalle |
| :--- | :--- |
| **Nombre Técnico** | `double_jump` / `monarch_flaps` |
| **Efecto** | Permite realizar un segundo impulso en el aire batiendo las alas con fuerza. |
| **Visual** | Una explosión de plumas blancas en píxel art y un destello de luz bajo las patas. |
| **Utilidad** | Acceso a cornisas altas, balcones y evasión de ataques rastreros. |

> *"El primer salto es instinto; el segundo es voluntad."*

---

## ☄️ Ataque Especial: ¡PALOMADUKEN!
*Tu técnica definitiva de larga distancia.*

| Atributo | Detalle |
| :--- | :--- |
| **Nombre Técnico** | `haduken_miga` |
| **Comando** | `↓ ↘ → + Ataque` (o botón dedicado en Alpha). |
| **Descripción** | La paloma concentra su energía interior y lanza una ráfaga de migas comprimidas a alta velocidad. |
| **Efecto** | Inflige daño moderado y tiene un ligero retroceso (*knockback*) que empuja a la paloma hacia atrás. |
| **Visual** | Un proyectil azulado con forma de ala que deja un rastro de partículas de pan dorado. |

---

## 🛠️ Implementación en el Código (`config.js`)

Para que estas habilidades funcionen en tu lógica de `Juego/`, asegúrate de tener estas variables listas:

```javascript
// Configuración de Habilidades Esenciales
export const ABILITIES = {
    DOUBLE_JUMP: {
        enabled: true,
        force: 8.5,        // Fuerza del segundo impulso
        unlocked: false    // Se desbloquea tras vencer al primer jefe
    },
    PALOMADUKEN: {
        enabled: true,
        damage: 15,
        energyCost: 20,    // Consume barra de "Miga-Energía"
        cooldown: 500      // Milisegundos entre disparos
    }
};
