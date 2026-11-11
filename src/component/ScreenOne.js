import React, { useMemo, useRef, useState } from "react";
import "../style/screenone.css";
import manzana from "../img/manzana.png";
import { reproducir } from "./musica";

// Tiempos de la animación (ms)
const HUMO_DESDE = 700; // cuándo empieza a salir el humo después del clic
const CAMBIO_PANTALLA = 2600; // cuándo se pasa a la segunda pantalla

const CANT_HUMO = 34;

// Bocanadas de humo con posiciones y tamaños al azar (se calculan una vez)
function crearHumo() {
  return Array.from({ length: CANT_HUMO }, (_, i) => {
    const angulo = Math.random() * Math.PI * 2;
    const distancia = 25 + Math.random() * 75; // en vmax
    return {
      id: i,
      x: Math.cos(angulo) * distancia,
      y: Math.sin(angulo) * distancia - 10, // el humo tiende a subir
      size: 18 + Math.random() * 30, // en vmax
      delay: Math.random() * 0.9,
      dur: 1.6 + Math.random() * 1.2,
      rot: Math.random() * 360,
      tono: Math.random() < 0.5 ? "a" : Math.random() < 0.5 ? "b" : "c",
    };
  });
}

const DESTELLOS = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  top: Math.random() * 100,
  left: Math.random() * 100,
  size: 2 + Math.random() * 3,
  delay: -Math.random() * 6,
}));

function ScreenOne({ onEnter }) {
  const [abierto, setAbierto] = useState(false);
  const [humo, setHumo] = useState(false);
  const yaClic = useRef(false);
  const bocanadas = useMemo(crearHumo, []);

  const abrirLibro = () => {
    if (yaClic.current) return;
    yaClic.current = true;
    reproducir(); // arranca la canción con este toque
    setAbierto(true);
    setTimeout(() => setHumo(true), HUMO_DESDE);
    setTimeout(() => onEnter(), CAMBIO_PANTALLA);
  };

  const onKey = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      abrirLibro();
    }
  };

  return (
    <div className="s1-escena">
      {DESTELLOS.map((d) => (
        <span
          key={d.id}
          className="s1-destello"
          style={{
            top: `${d.top}%`,
            left: `${d.left}%`,
            width: d.size,
            height: d.size,
            animationDelay: `${d.delay}s`,
          }}
        />
      ))}

      <div className={`s1-libro-wrap ${abierto ? "abierto" : ""}`}>
        <div
          className="s1-libro"
          role="button"
          tabIndex={0}
          aria-label="Abrir el libro"
          onClick={abrirLibro}
          onKeyDown={onKey}
        >
          {/* Hojas y contratapa */}
          <div className="s1-contratapa" />
          <div className="s1-hojas" />
          <div className="s1-pagina">
            <div className="s1-pagina-brillo" />
          </div>

          {/* Tapa que se abre */}
          <div className="s1-tapa">
            <div className="s1-tapa-frente">
              <span className="s1-esquina tl" />
              <span className="s1-esquina tr" />
              <span className="s1-esquina bl" />
              <span className="s1-esquina br" />
              <div className="s1-marco">
                <img src={manzana} alt="" className="s1-portada" draggable="false" />
              </div>
            </div>
            <div className="s1-tapa-dorso" />
          </div>
          <div className="s1-lomo" />
        </div>
      </div>

      <p className={`s1-pista ${abierto ? "oculta" : ""}`}>
        Tocá el libro para abrirlo
      </p>

      {humo && (
        <div className="s1-humo" aria-hidden="true">
          {bocanadas.map((b) => (
            <span
              key={b.id}
              className={`s1-bocanada tono-${b.tono}`}
              style={{
                width: `${b.size}vmax`,
                height: `${b.size}vmax`,
                "--x": `${b.x}vmax`,
                "--y": `${b.y}vmax`,
                "--r": `${b.rot}deg`,
                animationDelay: `${b.delay}s`,
                animationDuration: `${b.dur}s`,
              }}
            />
          ))}
          <div className="s1-humo-velo" />
        </div>
      )}
    </div>
  );
}

export default ScreenOne;
