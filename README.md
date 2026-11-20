# Invitación Digital de Boda — Karol & Mauricio (09/01/2027)

Invitación web interactiva hecha con **HTML, CSS y JavaScript Vanilla** (sin frameworks ni build steps).

## Estructura del proyecto

```text
invitacion-karol-y-mauricio/
├── index.html                   # Estructura principal de la invitación
├── css/
│   └── styles.css               # Estilos, animaciones 3D del sobre y paleta (#bdae96)
├── js/
│   ├── config.js                # Configuración editable (itinerario, música, WhatsApp, fecha)
│   └── main.js                  # Lógica (sobre 3D, contador, reproductor, galería, .ics)
└── assets/
    ├── img/                     # Las 8 fotos optimizadas de Karol y Mauricio
    └── audio/
        └── cancion-temporal.wav # Audio temporal de prueba
```

## Cómo cambiar la canción a "Mi Primer Amor" de Pesado

1. Copia tu archivo de audio (por ejemplo `mi-primer-amor.mp3`) dentro de `assets/audio/`.
2. Abre `js/config.js` y cambia la línea `src` dentro de `music`:
   ```js
   music: {
     title: "Mi Primer Amor",
     artist: "Grupo Pesado",
     src: "assets/audio/mi-primer-amor.mp3",
     volume: 0.65,
   },
   ```

## Cómo editar el itinerario

El itinerario está construido en código (no es imagen). Para cambiar horarios, títulos, subtítulos o agregar bloques, edita el arreglo `itinerary` en `js/config.js`.
Íconos incluidos en código SVG: `"church"`, `"camera"`, `"rings"`, `"dinner"`, `"music"`, `"car"`.

## Cómo probar o publicar

- **En local:** Abre `index.html` directamente en tu navegador (o usa `npx serve .` / Live Server).
- **Para compartir por WhatsApp:** Sube la carpeta completa a **GitHub Pages**, **Netlify Drop** (`app.netlify.com/drop`), **Cloudflare Pages** o **Vercel** para obtener el enlace público.
