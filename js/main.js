/**
 * ============================================================
 *  LÓGICA PRINCIPAL — INVITACIÓN DIGITAL KAROL & MAURICIO
 *  Vanilla JS: Sobre 3D, Música, Cuenta Regresiva, Itinerario,
 *  Calendario (.ics), Galería Lightbox y WhatsApp RSVP.
 * ============================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  initEnvelopeIntro();
  initMusicPlayer();
  initCountdown();
  renderItinerary();
  renderGallery();
  initCalendarDownload();
  initWhatsAppRSVP();
  initScrollReveal();
});

/* ------------------------------------------------------------
   1. ANIMACIÓN DE SOBRE 3D + SELLO DE LACRE
   ------------------------------------------------------------ */
let audioController = null;

function initEnvelopeIntro() {
  const overlay = document.getElementById("intro-overlay");
  const envelopeStage = document.getElementById("envelope-stage");
  const enterBtn = document.getElementById("enter-invitation-btn");
  const invitation = document.getElementById("invitation");
  const floatingMusic = document.getElementById("floating-music-btn");

  let envelopeOpened = false;

  const openEnvelope = () => {
    if (envelopeOpened) return;
    envelopeOpened = true;
    envelopeStage.classList.add("is-open");
    overlay.classList.add("is-opened");

    // Iniciar música suavemente con la primera interacción del usuario
    if (audioController) {
      audioController.playWithFade();
    }
  };

  envelopeStage.addEventListener("click", openEnvelope);
  envelopeStage.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openEnvelope();
    }
  });

  enterBtn.addEventListener("click", () => {
    overlay.classList.add("is-hidden");
    document.body.classList.remove("locked");
    invitation.classList.add("is-visible");
    window.scrollTo({ top: 0, behavior: "instant" });

    // Asegurar que la música siga sonando si el navegador la pausó
    if (audioController && !audioController.userPaused && audioController.audio.paused) {
      audioController.playWithFade();
    }

    // Mostrar botón flotante de audio al hacer scroll
    setTimeout(() => {
      floatingMusic.classList.add("is-visible");
    }, 600);
  });
}

/* ------------------------------------------------------------
   2. REPRODUCTOR DE MÚSICA (INLINE + BOTÓN FLOTANTE)
   ------------------------------------------------------------ */
function initMusicPlayer() {
  const audio = document.getElementById("bg-music");
  const playBtn = document.getElementById("music-play-btn");
  const floatingBtn = document.getElementById("floating-music-btn");
  const eqBars = document.getElementById("eq-bars");
  const progressBar = document.getElementById("music-progress-bar");
  const progressFill = document.getElementById("music-progress-fill");
  const timeDisplay = document.getElementById("music-time");
  const titleEl = document.getElementById("music-title");
  const artistEl = document.getElementById("music-artist");

  audio.src = WEDDING_CONFIG.music.src;
  audio.volume = WEDDING_CONFIG.music.volume ?? 0.65;
  const startSec = WEDDING_CONFIG.music.startTime || 0;

  // Si se define un segundo de inicio (ej. segundo 31), posicionar el audio
  if (startSec > 0) {
    const applyStartTime = () => {
      try {
        if (audio.currentTime < startSec) {
          audio.currentTime = startSec;
        }
      } catch (err) {}
    };
    audio.addEventListener("loadedmetadata", applyStartTime, { once: true });
    audio.addEventListener("canplay", applyStartTime, { once: true });
  }

  if (titleEl) titleEl.textContent = WEDDING_CONFIG.music.title;
  if (artistEl) artistEl.textContent = WEDDING_CONFIG.music.artist;

  const iconPlay = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.14v14l11-7-11-7z"/></svg>`;
  const iconPause = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 5h4v14H6zm8 0h4v14h-4z"/></svg>`;

  const controller = {
    audio,
    userPaused: false,
    updateUI(isPlaying) {
      playBtn.innerHTML = isPlaying ? iconPause : iconPlay;
      floatingBtn.innerHTML = isPlaying ? iconPause : iconPlay;
      playBtn.setAttribute("aria-label", isPlaying ? "Pausar canción" : "Reproducir canción");
      floatingBtn.setAttribute("aria-label", isPlaying ? "Pausar música" : "Reproducir música");
      eqBars.classList.toggle("is-playing", isPlaying);
    },
    playWithFade() {
      const targetVol = WEDDING_CONFIG.music.volume ?? 0.65;
      if (startSec > 0 && (audio.currentTime === 0 || audio.currentTime < startSec)) {
        try {
          audio.currentTime = startSec;
        } catch (err) {}
      }
      audio.volume = 0.05;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            controller.updateUI(true);
            let vol = 0.05;
            const fade = setInterval(() => {
              vol = Math.min(targetVol, vol + 0.05);
              audio.volume = vol;
              if (vol >= targetVol) clearInterval(fade);
            }, 80);
          })
          .catch(() => {
            controller.updateUI(false);
          });
      }
    },
    toggle() {
      if (audio.paused) {
        controller.userPaused = false;
        if (startSec > 0 && (audio.currentTime === 0 || audio.currentTime < startSec)) {
          try {
            audio.currentTime = startSec;
          } catch (err) {}
        }
        audio.play().then(() => controller.updateUI(true)).catch(() => {});
      } else {
        controller.userPaused = true;
        audio.pause();
        controller.updateUI(false);
      }
    },
  };

  audioController = controller;
  controller.updateUI(false);

  playBtn.addEventListener("click", controller.toggle);
  floatingBtn.addEventListener("click", controller.toggle);

  audio.addEventListener("timeupdate", () => {
    if (!audio.duration) return;
    const pct = (audio.currentTime / audio.duration) * 100;
    progressFill.style.width = `${pct}%`;
    timeDisplay.textContent = formatTime(audio.currentTime);
  });

  progressBar.addEventListener("click", (e) => {
    if (!audio.duration) return;
    const rect = progressBar.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.currentTime = ratio * audio.duration;
  });
}

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

/* ------------------------------------------------------------
   3. CUENTA REGRESIVA EN TIEMPO REAL
   ------------------------------------------------------------ */
function initCountdown() {
  const target = new Date(WEDDING_CONFIG.eventDateISO).getTime();
  const elDays = document.getElementById("cd-days");
  const elHours = document.getElementById("cd-hours");
  const elMins = document.getElementById("cd-mins");
  const elSecs = document.getElementById("cd-secs");
  const labelEl = document.getElementById("countdown-label");

  const tick = () => {
    const now = Date.now();
    const diff = target - now;

    if (diff <= 0) {
      elDays.textContent = "00";
      elHours.textContent = "00";
      elMins.textContent = "00";
      elSecs.textContent = "00";
      if (labelEl) labelEl.textContent = "¡HOY ES EL GRAN DÍA!";
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    elDays.textContent = String(days).padStart(2, "0");
    elHours.textContent = String(hours).padStart(2, "0");
    elMins.textContent = String(mins).padStart(2, "0");
    elSecs.textContent = String(secs).padStart(2, "0");
  };

  tick();
  setInterval(tick, 1000);
}

/* ------------------------------------------------------------
   4. ITINERARIO EN CÓDIGO (DINÁMICO Y FÁCIL DE EDITAR)
   ------------------------------------------------------------ */
const ITINERARY_ICONS = {
  church: `
    <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M40 8v10M36 12h8"/>
      <path d="M32 24l8-6 8 6v10H32V24z"/>
      <path d="M16 42l24-12 24 12"/>
      <path d="M20 40v28h40V40"/>
      <path d="M33 68V52a7 7 0 0 1 14 0v16"/>
      <circle cx="40" cy="30" r="3"/>
      <path d="M25 48h4v10h-4zM51 48h4v10h-4z"/>
      <path d="M12 68h56"/>
    </svg>`,
  camera: `
    <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M14 28h12l5-8h18l5 8h12a4 4 0 0 1 4 4v26a4 4 0 0 1-4 4H14a4 4 0 0 1-4-4V32a4 4 0 0 1 4-4z"/>
      <circle cx="40" cy="45" r="12"/>
      <circle cx="40" cy="45" r="7"/>
      <circle cx="58" cy="35" r="2" fill="currentColor"/>
      <path d="M20 28v-3h6v3"/>
    </svg>`,
  rings: `
    <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="30" cy="48" r="15"/>
      <circle cx="30" cy="48" r="11.5" stroke-opacity="0.45"/>
      <circle cx="50" cy="48" r="15"/>
      <circle cx="50" cy="48" r="11.5" stroke-opacity="0.45"/>
      <path d="M50 33l-7-9 7-6 7 6-7 9z"/>
      <path d="M43 24h14M50 18v15"/>
      <path d="M50 11v3M39 14l2 2M61 14l-2 2"/>
    </svg>`,
  dinner: `
    <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="40" cy="42" r="18"/>
      <circle cx="40" cy="42" r="12" stroke-dasharray="3 3"/>
      <path d="M14 22v16a4 4 0 0 0 4 4v20"/>
      <path d="M18 22v14M10 22v14a4 4 0 0 0 4 4"/>
      <path d="M66 22c3 4 3 16 0 22v18"/>
      <path d="M66 22v40"/>
      <path d="M34 40c2-3 10-3 12 0M36 45c2 2 6 2 8 0"/>
    </svg>`,
  music: `
    <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M36 52V22l22-5v28"/>
      <circle cx="31" cy="54" r="5"/>
      <circle cx="53" cy="47" r="5"/>
      <path d="M36 30l22-5"/>
      <path d="M18 58c4-10 8-16 14-18 4 6 10 10 20 12 4 1 6 3 6 6H18z" stroke-opacity="0.75"/>
      <path d="M21 58v7M53 20l4-4M17 30l3-2"/>
    </svg>`,
  car: `
    <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M16 48l5-13a5 5 0 0 1 5-3h24a5 5 0 0 1 5 3l6 13"/>
      <path d="M12 48h56a3 3 0 0 1 3 3v8H9v-8a3 3 0 0 1 3-3z"/>
      <circle cx="22" cy="60" r="6" fill="#f5efe6"/>
      <circle cx="58" cy="60" r="6" fill="#f5efe6"/>
      <path d="M27 32v16M44 32v16"/>
      <path d="M32 22c0-3 3-5 5-2 2-3 5-1 5 2 0 3-5 6-5 6s-5-3-5-6z"/>
      <path d="M55 20l3-5M62 24l4-3"/>
    </svg>`,
};

function renderItinerary() {
  const container = document.getElementById("itinerary-timeline");
  if (!container) return;

  container.innerHTML = WEDDING_CONFIG.itinerary
    .map((item, idx) => {
      const iconHtml = ITINERARY_ICONS[item.icon] || ITINERARY_ICONS.rings;
      const isEven = idx % 2 === 0; // Par: ícono izquierda, texto derecha (como en tu foto)

      const iconBlock = `<div class="timeline-icon-box">${iconHtml}</div>`;
      const textBlock = `
        <div class="timeline-time">${item.time}</div>
        <div class="timeline-title">${item.title}</div>
        ${item.subtitle ? `<div class="timeline-sub">${item.subtitle}</div>` : ""}
      `;

      return `
        <article class="timeline-item reveal-on-scroll">
          <div class="timeline-side timeline-side--left">
            ${isEven ? iconBlock : textBlock}
          </div>
          <span class="timeline-dot" aria-hidden="true"></span>
          <div class="timeline-side timeline-side--right">
            ${isEven ? textBlock : iconBlock}
          </div>
        </article>
      `;
    })
    .join("");
}

/* ------------------------------------------------------------
   5. GALERÍA INTERACTIVA CON LIGHTBOX
   ------------------------------------------------------------ */
function renderGallery() {
  const grid = document.getElementById("gallery-grid");
  const lightbox = document.getElementById("lightbox");
  const lbImg = document.getElementById("lightbox-img");
  const lbClose = document.getElementById("lightbox-close");
  const lbPrev = document.getElementById("lightbox-prev");
  const lbNext = document.getElementById("lightbox-next");

  if (!grid || !lightbox) return;

  const photos = WEDDING_CONFIG.gallery;
  let currentIdx = 0;

  grid.innerHTML = photos
    .map(
      (p, i) => `
      <div class="gallery-thumb ${p.span === "wide" ? "gallery-thumb--wide" : ""} reveal-on-scroll" data-index="${i}" role="button" tabindex="0" aria-label="Ver foto ${i + 1}">
        <img src="${p.src}" alt="${p.alt}" loading="lazy" />
        <div class="gallery-thumb-overlay" aria-hidden="true">
          <svg class="gallery-thumb-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="7"></circle>
            <line x1="21" y1="21" x2="16.5" y2="16.5"></line>
            <line x1="11" y1="8" x2="11" y2="14"></line>
            <line x1="8" y1="11" x2="14" y2="11"></line>
          </svg>
        </div>
      </div>
    `
    )
    .join("");

  const openLightbox = (index) => {
    currentIdx = (index + photos.length) % photos.length;
    lbImg.src = photos[currentIdx].src;
    lbImg.alt = photos[currentIdx].alt;
    lightbox.classList.add("is-open");
  };

  const closeLightbox = () => lightbox.classList.remove("is-open");

  grid.addEventListener("click", (e) => {
    const thumb = e.target.closest(".gallery-thumb");
    if (thumb) openLightbox(Number(thumb.dataset.index));
  });

  grid.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      const thumb = e.target.closest(".gallery-thumb");
      if (thumb) {
        e.preventDefault();
        openLightbox(Number(thumb.dataset.index));
      }
    }
  });

  // También abrir lightbox al tocar la foto destacada "Save the Date"
  const featuredImg = document.getElementById("featured-savethedate-img");
  if (featuredImg) {
    featuredImg.addEventListener("click", () => {
      const idx = photos.findIndex((p) => p.src.includes("foto-savethedate"));
      openLightbox(idx >= 0 ? idx : 0);
    });
  }

  lbClose.addEventListener("click", closeLightbox);
  lbPrev.addEventListener("click", () => openLightbox(currentIdx - 1));
  lbNext.addEventListener("click", () => openLightbox(currentIdx + 1));

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Soporte de deslizamiento táctil (swipe) en móvil
  let touchStartX = 0;
  lightbox.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  lightbox.addEventListener("touchend", (e) => {
    const dx = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(dx) > 45) {
      openLightbox(dx < 0 ? currentIdx + 1 : currentIdx - 1);
    }
  }, { passive: true });

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("is-open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") openLightbox(currentIdx - 1);
    if (e.key === "ArrowRight") openLightbox(currentIdx + 1);
  });
}

/* ------------------------------------------------------------
   6. BOTÓN "AGREGAR AL CALENDARIO" (.ICS)
   ------------------------------------------------------------ */
function initCalendarDownload() {
  const btn = document.getElementById("add-to-calendar-btn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const icsLines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Karol y Mauricio//Boda 2027//ES",
      "BEGIN:VEVENT",
      "UID:boda-karol-mauricio-2027@invitacion",
      "DTSTAMP:20261119T120000Z",
      "DTSTART:20270109T180000Z",
      "DTEND:20270110T063000Z",
      "SUMMARY:Boda de Karol y Mauricio",
      "DESCRIPTION:Ceremonia Religiosa 12:00 PM en Parroquia de San José. Recepción 3:00 PM en Salón Imperial. ¡No olvides tus botas!",
      "LOCATION:Parroquia de San José / Salón Imperial, Ciudad Hidalgo, Michoacán",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsLines], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Boda-Karol-y-Mauricio.ics";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  });
}

/* ------------------------------------------------------------
   7. CONFIRMACIÓN POR WHATSAPP
   ------------------------------------------------------------ */
function initWhatsAppRSVP() {
  const form = document.getElementById("rsvp-form");
  const nameInput = document.getElementById("rsvp-name");
  const guestsSelect = document.getElementById("rsvp-guests");

  if (!form) return;

  const handleRSVP = (e) => {
    if (e) e.preventDefault();
    const guestName = nameInput ? nameInput.value.trim() : "";
    const guestsCount = guestsSelect ? guestsSelect.value : "1 persona";

    let message = "";
    if (typeof WEDDING_CONFIG.whatsapp.buildMessage === "function") {
      message = WEDDING_CONFIG.whatsapp.buildMessage(guestName, guestsCount);
    } else {
      const nombreTexto = guestName ? `👤 Nombre: ${guestName}\n` : "";
      message = `¡Hola Karol y Mauricio! Confirmo con mucho gusto mi asistencia a su boda el 9 de enero de 2027.\n\n${nombreTexto}👥 Asistencia: ${guestsCount}\n\n¡Ahí nos vemos con botas! 🤠👢`;
    }

    const cleanPhone = (WEDDING_CONFIG.whatsapp.phone || "").replace(/\D/g, "");
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  form.addEventListener("submit", handleRSVP);
}

/* ------------------------------------------------------------
   8. SCROLL REVEAL SUAVE CON INTERSECTION OBSERVER
   ------------------------------------------------------------ */
function initScrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-inview");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -30px 0px" }
  );

  document.querySelectorAll(".reveal-on-scroll").forEach((el) => observer.observe(el));
}
