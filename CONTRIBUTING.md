# 🤝 Guía de Contribuciones — Paloma Migajera

¡Gracias por querer contribuir! Esta guía explica cómo participar de forma efectiva.

---

## ¿Qué tipo de contribuciones se aceptan?

| Tipo | Descripción | Dificultad |
|---|---|---|
| 🎨 **Sprites** | Paloma, enemigos, NPCs, objetos | Media |
| 🗺️ **Tilesets** | Plataformas y fondos por zona | Alta |
| 🎵 **Música** | Temas por zona y menú | Media |
| 🔊 **SFX** | Salto, daño, recoger, UI | Baja |
| 💻 **Código** | Nuevas mecánicas, zonas, fixes | Media/Alta |
| 🐛 **Bugs** | Reportar o corregir errores | Baja |
| 📝 **Docs** | Mejorar documentación | Baja |
| 🌍 **Traducción** | Nuevos idiomas | Baja |

---

## Especificaciones técnicas de assets

### Sprites de personajes
- **Formato:** PNG con transparencia (RGBA)
- **Tamaño base:** 16×16 px por frame (o múltiplos: 32×32)
- **Paloma:** requiere animaciones de idle, caminar, saltar, caer, atacar, dash, planeo, muerte
- **Estilo:** pixel art con contorno de 1px, sin anti-aliasing

### Tilesets
- **Formato:** PNG, tileset de 16×16 px por tile
- **Mapa de colisiones:** PNG separado, blanco=#fff sólido, negro=#000 vacío
- **Organización:** Un archivo por zona (ciudad_alta.png, alcantarillas.png, etc.)

### Audio
- **Formato preferido:** OGG Vorbis (compatibilidad universal)
- **Alternativa:** MP3 (fallback)
- **Música:** Loop perfecto, duración mínima 60 segundos
- **SFX:** Duración < 2 segundos, sin silencio al inicio ni al final
- **Calidad:** 44100 Hz, estéreo para música, mono para SFX

---

## Cómo hacer un Pull Request

```bash
# 1. Haz fork del repositorio en GitHub

# 2. Clona tu fork
git clone https://github.com/TU-USUARIO/paloma-migajera.git
cd paloma-migajera

# 3. Crea una rama con nombre descriptivo
git checkout -b assets/sprite-paloma-idle
# o
git checkout -b feat/zona-tejado-gansos
# o
git checkout -b fix/colision-plataforma-madera

# 4. Agrega tus cambios
git add .
git commit -m "assets: sprite sheet paloma - animación idle y caminar"

# 5. Empuja tu rama
git push origin assets/sprite-paloma-idle

# 6. Abre un Pull Request en GitHub hacia la rama main
```

### Convención de commits

```
tipo: descripción corta en español o inglés

Tipos: feat, fix, assets, docs, style, refactor, test
```

---

## Créditos en assets

Si contribuyes un asset, agrega una línea en `assets/LICENSES.md`:

```markdown
| assets/sprites/paloma-sheet.png | Tu Nombre | CC0 1.0 | - |
| assets/audio/musica/ciudad-alta.ogg | Tu Nombre | CC BY 4.0 | https://tu-web.com |
```

---

## Código de conducta

- Sé respetuoso con todos los contribuidores.
- Las críticas deben ser constructivas y al trabajo, no a la persona.
- El idioma principal del proyecto es **español**, pero se aceptan contribuciones en inglés.
- Cualquier forma de acoso será motivo de bloqueo inmediato.

---

¿Dudas? Abre un [Issue con la etiqueta "pregunta"](../../issues/new) o inicia una [Discusión](../../discussions).
