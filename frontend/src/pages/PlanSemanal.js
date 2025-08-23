import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Importar Link para la navegación
import api from "../api";
import "bootstrap/dist/css/bootstrap.min.css";

function PlanSemanal() {
  const [plan, setPlan] = useState([]);

  useEffect(() => {
    fetchPlan();
  }, []);

  const fetchPlan = () => {
    api
      .get("workout-days/")
      .then((res) => setPlan(res.data))
      .catch((err) => console.error("Error al cargar el plan:", err));
  };

  const handleEliminar = async (idRutina) => {
    // Pedir confirmación antes de borrar
    if (window.confirm("¿Estás seguro de que quieres eliminar esta rutina?")) {
      try {
        await api.delete(`workout-days/${idRutina}/`);
        alert("Rutina eliminada correctamente.");
        fetchPlan(); // Volver a cargar el plan para reflejar los cambios
      } catch (err) {
        console.error("Error al eliminar la rutina:", err);
        alert("Hubo un error al eliminar la rutina.");
      }
    }
  };

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
      planPorDia[dia.dia_de_la_semana].push(dia);
    }
  });

  return (
    <div className="theme-card">
      <h2 className="mb-4">Mi Plan Semanal</h2>
      <div className="row">
        {Object.entries(dias).map(([codigo, nombreDia]) => (
          <div key={codigo} className="col-12 mb-4">
            <h3>{nombreDia}</h3>
            {planPorDia[codigo].length > 0 ? (
              planPorDia[codigo].map((diaEntrenamiento) => (
                <div key={diaEntrenamiento.id} className="theme-card mb-3">
                  <div className="theme-card-header d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">📅 {diaEntrenamiento.nombre}</h5>
                    {/* BOTONES DE ACCIÓN */}
                    <div>
                      <Link
                        to={`/plan/editar/${diaEntrenamiento.id}`}
                        className="btn btn-light btn-sm me-2"
                      >
                        Editar
                      </Link>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleEliminar(diaEntrenamiento.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                  <div className="card-body">
                    <ul className="list-group list-group-flush">
                      {diaEntrenamiento.ejercicios.map((ex, idx) => (
                        <li key={idx} className="list-group-item theme-list-item">
                          <strong>{ex.ejercicio_detalle.nombre}</strong> (
                          {ex.series}x{ex.repeticiones}
                          {ex.peso_estimado ? ` - ${ex.peso_estimado}kg` : ""})
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted fst-italic">
                No hay rutinas para este día.
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default PlanSemanal;
