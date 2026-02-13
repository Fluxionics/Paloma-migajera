
# ✨ Habilidades y Poderes: Paloma Migajera

Las habilidades se dividen en **Maniobras de Vuelo** (movimiento) y **Cantos del Viento** (ataque/utilidad).

---

## 🦅 Maniobras de Vuelo (Movimiento)
*Esenciales para alcanzar nuevas cornisas y esquivar peligros urbanos.*

| Habilidad | Nombre Técnico | Descripción | Desbloqueo |
| :--- | :--- | :--- | :--- |
| **Impulso de Pluma** | `dash_air` | Un rápido desplazamiento lateral en el aire. | Encontrado en el *Nido del Halcón*. |
| **Ascenso Térmico** | `double_jump` | Aprovecha una corriente de aire para elevarte una segunda vez. | Tras derrotar al *Cuervo de la Chimenea*. |
| **Picado Balístico** | `ground_pound` | Cae a gran velocidad para romper maderas podridas o suelos débiles. | En las *Alcantarillas de Migas*. |
| **Planeo Silencioso** | `glide_mode` | Manten el botón de salto para descender lentamente y evitar ruidos. | Regalo de la *Lechuza Sabia*. |

---

## 🎶 Cantos del Viento (Habilidades Activas)
*Consumen "Migajas de Energía" para ejecutarse.*

### 🔊 Arpegio de Choque
Lanza una onda sonora con el pico que aturde a los enemigos pequeños (gatos o ratas) y activa interruptores lejanos.
> *Costo: 15 de Energía.*

### 🛡️ Escudo de Plumón
Crea un torbellino temporal de plumas a tu alrededor que bloquea proyectiles durante 2 segundos.
> *Costo: 25 de Energía.*

### ⚡ Rayo de Migaja
Concentra toda tu energía en un picotazo frontal devastador que atraviesa armaduras.
> *Costo: 40 de Energía.*

---

## 🧩 Sistema de Amuletos (Plumas de Poder)
Al igual que los amuletos de *Hollow Knight*, puedes equipar plumas especiales encontradas en el mundo:

* **Pluma de Plomo:** Caes más rápido pero eres inmune al empuje del viento fuerte.
* **Miga Imán:** Atraes las migajas cercanas automáticamente hacia ti.
* **Corazón de Gorrión:** Aumenta tu vida máxima en 1 punto, pero reduce tu velocidad de planeo.
* **Canto de Ciudad:** Los NPCs humanos te tiran más migajas de lo normal.

---

## 🛠️ Implementación en `config.js`
Para activar o desactivar estas habilidades durante las pruebas, añade este objeto a tu archivo de configuración:

```javascript
const PLAYER_ABILITIES = {
    canDash: true,
    canDoubleJump: false,
    canDive: false,
    energyMax: 100,
    currentPower: 'Arpegio de Choque'
};


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
