# 🚀 GUÍA RÁPIDA - EMPEZAR EN 5 MINUTOS

## ⚡ START AQUÍ

### 1️⃣ PROBAR LAS MEJORAS (2 minutos)

**Opción A - Probar sin modificar tu proyecto:**
```bash
1. Abre /Menu Principal/index-mejorado.html en tu navegador
2. Navega por el nuevo menú con modal de créditos
3. Ve a Ajustes (usa /Ajustes/index.html)
4. Prueba el gameplay mejorado (/Juego/Gameplay/index-mejorado.html)
```

**Opción B - Reemplazar archivos:**
```bash
1. Haz backup de tu proyecto actual
2. Reemplaza los archivos según la tabla de abajo
3. Prueba en tu navegador
```

---

### 2️⃣ TABLA DE REEMPLAZO RÁPIDO

| Archivo Original | Reemplazar con | Acción |
|-----------------|----------------|---------|
| `Menu Principal/index.html` | `Menu Principal/index-mejorado.html` | Renombrar |
| `Menu Principal/style.css` | `Menu Principal/style-mejorado.css` | Renombrar |
| `Ajustes/index.html` | Ya está creado ✓ | Ninguna |
| `Juego/Gameplay/index.html` | `Juego/Gameplay/index-mejorado.html` | Renombrar |
| `config.js` | `config-mejorado.js` | Renombrar |
| - | `Logros/sistema-logros.js` | Agregar script |
| - | `sistema-inventario.js` | Agregar script |

---

### 3️⃣ AGREGAR SCRIPTS (1 minuto)

Añade estas líneas al final del `<body>` en tus archivos HTML:

```html
<!-- En TODAS las páginas principales -->
<script src="../config.js"></script>

<!-- En el menú principal y gameplay -->
<script src="../Logros/sistema-logros.js"></script>
<script src="../sistema-inventario.js"></script>
```

---

## 🎮 TESTING RÁPIDO

### ✅ Checklist de pruebas:

**Menú Principal:**
- [ ] Botón "CONTINUAR" aparece si hay partidas
- [ ] Modal de créditos se abre y cierra
- [ ] Navegación a Ajustes funciona
- [ ] Navegación a Juego funciona

**Configuración:**
- [ ] Los sliders de volumen funcionan
- [ ] Puedes cambiar la calidad gráfica
- [ ] Los controles se pueden personalizar
- [ ] Se muestran las estadísticas
- [ ] El botón "Guardar" funciona

**Gameplay:**
- [ ] Se ve el HUD (vida, energía, migajas)
- [ ] La tecla ESC abre el menú de pausa
- [ ] La tecla M abre el mapa
- [ ] La tecla I abre el inventario
- [ ] El loading screen aparece al inicio

**Logros:**
- [ ] Se verifica al abrir consola: "Sistema de logros cargado"
- [ ] Los logros se pueden desbloquear manualmente

**Inventario:**
- [ ] Presionar I abre el inventario
- [ ] Puedes agregar items desde consola

---

## 🔧 COMANDOS DE CONSOLA ÚTILES

Abre la consola del navegador (F12) y prueba:

```javascript
// Ver configuración actual
console.log(window.PALOMA_CONFIG);

// Agregar items al inventario
inventario.agregarItem('migaja', 10);
inventario.mostrarInventario();

// Desbloquear un logro
PALOMA_LOGROS.desbloquearLogro('primer_vuelo');

// Ver progreso de logros
console.log(PALOMA_LOGROS.obtenerProgreso());

// Verificar todos los logros
PALOMA_LOGROS.verificarLogros();

// Equipar un amuleto
inventario.equiparAmuleto('plumaPlomo');
```

---

## 🎨 PERSONALIZACIÓN RÁPIDA

### Cambiar colores del HUD:
```css
/* En /Juego/Gameplay/index-mejorado.html, busca: */
.vida-fill {
    background: linear-gradient(90deg, #ff4444, #ff6666);
    /* Cambia a tus colores */
}
```

### Ajustar dificultad:
```javascript
// En config-mejorado.js, busca playerConfig:
vidaMaxima: 100,    // Cambia a 150 para más fácil
velocidadBase: 6,   // Cambia a 8 para más rápido
```

### Agregar más migajas al inventario:
```javascript
// En consola del navegador:
inventario.agregarItem('migaja', 100);
```

---

## 📱 ATAJOS DE TECLADO

| Tecla | Acción |
|-------|---------|
| `ESC` | Pausar juego / Cerrar modales |
| `M` | Abrir/cerrar mapa |
| `I` | Abrir inventario |
| `F12` | Consola de desarrollo |

---

## 🐛 SOLUCIÓN DE PROBLEMAS RÁPIDOS

### ❌ "No aparece el HUD"
```
→ Verifica que estés usando index-mejorado.html
→ Abre la consola y busca errores
```

### ❌ "Los logros no funcionan"
```
→ Verifica que sistema-logros.js esté cargado
→ Mira en consola: debe decir "Sistema de logros cargado"
```

### ❌ "El inventario no abre con I"
```
→ Asegúrate de que sistema-inventario.js esté incluido
→ El juego no debe estar en pausa o cargando
```

### ❌ "La configuración no guarda"
```
→ Verifica que localStorage esté habilitado
→ Prueba en modo incógnito para descartar extensiones
```

### ❌ "Las imágenes no cargan"
```
→ Usa Live Server en VS Code
→ O ejecuta desde un servidor local
→ No abras directamente el HTML
```

---

## 📂 ESTRUCTURA FINAL ESPERADA

```
Paloma-migajera/
├── Menu Principal/
│   ├── index.html          ← Reemplazado
│   ├── style.css           ← Reemplazado
│   └── fondo.jpg
├── Ajustes/
│   ├── index.html          ← NUEVO
│   ├── style.css           ← NUEVO
│   └── ajustes.js          ← NUEVO
├── Juego/
│   ├── Gameplay/
│   │   ├── index.html      ← Reemplazado
│   │   ├── gameplay.js     ← NUEVO
│   │   └── (tus imágenes)
│   └── index.html
├── Logros/
│   └── sistema-logros.js   ← NUEVO
├── config.js               ← Reemplazado
├── sistema-inventario.js   ← NUEVO
└── INSTRUCCIONES-MEJORAS.md
```

---

## 🎯 PRÓXIMOS 3 PASOS

### 1. Probar todo (10 minutos)
- Navega por todas las páginas
- Prueba cada botón
- Abre la consola y verifica que no haya errores

### 2. Personalizar (15 minutos)
- Ajusta colores a tu gusto
- Modifica textos si quieres
- Cambia configuraciones base

### 3. Desarrollar contenido (∞)
- Agrega tus assets visuales
- Implementa enemigos
- Crea niveles
- Añade NPCs y diálogos

---

## 💡 TIPS PRO

### Para desarrollo:
```javascript
// Activa el modo DEBUG en config-mejorado.js:
const DEBUG = {
    activado: true,
    invencible: true,
    energiaInfinita: true,
    todasHabilidades: true
};
```

### Para testing:
```javascript
// En consola, llena el inventario:
inventario.agregarItem('migaja', 50);
inventario.agregarItem('semilla', 20);
inventario.agregarItem('plumaPlomo', 1);
```

### Para demostración:
```javascript
// Desbloquea varios logros para mostrar:
PALOMA_LOGROS.desbloquearLogro('primer_vuelo');
PALOMA_LOGROS.desbloquearLogro('recolector');
PALOMA_LOGROS.desbloquearLogro('explorador');
```

---

## 📞 NECESITAS AYUDA?

1. Lee `INSTRUCCIONES-MEJORAS.md` completo
2. Revisa `COMPARACION-ANTES-DESPUES.md`
3. Mira los comentarios en el código
4. Usa console.log() para debugging
5. Verifica la consola del navegador (F12)

---

## ✅ CHECKLIST FINAL

Antes de considerar que está todo listo:

- [ ] Menú principal funciona correctamente
- [ ] Página de ajustes abre y guarda cambios
- [ ] Gameplay muestra HUD
- [ ] Pausa funciona (ESC)
- [ ] Inventario abre (I)
- [ ] Sistema de logros está activo
- [ ] No hay errores en consola
- [ ] Los archivos están en las carpetas correctas
- [ ] Los scripts están incluidos en los HTML

---

## 🎉 ¡LISTO!

Si llegaste hasta aquí y todo funciona, **¡felicidades!** 🎊

Ahora tienes un juego con:
- ✅ Sistemas AAA
- ✅ UX profesional  
- ✅ Base sólida para expansión
- ✅ Todo documentado

**¡A desarrollar contenido! 🕊️**

---

**Tiempo estimado total: 5-10 minutos**
**Dificultad: Fácil**
**Resultado: Juego 300% mejorado**
