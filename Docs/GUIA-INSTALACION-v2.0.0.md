# 🚀 GUÍA DE INSTALACIÓN - PALOMA MIGAJERA v2.0

## ⚡ INSTALACIÓN RÁPIDA (5 MINUTOS)

### PASO 1: Descargar el Proyecto
```
1. Descarga la carpeta completa "Paloma-Migajera-COMPLETO"
2. Descomprime si está en ZIP
3. Coloca la carpeta donde quieras (Escritorio, Documentos, etc.)
```

### PASO 2: Abrir el Juego
```
Opción A - Con navegador directamente:
1. Abre la carpeta
2. Doble click en "index.html"
3. ¡Listo! El juego se abre

Opción B - Con Live Server (Recomendado):
1. Abre la carpeta en VS Code
2. Click derecho en "index.html"
3. "Open with Live Server"
4. ¡Listo!
```

### PASO 3: Crear Tu Usuario
```
1. Se abre la pantalla de selección de usuario
2. Click en "NUEVO USUARIO"
3. Escribe tu nombre (3-20 caracteres)
4. Selecciona dificultad (empieza con NORMAL)
5. Click "CREAR USUARIO"
6. ¡Ya puedes jugar!
```

---

## 📁 ESTRUCTURA DE ARCHIVOS

```
Paloma-Migajera-COMPLETO/
│
├── index.html ⭐ ← ABRIR ESTE ARCHIVO
├── seleccion-usuario.html
├── sistema-usuarios.js
├── style-usuarios.css
├── config.js
│
├── Menu Principal/
│   ├── index.html
│   ├── style.css
│   └── fondo.jpg
│
├── Juego/
│   ├── index.html (selección de mundos)
│   ├── style-juego.css
│   ├── fondo.jpg
│   └── Gameplay/
│       ├── index.html
│       ├── gameplay.css
│       ├── gameplay-completo.js
│       ├── fondo.jpg
│       ├── terreno_visual.jpg
│       ├── terreno_colision.jpg
│       ├── paloma.jpg
│       ├── Caminando.gif
│       ├── Descanso.gif
│       └── Visualisando_Mapa.gif
│
├── Ajustes/
│   └── (archivos de configuración)
│
├── Logros/
│   └── (sistema de logros)
│
├── Docs/
│   ├── GUIA-INSTALACION.md ← ESTE ARCHIVO
│   └── NUEVO-SISTEMA-README.md
│
└── ... (otros archivos)
```

---

## ✅ VERIFICAR QUE TODO FUNCIONA

### Checklist Básico:

- [ ] **index.html** abre sin errores
- [ ] Se ve la pantalla de selección de usuario
- [ ] Puedes crear un nuevo usuario
- [ ] Los nombres de 3-20 caracteres funcionan
- [ ] Puedes seleccionar dificultad
- [ ] El usuario se crea correctamente
- [ ] Aparece tu perfil con estadísticas
- [ ] Puedes hacer click en "JUGAR"
- [ ] Se abre selección de mundos
- [ ] Mundo 1 está desbloqueado
- [ ] Click en "JUGAR" del mundo 1
- [ ] Se carga el gameplay
- [ ] Se ve el HUD (vida, energía, migajas)
- [ ] Puedes mover la paloma (A/D o flechas)
- [ ] Puedes saltar (ESPACIO o W)
- [ ] ESC abre el menú de pausa

### Si TODO está ✅: ¡Funciona perfectamente!

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### Problema 1: "No se carga nada / Pantalla en blanco"
**Solución:**
```
1. Abre la consola del navegador (F12)
2. Ve a la pestaña "Console"
3. Si ves errores rojos:
   - Verifica que todos los archivos estén en su lugar
   - Usa Live Server en VS Code
   - No abras el HTML directamente en algunos navegadores
```

### Problema 2: "Las imágenes no se ven"
**Solución:**
```
1. Verifica que los archivos de imagen estén en:
   - Menu Principal/fondo.jpg
   - Juego/fondo.jpg
   - Juego/Gameplay/*.jpg y *.gif

2. Si faltan imágenes:
   - El juego funciona igual
   - Solo se verán fondos negros
   - Puedes agregar tus imágenes después
```

### Problema 3: "No puedo crear usuario"
**Solución:**
```
1. Verifica que el nombre tenga 3-20 caracteres
2. No uses caracteres especiales raros
3. Abre consola (F12) y busca errores
4. Intenta con un nombre simple como "test"
```

### Problema 4: "No guarda mi progreso"
**Solución:**
```
1. Verifica que localStorage esté habilitado
2. No uses modo incógnito
3. Da permisos al navegador si pregunta
4. Prueba con otro navegador (Chrome, Firefox, Edge)
```

### Problema 5: "El gameplay no carga"
**Solución:**
```
1. Verifica que sistema-usuarios.js esté cargado
2. Asegúrate de haber creado un usuario primero
3. Ve a la consola y busca: "Gameplay cargado"
4. Si no aparece, revisa que todos los .js estén presentes
```

---

## 🎮 CÓMO JUGAR

### Controles Básicos:
```
A o ← = Mover izquierda
D o → = Mover derecha
ESPACIO o W o ↑ = Saltar
M = Abrir/Cerrar mapa
ESC = Pausa
```

### Flujo del Juego:
```
1. Inicio → Selección de Usuario
2. Crear/Seleccionar Usuario → Ver Perfil
3. Click "JUGAR" → Selección de Mundos
4. Click "JUGAR" en un mundo → Gameplay
5. ESC → Pausar → Guardar y Salir
```

---

## 💾 EXPORTAR / IMPORTAR

### Para hacer Backup:
```
1. Entra a tu perfil de usuario
2. Click en "💾 EXPORTAR PROGRESO"
3. Se descarga: paloma_[usuario]_[fecha].json
4. Guarda este archivo en lugar seguro
```

### Para Importar:
```
1. Menú principal → "IMPORTAR PROGRESO"
2. Arrastra el archivo .json
   O
   Click en la zona y selecciona el archivo
3. Confirma la importación
4. ¡Listo! Usuario restaurado
```

---

## 🎯 CARACTERÍSTICAS PRINCIPALES

### ✅ Lo que YA funciona:
- Sistema completo de usuarios
- 6 niveles de dificultad
- 5 mundos (progresión)
- Estadísticas detalladas
- Exportar/Importar progreso
- Ranking y Hall of Fame
- HUD completo (vida, energía, migajas)
- Sistema de pausa
- Checkpoints
- Muerte y respawn
- Auto-guardado cada 60s
- Modo Extremo (muerte permanente)

### 🔧 Lo que falta agregar (por tu equipo):
- Mapas de los 5 mundos (imágenes)
- Enemigos (código básico está)
- NPCs (estructura lista)
- Audio (sistema preparado)
- Más habilidades (Palomaduken, Dash, etc.)
- Jefes de cada mundo
- Más animaciones

---

## 🚀 PRÓXIMOS PASOS

### Para el Equipo:

**1. PROBAR TODO (HOY):**
```
- Cada miembro crea su usuario
- Prueban diferentes dificultades
- Intentan exportar/importar
- Verifican que guarda bien
- Reportan bugs
```

**2. CREAR MAPAS (ESTA SEMANA):**
```
- Usar IA (Leonardo.ai, Bing, etc.)
- Generar fondos de los 5 mundos
- Generar terrenos visuales
- Crear colisiones en Photopea
- Reemplazar las imágenes placeholder
```

**3. AGREGAR CONTENIDO (PRÓXIMAS 2 SEMANAS):**
```
- Enemigos básicos
- NPCs
- Habilidades
- Migajas en el mapa
- Checkpoints estratégicos
```

**4. AUDIO (CUANDO ESTÉ LISTO):**
```
- Generar música con Suno AI
- Efectos con ElevenLabs/ChipTone
- Descomentar código de audio
- Poner archivos en carpeta /audio/
```

---

## 📊 DIFICULTADES EXPLICADAS

### 😊 FÁCIL (Principiantes):
- Vida: 150 HP (+50%)
- Daño recibido: 50% (-50%)
- Enemigos: 70% (-30%)
- Regeneración de vida activa
- Checkpoints extra
- Perfecto para aprender

### 😐 NORMAL (Recomendado):
- Vida: 100 HP
- Daño recibido: 100%
- Enemigos: 100%
- Experiencia balanceada
- Para la mayoría de jugadores

### 😬 MEDIO (Desafiante):
- Vida: 90 HP (-10%)
- Daño recibido: 120% (+20%)
- Enemigos: 120% (+20%)
- Más intenso

### 😰 DIFÍCIL (Expertos):
- Vida: 75 HP (-25%)
- Daño recibido: 150% (+50%)
- Enemigos: 150% (+50%)
- Solo para experimentados

### 💀 EXTREMO (Hardcore):
- Vida: 10 HP (prácticamente 1 golpe)
- Daño recibido: 1000%
- Enemigos: 200%
- ⚠️ **MUERTE PERMANENTE**
- Si mueres, pierdes el usuario
- Entras al Hall of Fame
- Recompensas x3

### 👹 PESADILLA (Maestros):
- Vida: 50 HP
- Daño recibido: 200%
- Enemigos: 250%
- Enemigos extra
- Jefes más rápidos
- Solo para verdaderos maestros

---

## 💡 CONSEJOS

### Para Jugadores:
```
1. Empieza con dificultad NORMAL
2. Exporta tu progreso regularmente
3. NO juegues EXTREMO sin exportar primero
4. Usa los checkpoints estratégicamente
5. Recolecta todas las migajas que veas
```

### Para Desarrolladores:
```
1. Todos los sistemas están en sistema-usuarios.js
2. El gameplay está en gameplay-completo.js
3. Para agregar features, revisa esos archivos
4. Hay comentarios explicando cada función
5. console.log() es tu amigo para debugging
```

---

## 🎨 PERSONALIZACIÓN

### Cambiar Colores del HUD:
```css
/* En gameplay.css, busca: */
.vida-fill {
    background: linear-gradient(90deg, #ff4444, #ff6666);
    /* Cambia los colores a tu gusto */
}
```

### Agregar Más Mundos:
```javascript
// En sistema-usuarios.js, función crearUsuario()
mundos: {
    1: { desbloqueado: true, completado: false },
    // ... hasta 5
    6: { desbloqueado: false, completado: false }, // NUEVO
}
```

### Ajustar Dificultades:
```javascript
// En sistema-usuarios.js, función obtenerConfigDificultad()
'facil': {
    multiplicadorVida: 2.0, // Cambia valores
    multiplicadorDanio: 0.3,
    // ...
}
```

---

## 📞 SOPORTE

### Si tienes problemas:
1. Revisa esta guía completa
2. Abre la consola del navegador (F12)
3. Busca mensajes de error
4. Verifica que todos los archivos estén presentes
5. Prueba con Live Server en VS Code
6. Intenta otro navegador

### Archivos Críticos:
- ✅ index.html (entrada principal)
- ✅ sistema-usuarios.js (corazón del sistema)
- ✅ gameplay-completo.js (lógica del juego)
- ✅ Todos los .jpg y .gif en /Juego/Gameplay/

### Si algo falta:
- El juego aún funciona
- Puede verse diferente
- Pero la lógica está completa

---

## ✨ ¡YA ESTÁ TODO LISTO!

### Resumen Final:
- ✅ Sistema de usuarios completo
- ✅ 6 dificultades funcionando
- ✅ 5 mundos estructurados
- ✅ Estadísticas completas
- ✅ Exportar/Importar
- ✅ Ranking y Hall of Fame
- ✅ Gameplay funcional
- ✅ HUD y controles
- ✅ Sistema de muerte
- ✅ Auto-guardado

### Solo necesitas:
- 🎨 Agregar tus mapas (imágenes)
- 🎵 Agregar audio (cuando lo tengas)
- 👾 Desarrollar contenido (enemigos, NPCs)
- ✨ Pulir detalles

**¡El sistema base está 100% funcional!** 🎉

---

## 🎮 ¡A JUGAR!

1. Abre **index.html**
2. Crea tu usuario
3. Selecciona dificultad
4. ¡Empieza tu aventura como Paloma Migajera!

**¡Que disfrutes el juego!** 🕊️

---

**Versión:** 2.0 Completa
**Fecha:** Febrero 2024
**Estado:** ✅ 100% Funcional
