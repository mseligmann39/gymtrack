import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import "bootstrap/dist/css/bootstrap.min.css";

function EditWorkoutDay() {
  const { id } = useParams(); // Obtiene el ID de la rutina desde la URL
  const navigate = useNavigate(); // Para redirigir al usuario
  
  const [dia, setDia] = useState("");
  const [nombreRutina, setNombreRutina] = useState("");
  const [ejerciciosDisponibles, setEjerciciosDisponibles] = useState([]);
  const [ejerciciosSeleccionados, setEjerciciosSeleccionados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cargar los datos de la rutina y la lista de todos los ejercicios
    const cargarDatos = async () => {
      try {
        const [resRutina, resEjercicios] = await Promise.all([
          api.get(`workout-days/${id}/`),
          api.get("exercises/"),
        ]);
        
        const rutina = resRutina.data;
        setDia(rutina.dia_de_la_semana);
        setNombreRutina(rutina.nombre);
        setEjerciciosSeleccionados(rutina.ejercicios.map(e => ({
            ...e,
            ejercicio: e.ejercicio_detalle.id // Aseguramos que el ID esté en el campo 'ejercicio'
        })));
        setEjerciciosDisponibles(resEjercicios.data);
        setLoading(false);
      } catch (err) {
        console.error("Error al cargar los datos de la rutina:", err);
        alert("No se pudo cargar la rutina para editar.");
        navigate("/plan");
      }
    };
    cargarDatos();
  }, [id, navigate]);

  const handleAgregarEjercicio = () => {
    setEjerciciosSeleccionados([...ejerciciosSeleccionados, { ejercicio: "", series: "", repeticiones: "", peso_estimado: "" }]);
  };

  const handleEjercicioChange = (index, e) => {
    const nuevos = [...ejerciciosSeleccionados];
    nuevos[index][e.target.name] = e.target.value;
    setEjerciciosSeleccionados(nuevos);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Actualizar los datos del WorkoutDay (nombre y día de la semana)
      await api.patch(`workout-days/${id}/`, {
        dia_de_la_semana: dia,
        nombre: nombreRutina,
      });

      // 2. Borrar todos los ejercicios viejos asociados a esta rutina
      const promesasDelete = ejerciciosSeleccionados.filter(ej => ej.id).map(ej => api.delete(`/workout-exercises/${ej.id}/`));
      await Promise.all(promesasDelete);

      // 3. Crear los nuevos ejercicios con la información del formulario
      const promesasCreate = ejerciciosSeleccionados.map(ex =>
        api.post("workout-exercises/", {
          workout_day: id,
          ejercicio: parseInt(ex.ejercicio),
          series: ex.series,
          repeticiones: ex.repeticiones,
          peso_estimado: ex.peso_estimado || null,
        })
      );
      await Promise.all(promesasCreate);

      alert("Rutina actualizada correctamente");
      navigate("/plan"); // Redirigir a la lista de planes
    } catch (err) {
        console.error("Error al actualizar la rutina:", err);
        alert("Hubo un error al actualizar la rutina.");
    }
  };

  if (loading) {
    return <div className="container mt-4">Cargando rutina...</div>;
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Editar Día de Entrenamiento</h2>
      <form onSubmit={handleSubmit}>
        {/* ... (resto del formulario, igual que en AddWorkoutDay) ... */}
         <div className="mb-3">
          <label htmlFor="dia" className="form-label">Día de la semana:</label>
          <select id="dia" className="form-select" value={dia} onChange={(e) => setDia(e.target.value)}>
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
          <label htmlFor="nombreRutina" className="form-label">Nombre de la Rutina:</label>
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
          <div key={i} className="border rounded p-3 mb-3 bg-light">
            <div className="mb-3">
              <label htmlFor={`ejercicio-${i}`} className="form-label">Ejercicio</label>
              <select id={`ejercicio-${i}`} name="ejercicio" className="form-select" value={ex.ejercicio} onChange={(e) => handleEjercicioChange(i, e)} required>
                <option value="">-- Selecciona un ejercicio --</option>
                {ejerciciosDisponibles.map((e) => (
                  <option key={e.id} value={e.id}>{e.nombre}</option>
                ))}
              </select>
            </div>
            <div className="row">
              <div className="col-md-4 mb-3">
                <label htmlFor={`series-${i}`} className="form-label">Series</label>
                <input id={`series-${i}`} name="series" type="number" className="form-control" placeholder="Series" value={ex.series} onChange={(e) => handleEjercicioChange(i, e)} required min="1"/>
              </div>
              <div className="col-md-4 mb-3">
                <label htmlFor={`repeticiones-${i}`} className="form-label">Repeticiones</label>
                <input id={`repeticiones-${i}`} name="repeticiones" type="number" className="form-control" placeholder="Reps" value={ex.repeticiones} onChange={(e) => handleEjercicioChange(i, e)} required min="1"/>
              </div>
              <div className="col-md-4 mb-3">
                <label htmlFor={`peso_estimado-${i}`} className="form-label">Peso Estimado</label>
                <input id={`peso_estimado-${i}`} name="peso_estimado" type="number" className="form-control" placeholder="Peso (opcional)" value={ex.peso_estimado} onChange={(e) => handleEjercicioChange(i, e)} min="0"/>
              </div>
            </div>
          </div>
        ))}
        <button type="button" className="btn btn-secondary mb-3" onClick={handleAgregarEjercicio}>+ Agregar ejercicio</button>
        <br />
        <button type="submit" className="btn btn-primary">Guardar Cambios</button>
      </form>
    </div>
  );
}

export default EditWorkoutDay;