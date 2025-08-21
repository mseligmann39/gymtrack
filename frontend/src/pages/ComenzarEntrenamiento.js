import React, { useEffect, useState } from "react";
import api from "../api";
import "bootstrap/dist/css/bootstrap.min.css";

// --- Funciones de Ayuda (sin cambios) ---
const getDayOfWeekNumber = (dayCode) => {
  const days = { LUN: 1, MAR: 2, MIE: 3, JUE: 4, VIE: 5, SAB: 6, DOM: 0 };
  return days[dayCode];
};

const getMostRecentDay = (dayOfWeek) => {
  const today = new Date();
  const todayDay = today.getDay() === 0 ? 7 : today.getDay();
  const targetDay = dayOfWeek === 0 ? 7 : dayOfWeek;
  let mostRecentDate = new Date(today);
  let dayDifference = todayDay - targetDay;
  if (dayDifference < 0) {
    dayDifference += 7;
  }
  mostRecentDate.setDate(today.getDate() - dayDifference);
  return mostRecentDate.toISOString().split("T")[0];
};

function ComenzarEntrenamiento() {
  const [usuarioId] = useState(1);
  const [diasEntrenamiento, setDiasEntrenamiento] = useState([]);
  const [sesionActiva, setSesionActiva] = useState(null);
  const [diaSeleccionado, setDiaSeleccionado] = useState(null);
  const [ejercicioActualIndex, setEjercicioActualIndex] = useState(0);
  const [formData, setFormData] = useState({
    series_realizadas: "",
    repeticiones_realizadas: "",
    peso_usado: "",
  });
  const [comentarioFinal, setComentarioFinal] = useState("");
  const [dificultad, setDificultad] = useState("Normal");

  useEffect(() => {
    api
      .get(`workout-days/?usuario=${usuarioId}`)
      .then((res) => setDiasEntrenamiento(res.data))
      .catch((err) => console.error("Error al cargar días:", err));
  }, [usuarioId]);

  const handleComenzarEntrenamiento = async (dia) => {
    const dayOfWeek = getDayOfWeekNumber(dia.dia_de_la_semana);
    const fecha = getMostRecentDay(dayOfWeek);
    try {
      const res = await api.post("workout-sessions/", {
        usuario: usuarioId,
        workout_day: dia.id,
        fecha: fecha,
      });
      setDiaSeleccionado(dia);
      setSesionActiva(res.data);
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      alert("No se pudo iniciar la sesión de entrenamiento.");
    }
  };

  const handleSiguienteEjercicio = async (e) => {
    e.preventDefault();
    const ejercicioActual = diaSeleccionado.ejercicios[ejercicioActualIndex];
    const logData = {
      session: sesionActiva.id,
      ejercicio: ejercicioActual.ejercicio,
      ...formData,
    };
    try {
      await api.post("workout-logs/", logData);
      setFormData({
        series_realizadas: "",
        repeticiones_realizadas: "",
        peso_usado: "",
      });
      // ¡CORRECCIÓN AQUÍ! La lógica para pasar de vista es más simple y robusta.
      if (ejercicioActualIndex < diaSeleccionado.ejercicios.length - 1) {
        setEjercicioActualIndex(ejercicioActualIndex + 1);
      } else {
        // Si es el último ejercicio, simplemente limpiamos el día seleccionado.
        // Esto hará que React renderice la pantalla de finalización.
        setDiaSeleccionado(null);
      }
    } catch (err) {
      console.error("Error al guardar el log:", err);
      alert("Error al guardar el progreso del ejercicio.");
    }
  };

  const handleFinalizar = async () => {
    const comentario = `Dificultad: ${dificultad}. ${comentarioFinal}`;
    try {
      await api.patch(`workout-sessions/${sesionActiva.id}/`, {
        comentarios: comentario,
      });
      alert("¡Entrenamiento finalizado y guardado!");
      setDiaSeleccionado(null);
      setSesionActiva(null);
      setEjercicioActualIndex(0);
      setComentarioFinal("");
      setDificultad("Normal");
    } catch (err) {
      console.error("Error al finalizar:", err);
      alert("Hubo un error al finalizar el entrenamiento.");
    }
  };

  // ... (el resto del código de renderizado es igual y no necesita cambios)
  const getNombreRutina = (dia) => {
    const diasMap = {
      LUN: "Lunes",
      MAR: "Martes",
      MIE: "Miércoles",
      JUE: "Jueves",
      VIE: "Viernes",
      SAB: "Sábado",
      DOM: "Domingo",
    };
    const nombreDia = diasMap[dia.dia_de_la_semana];
    const base = `Rutina ${nombreDia}`;
    if (dia.nombre && dia.nombre !== "Mi Rutina") {
      return `${base} (${dia.nombre})`;
    }
    return base;
  };

  if (!sesionActiva) {
    return (
      <div className="container mt-4">
        <h2 className="mb-4">Comenzar Entrenamiento</h2>
        <p>Selecciona una rutina para comenzar:</p>
        <div className="list-group mb-3">
          {diasEntrenamiento.map((dia) => (
            <button
              key={dia.id}
              type="button"
              className="list-group-item list-group-item-action"
              onClick={() => handleComenzarEntrenamiento(dia)}
            >
              {getNombreRutina(dia)}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (sesionActiva && diaSeleccionado) {
    const ejercicio = diaSeleccionado.ejercicios[ejercicioActualIndex];
    return (
      <div className="container mt-4">
        <h2 className="mb-4">
          Ejercicio {ejercicioActualIndex + 1} de{" "}
          {diaSeleccionado.ejercicios.length}:{" "}
          {ejercicio.ejercicio_detalle.nombre}
        </h2>
        <p className="text-muted">
          Planificado: {ejercicio.series}x{ejercicio.repeticiones} reps con{" "}
          {ejercicio.peso_estimado || "N/A"} kg
        </p>

        <form onSubmit={handleSiguienteEjercicio}>
          <div className="mb-3">
            <label htmlFor="series_realizadas" className="form-label">
              Series realizadas:
            </label>
            <input
              type="number"
              id="series_realizadas"
              name="series_realizadas"
              className="form-control"
              value={formData.series_realizadas}
              onChange={(e) =>
                setFormData({ ...formData, series_realizadas: e.target.value })
              }
              required
              min="0"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="repeticiones_realizadas" className="form-label">
              Repeticiones realizadas:
            </label>
            <input
              type="number"
              id="repeticiones_realizadas"
              name="repeticiones_realizadas"
              className="form-control"
              value={formData.repeticiones_realizadas}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  repeticiones_realizadas: e.target.value,
                })
              }
              required
              min="0"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="peso_usado" className="form-label">
              Peso usado (kg):
            </label>
            <input
              type="number"
              id="peso_usado"
              name="peso_usado"
              className="form-control"
              value={formData.peso_usado}
              onChange={(e) =>
                setFormData({ ...formData, peso_usado: e.target.value })
              }
              required
              min="0"
              step="0.1"
            />
          </div>
          <button type="submit" className="btn btn-primary">
            {ejercicioActualIndex < diaSeleccionado.ejercicios.length - 1
              ? "Siguiente Ejercicio"
              : "Finalizar Ejercicios"}
          </button>
        </form>
      </div>
    );
  }

  if (sesionActiva && !diaSeleccionado) {
    return (
      <div className="container mt-4">
        <h2 className="mb-4">¡Rutina Completada!</h2>
        <p>Añade un comentario sobre tu sesión de hoy.</p>
        <div className="mb-3">
          <label htmlFor="dificultad" className="form-label">
            ¿Qué tan difícil te pareció?
          </label>
          <select
            id="dificultad"
            className="form-select"
            value={dificultad}
            onChange={(e) => setDificultad(e.target.value)}
          >
            <option>Muy fácil</option>
            <option>Normal</option>
            <option>Difícil</option>
            <option>Muy difícil</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="comentarioFinal" className="form-label">
            Comentarios adicionales (opcional):
          </label>
          <textarea
            id="comentarioFinal"
            className="form-control"
            rows="3"
            value={comentarioFinal}
            onChange={(e) => setComentarioFinal(e.target.value)}
            placeholder="¿Cómo te sentiste? ¿Alguna molestia?"
          />
        </div>
        <button onClick={handleFinalizar} className="btn btn-success">
          Guardar y Finalizar Entrenamiento
        </button>
      </div>
    );
  }

  return <div className="container mt-4">Cargando...</div>;
}

export default ComenzarEntrenamiento;
