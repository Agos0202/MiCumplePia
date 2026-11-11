// Música compartida entre las dos pantallas.
// Se inicia con el toque en el libro (los navegadores solo permiten
// reproducir sonido después de que la persona toca algo).

const CANCION = "/descendiente.mp3";
export const INICIO_CANCION = 7; // segundo desde el que arranca

let audio = null;

export function obtenerAudio() {
  if (!audio && typeof Audio !== "undefined") {
    audio = new Audio(CANCION);
    audio.preload = "auto";
    // al terminar vuelve a empezar desde el segundo 7
    audio.addEventListener("ended", () => {
      audio.currentTime = INICIO_CANCION;
      audio.play().catch(() => {});
    });
  }
  return audio;
}

export function reproducir() {
  const a = obtenerAudio();
  if (!a) return Promise.resolve(false);
  if (a.readyState >= 1) {
    if (a.currentTime < INICIO_CANCION) a.currentTime = INICIO_CANCION;
  } else {
    a.currentTime = INICIO_CANCION;
    a.addEventListener(
      "loadedmetadata",
      () => {
        if (a.currentTime < INICIO_CANCION) a.currentTime = INICIO_CANCION;
      },
      { once: true }
    );
  }
  return a.play().then(() => true).catch(() => false);
}

export function pausar() {
  const a = obtenerAudio();
  if (a && !a.paused) a.pause();
}
