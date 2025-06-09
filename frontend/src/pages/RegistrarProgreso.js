import React, { useEffect, useState } from "react";
import api from "../api";
import "bootstrap/dist/css/bootstrap.min.css";

function RegistrarProgreso() {
  const [usuarioId] = useState(1); // ID del usuario logueado (hardcodeado por ahora)
  const [ejercicios, setEjercicios] = useState([]);
  const [formData, setFormData] = useState({
    ejercicio: "",
    fecha: new Date().toISOString().split("T")[0], // hoy
    series_realizadas: "",
    repeticiones_realizadas: "",
    peso_usado: "",
    comentarios: "",
  });

  useEffect(() => {
    api
      .get("exercises/")
      .then((res) => setEjercicios(res.data))
      .catch((err) => console.error("Error al cargar ejercicios:", err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("workout-logs/", {
        ...formData,
        ejercicio_id: parseInt(formData.ejercicio),
        usuario: usuarioId,
      });
      alert("Progreso registrado ✅");
      setFormData({
        ejercicio: "",
        fecha: new Date().toISOString().split("T")[0],
        series_realizadas: "",
        repeticiones_realizadas: "",
        peso_usado: "",
        comentarios: "",
      });
    } catch (err) {
      console.error("Error al registrar progreso:", err);
      alert("Error al guardar");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Registrar Progreso Diario</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="ejercicio" className="form-label">
            Ejercicio:
          </label>
          <select
            id="ejercicio"
            name="ejercicio"
            className="form-select"
            value={formData.ejercicio}
            onChange={handleChange}
            required
          >
            <option value="">-- Selecciona --</option>
            {ejercicios.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="fecha" className="form-label">
            Fecha:
          </label>
          <input
            type="date"
            id="fecha"
            name="fecha"
            className="form-control"
            value={formData.fecha}
            onChange={handleChange}
            required
          />
        </div>

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
            onChange={handleChange}
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
            onChange={handleChange}
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
            onChange={handleChange}
            required
            min="0"
            step="0.1"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="comentarios" className="form-label">
            Comentarios:
          </label>
          <textarea
            id="comentarios"
            name="comentarios"
            className="form-control"
            rows="3"
            value={formData.comentarios}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Guardar
        </button>
      </form>
    </div>
  );
}

export default RegistrarProgreso;
