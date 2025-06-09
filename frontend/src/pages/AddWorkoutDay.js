import React, { useState, useEffect } from "react";
import api from "../api";
import "bootstrap/dist/css/bootstrap.min.css";

function AddWorkoutDay() {
  const [usuarioId] = useState(1); // Temporal: ID fijo. Luego dinámico con login
  const [dia, setDia] = useState("LUN");
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

    try {
      const { data: workoutDay } = await api.post("workout-days/", {
        usuario: usuarioId,
        dia_de_la_semana: dia,
      });

      await Promise.all(
        ejerciciosSeleccionados.map((ex) =>
          api.post("workout-exercises/", {
            workout_day: workoutDay.id,
            ejercicio: parseInt(ex.ejercicio),
            series: ex.series,
            repeticiones: ex.repeticiones,
            peso_estimado: ex.peso_estimado,
          })
        )
      );

      alert("Día de entrenamiento creado correctamente");
      setEjerciciosSeleccionados([]);
    } catch (err) {
      console.error("Error:", err);
      alert("Hubo un error al guardar");
    }
  };

  return (
    <div className="container mt-4">
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

        <hr />

        <h4>Ejercicios</h4>

        {ejerciciosSeleccionados.map((ex, i) => (
          <div
            key={i}
            className="border rounded p-3 mb-3"
            style={{ backgroundColor: "#f8f9fa" }}
          >
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
