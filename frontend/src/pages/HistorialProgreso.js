import React, { useEffect, useState } from "react";
import api from "../api";
import "bootstrap/dist/css/bootstrap.min.css";

function HistorialProgreso() {
  const [sesiones, setSesiones] = useState([]);

  useEffect(() => {
    api
      .get("workout-sessions/")
      .then((res) => {
        const sesionesOrdenadas = res.data.sort(
          (a, b) => new Date(b.fecha) - new Date(a.fecha)
        );
        setSesiones(sesionesOrdenadas);
      })
      .catch((err) => console.error("Error al cargar las sesiones:", err));
  }, []);

  const dias = {
    LUN: "Lunes",
    MAR: "Martes",
    MIE: "Miércoles",
    JUE: "Jueves",
    VIE: "Viernes",
    SAB: "Sábado",
    DOM: "Domingo",
  };

  return (
    <div className="theme-card">
      <h2 className="mb-4">📈 Historial de Sesiones</h2>
      {sesiones.map((sesion) => (
        <div key={sesion.id} className="card mb-4">
          <div className="card-header">
            <h5 className="mb-0">
              🗓️ {new Date(sesion.fecha).toLocaleDateString("es-ES")} -
              Entrenamiento de{" "}
              {dias[sesion.workout_day_detalle.dia_de_la_semana]}
            </h5>
          </div>
          <div className="card-body">
            {sesion.comentarios && (
              <p className="card-text fst-italic text-muted">
                "{sesion.comentarios}"
              </p>
            )}
            <ul className="list-group list-group-flush">
              {sesion.logs.map((log, index) => (
                // ¡CORRECCIÓN AQUÍ! Se usa una key única para cada elemento.
                <li
                  key={`${sesion.id}-${log.ejercicio}-${index}`}
                  className="list-group-item"
                >
                  <strong>{log.ejercicio_detalle.nombre}:</strong>{" "}
                  {log.series_realizadas}x{log.repeticiones_realizadas} -{" "}
                  {log.peso_usado}kg
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}

export default HistorialProgreso;
