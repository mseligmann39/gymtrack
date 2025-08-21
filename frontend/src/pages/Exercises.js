import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import AuthContext from "../context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";

function Exercises() {
  const [exercises, setExercises] = useState([]);
  const { user } = useContext(AuthContext); // Obtener el usuario actual

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = () => {
    api
      .get("exercises/")
      .then((response) => setExercises(response.data))
      .catch((error) => console.error("Error al cargar ejercicios:", error));
  };

  const handleEliminar = async (id) => {
    if (
      window.confirm(
        "¿Seguro que quieres eliminar este ejercicio personalizado?"
      )
    ) {
      try {
        await api.delete(`exercises/${id}/`);
        alert("Ejercicio eliminado.");
        fetchExercises();
      } catch (err) {
        console.error(err);
        alert("Error al eliminar el ejercicio.");
      }
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Lista de Ejercicios</h2>
        <Link to="/nuevo-ejercicio" className="btn btn-primary">
          Crear Ejercicio Personalizado
        </Link>
      </div>
      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Nombre</th>
            <th>Músculo Principal</th>
            <th>Tipo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {exercises.map((e) => (
            <tr key={e.id}>
              <td>
                <strong>{e.nombre}</strong>
              </td>
              <td>{e.musculo_principal}</td>
              <td>{e.user ? "Personalizado" : "Global"}</td>
              <td>
                {/* Mostrar botones solo si el ejercicio pertenece al usuario */}
                {e.user === user.user_id && (
                  <>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleEliminar(e.id)}
                    >
                      Eliminar
                    </button>
                    {/* El botón de editar lo implementaremos en el siguiente paso */}
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Exercises;
