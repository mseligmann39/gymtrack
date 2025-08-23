import React, { useState, useEffect } from "react";
import api from "../api";
import "bootstrap/dist/css/bootstrap.min.css";

function AddWorkoutDay() {
  // El ID de usuario hardcodeado se ha eliminado. El backend se encargará de esto.

  const [dia, setDia] = useState("LUN");
  const [nombreRutina, setNombreRutina] = useState("");
  const [ejerciciosDisponibles, setEjerciciosDisponibles] = useState([]);
  const [ejerciciosSeleccionados, setEjerciciosSeleccionados] = useState([]);

  useEffect(() => {
    api
      .get("exercises/")
      .then((res) => setEjerciciosDisponibles(res.data))
      .catch((err) => console.error("Error al cargar ejercicios:", err));
  }, []);

  const handleAgregarEjercicio = () => {
    setEjerciciosSeleccionados([
      ...ejerciciosSeleccionados,
      {
        ejercicio: "",
        series: "",
        repeticiones: "",
        peso_estimado: "",
      },
    ]);
  };

  const handleEjercicioChange = (index, e) => {
    const nuevos = [...ejerciciosSeleccionados];
    nuevos[index][e.target.name] = e.target.value;
    setEjerciciosSeleccionados(nuevos);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (ejerciciosSeleccionados.length === 0) {
      alert("Debes agregar al menos un ejercicio a la rutina.");
      return;
    }

    try {
      // ¡CORRECCIÓN! Ya no enviamos el campo 'usuario'. El backend lo asignará.
      const { data: workoutDay } = await api.post("workout-days/", {
        dia_de_la_semana: dia,
        nombre: nombreRutina,
      });

      await Promise.all(
        ejerciciosSeleccionados.map((ex) =>
          api.post("workout-exercises/", {
            workout_day: workoutDay.id,
            ejercicio: parseInt(ex.ejercicio),
            series: ex.series,
            repeticiones: ex.repeticiones,
            peso_estimado: ex.peso_estimado || null,
          })
        )
      );

      alert("Día de entrenamiento creado correctamente");
      setEjerciciosSeleccionados([]);
      setNombreRutina("");
    } catch (err) {
      if (
        err.response &&
        err.response.data &&
        err.response.data.non_field_errors
      ) {
        alert(`Error de validación: ${err.response.data.non_field_errors[0]}`);
      } else if (err.response && err.response.data) {
        const errorMsg = Object.values(err.response.data).join("\n");
        alert(`Error: ${errorMsg}`);
      } else {
        console.error("Error:", err);
        alert("Hubo un error al guardar la rutina.");
      }
    }
  };

  return (
    <div className="container mt-4 theme-card">
      <h2 className="mb-4">Crear Día de Entrenamiento</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="dia" className="form-label">
            Día de la semana:
          </label>
          <select
            id="dia"
            className="form-select"
            value={dia}
            onChange={(e) => setDia(e.target.value)}
          >
            <option value="LUN">Lunes</option>
            <option value="MAR">Martes</option>
            <option value="MIE">Miércoles</option>
            <option value="JUE">Jueves</option>
            <option value="VIE">Viernes</option>
            <option value="SAB">Sábado</option>
            <option value="DOM">Domingo</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="nombreRutina" className="form-label">
            Nombre de la Rutina (opcional):
          </label>
          <input
            type="text"
            id="nombreRutina"
            className="form-control"
            value={nombreRutina}
            onChange={(e) => setNombreRutina(e.target.value)}
            placeholder="Ej: Rutina de Fuerza, Día de Pecho..."
          />
        </div>
        <hr />
        <h4>Ejercicios</h4>
        {ejerciciosSeleccionados.map((ex, i) => (
          <div key={i} className="border rounded p-3 mb-3 selected-exercise">
            <div className="mb-3">
              <label htmlFor={`ejercicio-${i}`} className="form-label">
                Ejercicio
              </label>
              <select
                id={`ejercicio-${i}`}
                name="ejercicio"
                className="form-select"
                value={ex.ejercicio}
                onChange={(e) => handleEjercicioChange(i, e)}
                required
              >
                <option value="">-- Selecciona un ejercicio --</option>
                {ejerciciosDisponibles.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="row">
              <div className="col-md-4 mb-3">
                <label htmlFor={`series-${i}`} className="form-label">
                  Series
                </label>
                <input
                  id={`series-${i}`}
                  name="series"
                  type="number"
                  className="form-control"
                  placeholder="Series"
                  value={ex.series}
                  onChange={(e) => handleEjercicioChange(i, e)}
                  required
                  min="1"
                />
              </div>
              <div className="col-md-4 mb-3">
                <label htmlFor={`repeticiones-${i}`} className="form-label">
                  Repeticiones
                </label>
                <input
                  id={`repeticiones-${i}`}
                  name="repeticiones"
                  type="number"
                  className="form-control"
                  placeholder="Reps"
                  value={ex.repeticiones}
                  onChange={(e) => handleEjercicioChange(i, e)}
                  required
                  min="1"
                />
              </div>
              <div className="col-md-4 mb-3">
                <label htmlFor={`peso_estimado-${i}`} className="form-label">
                  Peso Estimado
                </label>
                <input
                  id={`peso_estimado-${i}`}
                  name="peso_estimado"
                  type="number"
                  className="form-control"
                  placeholder="Peso (opcional)"
                  value={ex.peso_estimado}
                  onChange={(e) => handleEjercicioChange(i, e)}
                  min="0"
                />
              </div>
            </div>
          </div>
        ))}
        <button
          type="button"
          className="btn btn-secondary mb-3"
          onClick={handleAgregarEjercicio}
        >
          + Agregar ejercicio
        </button>
        <br />
        <button type="submit" className="btn btn-primary">
          Guardar día
        </button>
      </form>
    </div>
  );
}

export default AddWorkoutDay;
