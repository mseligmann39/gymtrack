import React, { useEffect, useState } from "react";
import api from "../api";
import "bootstrap/dist/css/bootstrap.min.css";

function Exercises() {
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    api
      .get("exercises/")
      .then((response) => setExercises(response.data))
      .catch((error) => console.error("Error al cargar ejercicios:", error));
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Lista de Ejercicios</h2>
      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Nombre</th>
            <th>Músculo Principal</th>
          </tr>
        </thead>
        <tbody>
          {exercises.map((e) => (
            <tr key={e.id}>
              <td>
                <strong>{e.nombre}</strong>
              </td>
              <td>{e.musculo_principal}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Exercises;
