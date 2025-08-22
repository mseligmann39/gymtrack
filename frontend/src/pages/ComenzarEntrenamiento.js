import React, { useEffect, useState } from "react";
import api from "../api";
import "bootstrap/dist/css/bootstrap.min.css";

function ComenzarEntrenamiento() {
  const [usuarioId] = useState(1); // Esto debería venir del contexto de autenticación
  const [diasEntrenamiento, setDiasEntrenamiento] = useState([]);
  const [diaSeleccionado, setDiaSeleccionado] = useState(null);
  const [ejercicioActualIndex, setEjercicioActualIndex] = useState(0);
  const [logs, setLogs] = useState([]); // Almacena los logs de los ejercicios completados
  const [isFinished, setIsFinished] = useState(false); // Controla la vista de finalización

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

  const handleComenzarEntrenamiento = (dia) => {
    setDiaSeleccionado(dia);
    setEjercicioActualIndex(0);
    setLogs([]);
    setIsFinished(false);
  };

  const handleSiguienteEjercicio = (e) => {
    e.preventDefault();
    const ejercicioActual = diaSeleccionado.ejercicios[ejercicioActualIndex];

    // Añade el log al estado local en lugar de enviarlo a la API
    const nuevoLog = {
      ejercicio: ejercicioActual.ejercicio, // Solo el ID
      ...formData,
    };
    setLogs([...logs, nuevoLog]);

    // Limpia el formulario
    setFormData({
      series_realizadas: "",
      repeticiones_realizadas: "",
      peso_usado: "",
    });

    // Avanza al siguiente ejercicio o a la pantalla de finalización
    if (ejercicioActualIndex < diaSeleccionado.ejercicios.length - 1) {
      setEjercicioActualIndex(ejercicioActualIndex + 1);
    } else {
      setIsFinished(true); // Muestra la pantalla para finalizar
    }
  };

  const handleFinalizar = async () => {
    const comentario = `Dificultad: ${dificultad}. ${comentarioFinal}`;
    const finalPayload = {
      workout_day: diaSeleccionado.id,
      comentarios: comentario,
      logs: logs,
    };

    try {
      // Envía todo el paquete a la nueva ruta del backend
      await api.post("workout-sessions/complete/", finalPayload);
      alert("¡Entrenamiento finalizado y guardado!");

      // Resetea el estado para permitir un nuevo entrenamiento
      setDiaSeleccionado(null);
      setEjercicioActualIndex(0);
      setLogs([]);
      setIsFinished(false);
      setComentarioFinal("");
      setDificultad("Normal");
    } catch (err) {
      console.error("Error al finalizar:", err.response ? err.response.data : err);
      alert("Hubo un error al finalizar el entrenamiento.");
    }
  };

  const getNombreRutina = (dia) => {
    const diasMap = {
      LUN: "Lunes", MAR: "Martes", MIE: "Miércoles",
      JUE: "Jueves", VIE: "Viernes", SAB: "Sábado", DOM: "Domingo",
    };
    const nombreDia = diasMap[dia.dia_de_la_semana];
    const base = `Rutina ${nombreDia}`;
    return dia.nombre ? `${base} (${dia.nombre})` : base;
  };

  // --- Vistas de Renderizado ---

  // Vista 1: Selección de Rutina
  if (!diaSeleccionado) {
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

  // Vista 2: Pantalla de Finalización
  if (isFinished) {
    return (
      <div className="container mt-4">
        <h2 className="mb-4">¡Rutina Completada!</h2>
        <p>Añade un comentario sobre tu sesión de hoy.</p>
        <div className="mb-3">
          <label htmlFor="dificultad" className="form-label">¿Qué tan difícil te pareció?</label>
          <select id="dificultad" className="form-select" value={dificultad} onChange={(e) => setDificultad(e.target.value)}>
            <option>Muy fácil</option>
            <option>Normal</option>
            <option>Difícil</option>
            <option>Muy difícil</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="comentarioFinal" className="form-label">Comentarios adicionales (opcional):</label>
          <textarea id="comentarioFinal" className="form-control" rows="3" value={comentarioFinal} onChange={(e) => setComentarioFinal(e.target.value)} placeholder="¿Cómo te sentiste? ¿Alguna molestia?" />
        </div>
        <button onClick={handleFinalizar} className="btn btn-success">
          Guardar y Finalizar Entrenamiento
        </button>
      </div>
    );
  }

  // Vista 3: Durante el Entrenamiento (Ejercicio Actual)
  const ejercicio = diaSeleccionado.ejercicios[ejercicioActualIndex];
  return (
    <div className="container mt-4">
      <h2 className="mb-4">
        Ejercicio {ejercicioActualIndex + 1} de {diaSeleccionado.ejercicios.length}: {ejercicio.ejercicio_detalle.nombre}
      </h2>
      <p className="text-muted">
        Planificado: {ejercicio.series}x{ejercicio.repeticiones} reps con {ejercicio.peso_estimado || "N/A"} kg
      </p>

      <form onSubmit={handleSiguienteEjercicio}>
        <div className="mb-3">
          <label htmlFor="series_realizadas" className="form-label">Series realizadas:</label>
          <input type="number" id="series_realizadas" name="series_realizadas" className="form-control" value={formData.series_realizadas} onChange={(e) => setFormData({ ...formData, series_realizadas: e.target.value })} required min="0" />
        </div>
        <div className="mb-3">
          <label htmlFor="repeticiones_realizadas" className="form-label">Repeticiones realizadas:</label>
          <input type="number" id="repeticiones_realizadas" name="repeticiones_realizadas" className="form-control" value={formData.repeticiones_realizadas} onChange={(e) => setFormData({ ...formData, repeticiones_realizadas: e.target.value })} required min="0" />
        </div>
        <div className="mb-3">
          <label htmlFor="peso_usado" className="form-label">Peso usado (kg):</label>
          <input type="number" id="peso_usado" name="peso_usado" className="form-control" value={formData.peso_usado} onChange={(e) => setFormData({ ...formData, peso_usado: e.target.value })} required min="0" step="0.1" />
        </div>
        <button type="submit" className="btn btn-primary">
          {ejercicioActualIndex < diaSeleccionado.ejercicios.length - 1 ? "Siguiente Ejercicio" : "Finalizar Ejercicios"}
        </button>
      </form>
    </div>
  );
}

export default ComenzarEntrenamiento;
