import React, { useEffect, useState } from "react";
import manzana from "../img/manzana.png";
import corazonDragones from "../img/corazon-dragones.png";
import emblemaMalefica from "../img/malefica.png";
import espejoMagico from "../img/espejo.jpeg";
import { obtenerAudio, reproducir, pausar } from "./musica";
import "../style/screentwo.css";

// Sábado 14 de noviembre de 2026 (el mes empieza en 0: noviembre = 10).
// Hora: 12 = 12:00 del mediodía (si fuera medianoche, poné 0 y cambiá HORA_TEXTO).
const FECHA_EVENTO = new Date(2026, 10, 14, 12, 0, 0);
const HORA_TEXTO = "12:00 hs";

const UBICACION = "https://maps.app.goo.gl/uSs3sWW1ru9MhgY88";

// WhatsApp en formato internacional sin "+" ni espacios: 54 9 + código de área + número
const WHATSAPP = "5493814124713";

const MENSAJE_WSP = encodeURIComponent(
  "¡Hola Pía!✨ Confirmo mi asistencia a tu cumpleaños 💜💚"
);

// Polvo de oro que sube: [left %, tamaño px, duración s, retraso s]
const POLVO = Array.from({ length: 40 }, (_, i) => [
  (i * 53 + 11) % 100,
  1.5 + (i % 4) * 0.8,
  9 + (i % 6) * 2,
  -((i * 1.7) % 18),
]);

// Destellos alrededor del título: [top %, left %, tamaño px, retraso s]
const DESTELLOS_TITULO = [
  [4, 8, 18, -0.2], [14, 88, 24, -1.1], [38, 2, 14, -2.0], [46, 94, 16, -0.6],
  [68, 12, 22, -1.6], [80, 84, 14, -2.4], [92, 40, 12, -0.9], [26, 60, 10, -1.9],
];

function Espejo({ children }) {
  return (
    <div className="s2-espejo">
      <svg className="s2-espejo-marco" viewBox="0 0 240 300" aria-hidden="true">
        <defs>
          <linearGradient id="oroMarco" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fff3c4" />
            <stop offset="0.3" stopColor="#e3b64c" />
            <stop offset="0.55" stopColor="#9c6f1c" />
            <stop offset="0.8" stopColor="#f1cf6e" />
            <stop offset="1" stopColor="#8a5f14" />
          </linearGradient>
          <radialGradient id="vidrio" cx="0.4" cy="0.35" r="0.75">
            <stop offset="0" stopColor="#3d1a55" />
            <stop offset="0.6" stopColor="#1d0a2b" />
            <stop offset="1" stopColor="#0c0414" />
          </radialGradient>
        </defs>
        {/* vidrio */}
        <ellipse cx="120" cy="156" rx="88" ry="114" fill="url(#vidrio)" />
        <ellipse className="s2-espejo-reflejo" cx="92" cy="110" rx="18" ry="54" />
        {/* marco */}
        <ellipse cx="120" cy="156" rx="94" ry="120" fill="none" stroke="url(#oroMarco)" strokeWidth="9" />
        <ellipse cx="120" cy="156" rx="102" ry="128" fill="none" stroke="url(#oroMarco)" strokeWidth="2" />
        <ellipse cx="120" cy="156" rx="86" ry="112" fill="none" stroke="url(#oroMarco)" strokeWidth="1.2" opacity="0.8" />
        {/* cresta superior */}
        <path
          d="M120 4 Q128 18 142 20 Q132 26 134 38 Q126 30 120 36 Q114 30 106 38 Q108 26 98 20 Q112 18 120 4 Z"
          fill="url(#oroMarco)"
        />
        <path d="M84 30 Q98 22 108 32 M156 30 Q142 22 132 32" fill="none" stroke="url(#oroMarco)" strokeWidth="2.5" strokeLinecap="round" />
        {/* adorno inferior */}
        <path
          d="M120 296 Q128 284 140 282 Q130 278 128 268 Q124 276 120 274 Q116 276 112 268 Q110 278 100 282 Q112 284 120 296 Z"
          fill="url(#oroMarco)"
        />
        {/* perlas laterales */}
        <circle cx="18" cy="156" r="5" fill="url(#oroMarco)" />
        <circle cx="222" cy="156" r="5" fill="url(#oroMarco)" />
        <circle cx="40" cy="70" r="3.5" fill="url(#oroMarco)" />
        <circle cx="200" cy="70" r="3.5" fill="url(#oroMarco)" />
        <circle cx="40" cy="242" r="3.5" fill="url(#oroMarco)" />
        <circle cx="200" cy="242" r="3.5" fill="url(#oroMarco)" />
      </svg>
      <div className="s2-espejo-contenido">{children}</div>
    </div>
  );
}

function Destello({ style, className = "" }) {
  return (
    <svg className={`s2-destello ${className}`} style={style} viewBox="0 0 20 20" aria-hidden="true">
      <path d="M10 0 Q11 9 20 10 Q11 11 10 20 Q9 11 0 10 Q9 9 10 0 Z" />
    </svg>
  );
}

function Separador() {
  return (
    <div className="s2-separador" aria-hidden="true">
      <span className="s2-sep-linea" />
      <Destello className="s2-sep-estrella" />
      <span className="s2-sep-linea" />
    </div>
  );
}

function ScreenTwo() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [llego, setLlego] = useState(false);

  useEffect(() => {
    const eventDate = FECHA_EVENTO.getTime();

    const update = () => {
      const distance = eventDate - Date.now();
      if (distance <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setLlego(true);
        return;
      }
      setTimeLeft({
        days: Math.floor(distance / 86400000),
        hours: Math.floor((distance % 86400000) / 3600000),
        minutes: Math.floor((distance % 3600000) / 60000),
        seconds: Math.floor((distance % 60000) / 1000),
      });
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  // ---------- Música ----------
  const [sonando, setSonando] = useState(() => {
    const a = obtenerAudio();
    return !!a && !a.paused;
  });

  useEffect(() => {
    const a = obtenerAudio();
    if (!a) return;
    const onPlay = () => setSonando(true);
    const onPause = () => setSonando(false);
    a.addEventListener("play", onPlay);
    a.addEventListener("pause", onPause);

    // Por si no arrancó con el toque del libro, se intenta al entrar
    if (a.paused) reproducir();

    // Se pausa al cambiar de pestaña, cerrar o abrir WhatsApp / Maps
    const onVisibilidad = () => {
      if (document.hidden) pausar();
    };
    document.addEventListener("visibilitychange", onVisibilidad);
    window.addEventListener("pagehide", pausar);

    return () => {
      a.removeEventListener("play", onPlay);
      a.removeEventListener("pause", onPause);
      document.removeEventListener("visibilitychange", onVisibilidad);
      window.removeEventListener("pagehide", pausar);
    };
  }, []);

  const alternarMusica = () => {
    const a = obtenerAudio();
    if (!a) return;
    if (a.paused) reproducir();
    else pausar();
  };

  return (
    <div className="s2-escena">
      <button
        type="button"
        className={`s2-musica ${sonando ? "sonando" : ""}`}
        onClick={alternarMusica}
        aria-label={sonando ? "Pausar música" : "Reproducir música"}
      >
        <span className="s2-musica-icono" aria-hidden="true">
          {sonando ? (
            <svg viewBox="0 0 24 24"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>
          ) : (
            <svg viewBox="0 0 24 24"><path d="M8 5 L19 12 L8 19 Z" /></svg>
          )}
        </span>
        <span className="s2-musica-barras" aria-hidden="true">
          <i /><i /><i /><i />
        </span>
      </button>

      {/* ---------- Fondo ---------- */}
      <svg className="s2-humo s2-humo-1" aria-hidden="true">
        <filter id="humoVerde1" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.006 0.011" numOctaves="4" seed="7" />
          <feColorMatrix values="0 0 0 0 0.25  0 0 0 0 1  0 0 0 0 0.5  2.6 0 0 0 -1.25" />
        </filter>
        <rect width="100%" height="100%" filter="url(#humoVerde1)" />
      </svg>
      <svg className="s2-humo s2-humo-2" aria-hidden="true">
        <filter id="humoVerde2" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.009 0.014" numOctaves="3" seed="23" />
          <feColorMatrix values="0 0 0 0 0.45  0 0 0 0 1  0 0 0 0 0.6  2.4 0 0 0 -1.2" />
        </filter>
        <rect width="100%" height="100%" filter="url(#humoVerde2)" />
      </svg>

      {/* Emblemas de la película repartidos por el fondo */}
      <img src={emblemaMalefica} alt="" aria-hidden="true" className="s2-emblema s2-malefica s2-malefica-1" />
      <img src={corazonDragones} alt="" aria-hidden="true" className="s2-emblema s2-dragones s2-dragones-2" />
      <img src={espejoMagico} alt="" aria-hidden="true" className="s2-emblema s2-espejo-deco" />

      {POLVO.map(([left, size, dur, delay], i) => (
        <span
          key={i}
          className="s2-polvo"
          aria-hidden="true"
          style={{
            left: `${left}%`,
            width: size,
            height: size,
            animationDuration: `${dur}s`,
            animationDelay: `${delay}s`,
          }}
        />
      ))}

      {/* ---------- Contenido ---------- */}
      <main className="s2-contenido">
        <header className="s2-header">
          <Espejo>
            <img src={manzana} alt="Manzana dorada" className="s2-manzana" />
          </Espejo>

          <div className="s2-titulo-wrap">
            {DESTELLOS_TITULO.map(([top, left, size, delay], i) => (
              <Destello
                key={i}
                style={{ top: `${top}%`, left: `${left}%`, width: size, height: size, animationDelay: `${delay}s` }}
              />
            ))}

            <p className="s2-pre">Te invito a mi</p>
            <h1 className="s2-titulo oro-lujo">Cumpleaños</h1>
            <div className="s2-doce oro-lujo" aria-label="número 12">12</div>
            <h2 className="s2-nombre oro-lujo">Pía</h2>
          </div>
        </header>

        <Separador />

        <section className="s2-seccion">
          <p className="s2-texto">
            Los momentos más lindos se disfrutan con personas especiales.
          </p>
          <p className="s2-texto s2-texto-suave">
            Vení con tu mejor onda y preparate para bailar,
            sacarnos mil fotos y pasarla increíble.
            ¡Sin vos no es lo mismo!
          </p>
        </section>

        <section className="s2-tarjeta">
          <p className="s2-etiqueta">Agenda esta fecha</p>
          <div className="s2-fecha">
            <span className="s2-fecha-lado">Sábado</span>
            <span className="s2-fecha-dia oro">14</span>
            <span className="s2-fecha-lado">Noviembre</span>
          </div>
          <p className="s2-hora">{HORA_TEXTO}</p>

          <p className="s2-etiqueta s2-etiqueta-faltan">
            {llego ? "Hoy es el gran día" : "Faltan"}
          </p>
          <div className="s2-cuenta">
            {[
              [timeLeft.days, "Días"],
              [timeLeft.hours, "Horas"],
              [timeLeft.minutes, "Minutos"],
              [timeLeft.seconds, "Segundos"],
            ].map(([valor, label]) => (
              <div className="s2-cuenta-item" key={label}>
                <span className="s2-cuenta-num">{String(valor).padStart(2, "0")}</span>
                <span className="s2-cuenta-label">{label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="s2-tarjeta">
          <p className="s2-etiqueta">Lugar</p>
          <p className="s2-texto s2-texto-suave">Seguí el camino encantado hasta la fiesta.</p>
          <a className="s2-btn" href={UBICACION} target="_blank" rel="noopener noreferrer">
            Ver ubicación
          </a>
        </section>

        <section className="s2-tarjeta">
          <p className="s2-etiqueta">Confirmá tu asistencia</p>
          <p className="s2-texto s2-texto-suave">Tu lugar en la fiesta te espera.</p>
          <a
            className="s2-btn s2-btn-verde"
            href={`https://api.whatsapp.com/send?phone=${WHATSAPP}&text=${MENSAJE_WSP}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Confirmar por WhatsApp
          </a>
        </section>

        <Separador />

        <footer className="s2-final">
          <p className="s2-firma oro">con cariño, Pía</p>
        </footer>
      </main>
    </div>
  );
}

export default ScreenTwo;
