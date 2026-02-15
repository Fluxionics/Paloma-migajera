# 🕊️ PALOMA MIGAJERA - SISTEMA COMPLETO v2.0

## 🎉 NUEVAS CARACTERÍSTICAS IMPLEMENTADAS

### ✅ TODO LO QUE SE AGREGÓ:

---

## 1. 👤 SISTEMA DE USUARIOS COMPLETO

### **Características:**
- ✅ Múltiples perfiles de usuario
- ✅ Cada usuario tiene su propio progreso independiente
- ✅ Creación ilimitada de usuarios
- ✅ Login/Logout seguro
- ✅ Eliminación de usuarios con confirmación

### **Archivos:**
```
- seleccion-usuario.html (Interfaz principal)
- sistema-usuarios.js (Lógica del sistema)
- style-usuarios.css (Estilos)
```

---

## 2. 🎮 6 NIVELES DE DIFICULTAD

### **Dificultades disponibles:**

#### 😊 **FÁCIL**
- Vida: 150% (+50%)
- Daño recibido: 50% (-50%)
- Enemigos: 70% (-30%)
- ✅ Checkpoints adicionales
- ✅ Regeneración de vida
- ✅ Ayudas visuales

#### 😐 **NORMAL** (Recomendado)
- Vida: 100%
- Daño: 100%
- Enemigos: 100%
- ✅ Experiencia balanceada
- Recompensas: 120%

#### 😬 **MEDIO**
- Vida: 90%
- Daño recibido: 120% (+20%)
- Enemigos: 120% (+20%)
- Recompensas: 140%

#### 😰 **DIFÍCIL**
- Vida: 75%
- Daño recibido: 150% (+50%)
- Enemigos: 150% (+50%)
- ❌ Sin ayudas visuales
- Recompensas: 160%

#### 💀 **EXTREMO** (Hardcore)
- Vida: 10% (prácticamente 1 HP)
- Daño recibido: 1000% (un golpe = muerte)
- Enemigos: 200% (el doble)
- ⚠️ **MUERTE PERMANENTE** - Si mueres, pierdes el usuario
- Recompensas: 300%
- 🏆 Entra al Hall of Fame

#### 👹 **PESADILLA**
- Vida: 50%
- Daño recibido: 200%
- Enemigos: 250%
- ✅ Enemigos extra
- ✅ Jefes más rápidos
- Recompensas: 200%

---

## 3. 🗺️ SISTEMA DE MUNDOS SEPARADOS

### **5 Mundos Diferentes:**

```
Mundo 1: El Despertar (Tutorial)
Mundo 2: Calles de la Ciudad
Mundo 3: El Parque Central
Mundo 4: Los Techos
Mundo 5: Las Alcantarillas
```

### **Características:**
- ✅ Progresión lineal (desbloquea al completar anterior)
- ✅ Registro de mejor tiempo por mundo
- ✅ Estado de completado
- ✅ Interfaz visual de selección

---

## 4. 📊 ESTADÍSTICAS COMPLETAS

Cada usuario tiene tracking de:

- ⏱️ **Tiempo jugado** (minutos)
- 💀 **Muertes totales**
- 🍞 **Migajas recolectadas**
- ⚔️ **Enemigos derrotados**
- 🦘 **Saltos realizados**
- 📏 **Distancia recorrida** (metros)
- 💥 **Palomadukens lanzados**
- ✨ **Habilidades usadas**
- 🔍 **Secretos descubiertos**
- 👥 **NPCs conocidos**
- 🏆 **Jefes vencidos**
- 🗺️ **Áreas exploradas**
- 🔥 **Racha actual** (sin morir)
- 📈 **Mejor racha**

---

## 5. 💾 EXPORTAR / IMPORTAR PROGRESO

### **Exportar:**
- 📥 Usuario individual (archivo JSON)
- 📦 Todos los usuarios (backup completo)
- ✅ Verificación de integridad
- ✅ Fecha y versión incluidas

### **Importar:**
- 📤 Arrastra y suelta archivos
- ✅ Validación automática
- ✅ Protección contra corrupción
- ⚠️ Aviso si sobrescribe usuarios existentes

### **Formato del archivo:**
```json
{
  "version": "1.0",
  "fecha": "2024-02-14T...",
  "usuario": { ... },
  "verificacion": "hash"
}
```

---

## 6. 🏆 RANKING Y HALL OF FAME

### **Ranking General:**
- 🥇 Top 100 jugadores
- 📊 Ordenado por puntuación
- 📈 Muestra: migajas, enemigos, tiempo, mundo

### **Puntuación calculada:**
```javascript
Puntos = 
  Tiempo * 10 +
  Migajas * 5 +
  Enemigos * 20 +
  Secretos * 50 +
  Jefes * 100
```

### **Hall of Fame (Modo Extremo):**
- 💀 Top 50 valientes que murieron
- ⏱️ Tiempo sobrevivido
- 🗺️ Mundo alcanzado
- 🏅 Puntuación final
- 📅 Fecha de muerte

---

## 7. 💀 MUERTE PERMANENTE (Modo Extremo)

### **Cómo funciona:**

1. Seleccionas dificultad **EXTREMO**
2. Tienes ~10 HP (un golpe = muerte)
3. Si mueres:
   - ⚠️ El usuario se **elimina automáticamente**
   - 📊 Tus estadísticas se guardan en Hall of Fame
   - 🏆 Puedes competir por el top 50
   - 🔄 Debes crear un nuevo usuario

### **Ventajas:**
- 🎁 Recompensas x3
- 🏅 Prestigio en el Hall of Fame
- 🎯 Desafío máximo

---

## 8. ⚙️ CAMBIAR DIFICULTAD EN CUALQUIER MOMENTO

- ✅ Puedes cambiar la dificultad después de crear el usuario
- ⚠️ Ajusta vida máxima automáticamente
- 📊 Afecta el comportamiento de enemigos
- 💡 Útil si encuentras el juego muy fácil o difícil

---

## 9. 🎯 SISTEMA DE CHECKPOINTS

- 📍 Posición actual guardada
- 🔄 Respawn en último checkpoint
- ⏱️ Configuración por dificultad:
  - **Fácil:** Checkpoints extra
  - **Normal/Medio/Difícil:** Checkpoints normales
  - **Extremo:** ¡Sin checkpoints! (muerte permanente)

---

## 10. 🔐 SEGURIDAD Y VALIDACIÓN

### **Protecciones implementadas:**
- ✅ Validación de nombres de usuario (3-20 chars)
- ✅ Verificación de integridad en importación
- ✅ Protección contra modificación de archivos
- ✅ Confirmación doble para eliminar usuarios
- ✅ Auto-guardado cada 60 segundos
- ✅ Sesión persistente (auto-login)

---

## 📁 ESTRUCTURA DE ARCHIVOS NUEVOS

```
Paloma-migajera/
├── index.html (actualizado - va a selección usuario)
├── seleccion-usuario.html ⭐ NUEVO
├── sistema-usuarios.js ⭐ NUEVO
├── style-usuarios.css ⭐ NUEVO
├── Juego/
│   ├── index.html (actualizado - selección mundos)
│   └── style-juego.css (actualizado)
└── ... (resto de archivos originales)
```

---

## 🚀 CÓMO USAR EL SISTEMA

### **1. Primera Vez:**

```
1. Abre index.html
2. Se abre seleccion-usuario.html
3. Click en "NUEVO USUARIO"
4. Escribe tu nombre (3-20 chars)
5. Selecciona dificultad
6. Click en "CREAR USUARIO"
7. ¡Listo! Ya puedes jugar
```

### **2. Jugar:**

```
1. Selecciona tu usuario
2. Ve tu perfil con estadísticas
3. Click en "🎮 JUGAR"
4. Selecciona el mundo
5. ¡A volar!
```

### **3. Múltiples Usuarios:**

```
- Cada persona puede tener su propio perfil
- Perfecto para familias o amigos
- Progreso 100% independiente
- Compite en el ranking
```

---

## 💡 FUNCIONES DISPONIBLES EN EL PERFIL

### **Desde el perfil de usuario puedes:**

- 🎮 **JUGAR** - Ir a selección de mundos
- 💾 **EXPORTAR PROGRESO** - Backup de tu usuario
- ⚙️ **CAMBIAR DIFICULTAD** - Ajustar reto
- 🗑️ **ELIMINAR USUARIO** - Borrar perfil
- ← **CERRAR SESIÓN** - Volver a selección

---

## 📊 CÓMO VER TUS ESTADÍSTICAS

### **En el Perfil verás:**

1. **Estadísticas generales:**
   - Tiempo total jugado
   - Muertes
   - Migajas recolectadas
   - Enemigos derrotados
   - Y más...

2. **Progreso de mundos:**
   - Cuáles están desbloqueados
   - Cuáles completaste
   - Mejor tiempo en cada uno

3. **Habilidades:**
   - Cuáles has desbloqueado
   - Cuáles te faltan

---

## 🏆 COMPETIR EN EL RANKING

### **Ranking General:**
```
1. Desde el menú principal
2. Click en "RANKING"
3. Ve tu posición vs otros usuarios
4. Ordenado por puntuación total
```

### **Hall of Fame:**
```
1. Desde el menú principal
2. Click en "HALL OF FAME"
3. Ve a los valientes del Modo Extremo
4. Inspirate para intentarlo tú
```

---

## 💾 EXPORTAR TU PROGRESO

### **Para hacer backup:**

```javascript
1. Entra a tu perfil
2. Click en "💾 EXPORTAR PROGRESO"
3. Se descarga: paloma_[usuario]_[fecha].json
4. Guarda el archivo en lugar seguro
```

### **Para compartir:**
- Puedes enviar el archivo a amigos
- Ellos pueden importarlo
- Continuarán tu progreso

---

## 📥 IMPORTAR PROGRESO

### **Método 1 - Arrastrar:**
```
1. Menú principal → "IMPORTAR PROGRESO"
2. Arrastra el archivo .json
3. Confirma la importación
4. ¡Listo!
```

### **Método 2 - Click:**
```
1. Menú principal → "IMPORTAR PROGRESO"
2. Click en la zona de drop
3. Selecciona el archivo
4. Confirma
```

---

## ⚠️ ADVERTENCIAS IMPORTANTES

### **Modo Extremo:**
- ⚠️ **MUERTE PERMANENTE** - No hay vuelta atrás
- 💀 Si mueres, pierdes el usuario PARA SIEMPRE
- 🏆 Pero entras al Hall of Fame
- 💡 Solo para expertos

### **Exportar Antes de Extremo:**
- 💾 Exporta tu progreso ANTES de jugar Extremo
- 🔄 Así puedes recuperarlo si mueres
- 🎮 O créalo como usuario aparte

### **No Edites los JSON:**
- ✅ El sistema valida integridad
- ❌ Si modificas el archivo, no lo aceptará
- 🔒 Protección anti-trampas

---

## 🎮 DIFERENCIA: GAMEPLAY vs JUEGO

### **Antes (Sistema antiguo):**
```
Menu Principal → Juego → Gameplay
```

### **Ahora (Sistema nuevo):**
```
Selección Usuario → Selección Mundo → Gameplay

Usuario ─┐
         ├─ Mundo 1 → Gameplay
         ├─ Mundo 2 → Gameplay
         ├─ Mundo 3 → Gameplay
         ├─ Mundo 4 → Gameplay
         └─ Mundo 5 → Gameplay
```

**Cada mundo es independiente**
**Cada usuario tiene su progreso en los 5 mundos**

---

## 🔧 INTEGRACIÓN CON CÓDIGO EXISTENTE

### **Acceder al usuario actual:**
```javascript
const usuario = window.PALOMA_USUARIOS.usuarioActual;

// Obtener info
console.log(usuario.username);
console.log(usuario.dificultad);
console.log(usuario.stats);
console.log(usuario.mundos);
```

### **Actualizar estadísticas:**
```javascript
// En el gameplay
PALOMA_USUARIOS.actualizarEstadistica('migajasRecolectadas', 1);
PALOMA_USUARIOS.actualizarEstadistica('saltosRealizados', 1);
PALOMA_USUARIOS.actualizarEstadistica('distanciaRecorrida', 5);
```

### **Registrar muerte:**
```javascript
const resultado = PALOMA_USUARIOS.registrarMuerte();

if (resultado.tipo === 'permanente') {
    // Modo Extremo - Usuario eliminado
    alert('GAME OVER - Modo Extremo');
    window.location.href = '/seleccion-usuario.html';
} else {
    // Modos normales - Volver a checkpoint
    const cp = resultado.checkpoint;
    p.x = cp.x;
    p.y = cp.y;
}
```

### **Completar mundo:**
```javascript
const mundoActual = parseInt(localStorage.getItem('paloma_mundo_actual'));
const tiempoFinal = 45.5; // minutos

PALOMA_USUARIOS.completarMundo(mundoActual, tiempoFinal);
```

---

## 📚 DOCUMENTACIÓN ADICIONAL

### **LocalStorage usado:**
```
- paloma_usuarios: Objeto con todos los usuarios
- paloma_usuario_actual: Username de sesión activa
- paloma_mundo_actual: Mundo que está jugando
- paloma_hall_of_fame: Top 50 Modo Extremo
```

### **Métodos principales del sistema:**
```javascript
// Crear usuario
PALOMA_USUARIOS.crearUsuario(username, dificultad)

// Login/Logout
PALOMA_USUARIOS.iniciarSesion(username)
PALOMA_USUARIOS.cerrarSesion()

// Progreso
PALOMA_USUARIOS.guardarProgreso()
PALOMA_USUARIOS.actualizarCheckpoint(mundo, nivel, x, y)
PALOMA_USUARIOS.actualizarEstadistica(nombre, valor)

// Mundos
PALOMA_USUARIOS.desbloquearMundo(numero)
PALOMA_USUARIOS.completarMundo(numero, tiempo)

// Exportar/Importar
PALOMA_USUARIOS.exportarProgreso()
PALOMA_USUARIOS.importarProgreso(file)

// Ranking
PALOMA_USUARIOS.obtenerRanking()
PALOMA_USUARIOS.obtenerHallOfFame()
```

---

## 🎨 PERSONALIZACIÓN

### **Agregar más mundos:**
```javascript
// En sistema-usuarios.js, en crearUsuario():
mundos: {
    1: { desbloqueado: true, completado: false },
    2: { desbloqueado: false, completado: false },
    3: { desbloqueado: false, completado: false },
    4: { desbloqueado: false, completado: false },
    5: { desbloqueado: false, completado: false },
    6: { desbloqueado: false, completado: false }, // ⭐ NUEVO
    7: { desbloqueado: false, completado: false }  // ⭐ NUEVO
}
```

### **Cambiar nombres de mundos:**
```javascript
// En Juego/index.html:
const nombresMundos = {
    1: 'Tu Nombre 1',
    2: 'Tu Nombre 2',
    // ...
};
```

### **Ajustar dificultades:**
```javascript
// En sistema-usuarios.js, en obtenerConfigDificultad():
'facil': {
    multiplicadorVida: 2.0,  // Cambiar valores
    multiplicadorDanio: 0.3,
    // ...
}
```

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### **"No se guarda mi progreso"**
→ Verifica que tienes sesión iniciada
→ Revisa la consola (F12) por errores

### **"No puedo importar mi archivo"**
→ Asegúrate que es un archivo .json válido
→ No lo modifiques manualmente

### **"Perdí mi usuario de Modo Extremo"**
→ Es normal, es muerte permanente
→ Mira en Hall of Fame tus estadísticas

### **"No aparecen mis usuarios"**
→ Limpia localStorage y vuelve a importar
→ O crea usuarios nuevos

---

## ✨ CARACTERÍSTICAS FUTURAS SUGERIDAS

Ideas para expandir el sistema:

- 🎖️ Sistema de rangos/niveles de cuenta
- 🏅 Más logros específicos por dificultad
- 📸 Capturas de pantalla de momentos épicos
- 👥 Modo multijugador local
- 📊 Gráficas de progreso
- 🎁 Recompensas por racha
- 🌐 Sincronización en la nube (opcional)

---

## 🎉 ¡DISFRUTA EL JUEGO!

Ahora tienes un sistema completo de usuarios con:
- ✅ 6 dificultades
- ✅ 5 mundos separados
- ✅ Estadísticas detalladas
- ✅ Exportar/Importar
- ✅ Ranking y Hall of Fame
- ✅ Muerte permanente (Extremo)

**¡Todo listo para competir y disfrutar Paloma Migajera! 🕊️**

---

**Versión:** 2.0
**Fecha:** Febrero 2024
**Desarrollado por:** Guillermo R., Francisco D., Daila J.
