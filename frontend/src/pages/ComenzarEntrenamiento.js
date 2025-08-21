import React, { useEffect, useState } from "react";
import api from "../api";
import "bootstrap/dist/css/bootstrap.min.css";

function ComenzarEntrenamiento() {
  const [usuarioId] = useState(1); // ID del usuario (hardcodeado)
  const [diasEntrenamiento, setDiasEntrenamiento] = useState([]);
  const [diaSeleccionado, setDiaSeleccionado] = useState(null);
  const [sesionActiva, setSesionActiva] = useState(null);
  const [ejercicioActualIndex, setEjercicioActualIndex] = useState(0);

  const [formData, setFormData] = useState({
    series_realizadas: "",
    repeticiones_realizadas: "",
    peso_usado: "",
  });
  const [comentarioFinal, setComentarioFinal] = useState("");
  const [dificultad, setDificultad] = useState("Normal");

  // Cargar los días de entrenamiento del usuario
  useEffect(() => {
    api
      .get(`workout-days/?usuario=${usuarioId}`)
      .then((res) => setDiasEntrenamiento(res.data))
      .catch((err) => console.error("Error al cargar días:", err));
  }, [usuarioId]);

  // Manejar el inicio de un entrenamiento
  const handleComenzar = (diaId) => {
    const dia = diasEntrenamiento.find((d) => d.id === diaId);
    setDiaSeleccionado(dia);
  };
  
  // Manejar el registro de un ejercicio y pasar al siguiente
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

      // Limpiar formulario
      setFormData({
        series_realizadas: "",
        repeticiones_realizadas: "",
        peso_usado: "",
      });

      // Avanzar al siguiente ejercicio
      if (ejercicioActualIndex < diaSeleccionado.ejercicios.length - 1) {
        setEjercicioActualIndex(ejercicioActualIndex + 1);
      } else {
        // Si es el último, marcamos la sesión como completada para mostrar resumen
        setDiaSeleccionado(null);
      }
    } catch (err) {
      console.error("Error al guardar el log:", err);
      alert("Error al guardar el progreso del ejercicio.");
    }
  };
  
    // Crear la sesión de entrenamiento en la base de datos
  const iniciarSesion = async () => {
    try {
      const res = await api.post("workout-sessions/", {
        usuario: usuarioId,
        workout_day: diaSeleccionado.id,
      });
      setSesionActiva(res.data);
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      alert("No se pudo iniciar la sesión de entrenamiento.");
    }
  };

  // Iniciar la sesión cuando el día ha sido seleccionado
  useEffect(() => {
    if (diaSeleccionado && !sesionActiva) {
      iniciarSesion();
    }
  }, [diaSeleccionado, sesionActiva]);


  // Finalizar el entrenamiento guardando el comentario
  const handleFinalizar = async () => {
    const comentario = `Dificultad: ${dificultad}. ${comentarioFinal}`;
    try {
      await api.patch(`workout-sessions/${sesionActiva.id}/`, {
        comentarios: comentario,
      });
      alert("¡Entrenamiento finalizado y guardado!");
      // Resetear todo el estado
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

  // --- Renderizado Condicional ---

  // 1. Pantalla de selección de rutina
  if (!diaSeleccionado && !sesionActiva) {
    return (
      <div className="container mt-4">
        <h2 className="mb-4">Comenzar Entrenamiento</h2>
        <p>Selecciona la rutina que quieres hacer hoy:</p>
        <div className="list-group">
          {diasEntrenamiento.map((dia) => (
            <button
              key={dia.id}
              type="button"
              className="list-group-item list-group-item-action"
              onClick={() => handleComenzar(dia.id)}
            >
              {dia.dia_de_la_semana}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // 2. Pantalla de entrenamiento activo
  if (sesionActiva && diaSeleccionado) {
    const ejercicio = diaSeleccionado.ejercicios[ejercicioActualIndex];
    return (
      <div className="container mt-4">
        <h2 className="mb-4">
          Ejercicio {ejercicioActualIndex + 1} de {diaSeleccionado.ejercicios.length}: {ejercicio.ejercicio_detalle.nombre}
        </h2>
        <p className="text-muted">
          Planificado: {ejercicio.series} series de {ejercicio.repeticiones} reps con {ejercicio.peso_estimado || 'N/A'} kg
        </p>

        <form onSubmit={handleSiguienteEjercicio}>
          {/* Inputs para series, repeticiones, peso */}
          <div className="mb-3">
            <label htmlFor="series_realizadas" className="form-label">Series realizadas:</label>
            <input
              type="number" id="series_realizadas" name="series_realizadas" className="form-control"
              value={formData.series_realizadas} onChange={(e) => setFormData({...formData, series_realizadas: e.target.value})} required min="0"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="repeticiones_realizadas" className="form-label">Repeticiones realizadas:</label>
            <input
              type="number" id="repeticiones_realizadas" name="repeticiones_realizadas" className="form-control"
              value={formData.repeticiones_realizadas} onChange={(e) => setFormData({...formData, repeticiones_realizadas: e.target.value})} required min="0"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="peso_usado" className="form-label">Peso usado (kg):</label>
            <input
              type="number" id="peso_usado" name="peso_usado" className="form-control"
              value={formData.peso_usado} onChange={(e) => setFormData({...formData, peso_usado: e.target.value})} required min="0" step="0.1"
            />
          </div>
          <button type="submit" className="btn btn-primary">
            {ejercicioActualIndex < diaSeleccionado.ejercicios.length - 1 ? "Siguiente Ejercicio" : "Finalizar Ejercicios"}
          </button>
        </form>
      </div>
    );
  }
  
  // 3. Pantalla de resumen y finalización
  if (sesionActiva && !diaSeleccionado) {
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