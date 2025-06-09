import React, { useEffect, useState } from "react";
import api from "../api";
import "bootstrap/dist/css/bootstrap.min.css";

function HistorialProgreso() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    api
      .get("workout-logs/")
      .then((res) => setLogs(res.data))
      .catch((err) => console.error("Error al cargar logs:", err));
  }, []);

  // Agrupar logs por ejercicio
  const agrupadoPorEjercicio = {};
  logs.forEach((log) => {
    const nombre = log.ejercicio.nombre;
    if (!agrupadoPorEjercicio[nombre]) {
      agrupadoPorEjercicio[nombre] = [];
    }
    agrupadoPorEjercicio[nombre].push(log);
  });

  return (
    <div className="container mt-4">
      <h2 className="mb-4">📈 Historial de Progreso por Ejercicio</h2>
      {Object.entries(agrupadoPorEjercicio).map(([nombre, entradas]) => (
        <div key={nombre} className="mb-4">
          <h4 className="mb-3">📌 {nombre}</h4>
          <ul className="list-group">
            {entradas
              .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
              .map((log, i) => (
                <li
                  key={i}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div>
                    <strong>{log.fecha}</strong>: {log.series_realizadas}x
                    {log.repeticiones_realizadas} - {log.peso_usado}kg
                    {log.comentarios && (
                      <div
                        className="fst-italic text-muted"
                        style={{ marginTop: "0.2rem" }}
                      >
                        – {log.comentarios}
                      </div>
                    )}
                  </div>
                </li>
              ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default HistorialProgreso;
