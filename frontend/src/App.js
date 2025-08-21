import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Exercises from "./pages/Exercises";
import AddExercise from "./pages/AddExercise";
import AddWorkoutDay from "./pages/AddWorkoutDay";
import PlanSemanal from "./pages/PlanSemanal";
import ComenzarEntrenamiento from "./pages/ComenzarEntrenamiento";
import HistorialProgreso from "./pages/HistorialProgreso";
import "bootstrap/dist/css/bootstrap.min.css";
import EditWorkoutDay from "./pages/EditWorkoutDay";

function App() {
  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <Link className="navbar-brand" to="/">
            Mi Gym
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  Ejercicios
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/nuevo-ejercicio">
                  Nuevo Ejercicio
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/nuevo-dia">
                  Nuevo Día
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/plan">
                  Mi Plan
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/comenzar-entrenamiento">
                  Comenzar Entrenamiento
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/historial">
                  Ver Historial
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Exercises />} />
          <Route path="/nuevo-ejercicio" element={<AddExercise />} />
          <Route path="/nuevo-dia" element={<AddWorkoutDay />} />
          <Route path="/plan" element={<PlanSemanal />} />
          <Route
            path="/comenzar-entrenamiento"
            element={<ComenzarEntrenamiento />}
          />
          <Route path="/historial" element={<HistorialProgreso />} />

          <Route path="/plan/editar/:id" element={<EditWorkoutDay />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
