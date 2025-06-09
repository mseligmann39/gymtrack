import React, { useState } from "react";
import api from "../api";
import "bootstrap/dist/css/bootstrap.min.css";

function AddExercise() {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    musculo_principal: "",
    video_url: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("exercises/", formData);
      alert("Ejercicio creado correctamente");
      setFormData({
        nombre: "",
        descripcion: "",
        musculo_principal: "",
        video_url: "",
      });
    } catch (error) {
      console.error("Error al crear ejercicio:", error);
      alert("Hubo un error");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Crear Nuevo Ejercicio</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="nombre" className="form-label">
            Nombre:
          </label>
          <input
            type="text"
            className="form-control"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            placeholder="Nombre del ejercicio"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="descripcion" className="form-label">
            Descripción:
          </label>
          <textarea
            className="form-control"
            id="descripcion"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            required
            rows="3"
            placeholder="Descripción del ejercicio"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="musculo_principal" className="form-label">
            Músculo principal:
          </label>
          <input
            type="text"
            className="form-control"
            id="musculo_principal"
            name="musculo_principal"
            value={formData.musculo_principal}
            onChange={handleChange}
            required
            placeholder="Ejemplo: Pecho, Piernas..."
          />
        </div>

        <div className="mb-3">
          <label htmlFor="video_url" className="form-label">
            Video URL (opcional):
          </label>
          <input
            type="url"
            className="form-control"
            id="video_url"
            name="video_url"
            value={formData.video_url}
            onChange={handleChange}
            placeholder="https://"
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Crear ejercicio
        </button>
      </form>
    </div>
  );
}

export default AddExercise;
