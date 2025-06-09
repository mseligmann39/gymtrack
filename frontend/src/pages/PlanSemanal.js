import React, { useEffect, useState } from "react";
import api from "../api";
import "bootstrap/dist/css/bootstrap.min.css";

function PlanSemanal() {
  const [plan, setPlan] = useState([]);

  useEffect(() => {
    api
      .get("workout-days/")
      .then((res) => setPlan(res.data))
      .catch((err) => console.error("Error al cargar el plan:", err));
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

  const planPorDia = {};
  for (const clave in dias) {
    planPorDia[clave] = [];
  }

  plan.forEach((dia) => {
    if (planPorDia[dia.dia_de_la_semana]) {
      planPorDia[dia.dia_de_la_semana].push(...dia.ejercicios);
    }
  });

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Mi Plan Semanal</h2>
      <div className="row">
        {Object.entries(dias).map(([codigo, nombre]) => (
          <div key={codigo} className="col-md-6 mb-4">
            <div className="card h-100 shadow-sm">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">📅 {nombre}</h5>
              </div>
              <div className="card-body">
                {planPorDia[codigo].length > 0 ? (
                  <ul className="list-group list-group-flush">
                    {planPorDia[codigo].map((ex, idx) => (
                      <li key={idx} className="list-group-item">
                        <strong>{ex.ejercicio_detalle.nombre}</strong> (
                        {ex.series}x{ex.repeticiones}
                        {ex.peso_estimado ? ` - ${ex.peso_estimado}kg` : ""})
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted fst-italic">No hay ejercicios</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PlanSemanal;
