import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import React, { useContext } from "react";

// Contexto y Utilidades
import AuthContext, { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./utils/PrivateRoute";

// Páginas
import Exercises from "./pages/Exercises";
import AddExercise from "./pages/AddExercise";
import AddWorkoutDay from "./pages/AddWorkoutDay";
import PlanSemanal from "./pages/PlanSemanal";
import ComenzarEntrenamiento from "./pages/ComenzarEntrenamiento";
import HistorialProgreso from "./pages/HistorialProgreso";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import EditWorkoutDay from "./pages/EditWorkoutDay";

import "bootstrap/dist/css/bootstrap.min.css";

// Componente de Navegación
const Navbar = () => {
  const { user, logoutUser } = useContext(AuthContext);
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">
          Mi Gym
        </Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {user && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/">
                    Ejercicios
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
              </>
            )}
          </ul>
          {user ? (
            <button onClick={logoutUser} className="btn btn-outline-light">
              Logout
            </button>
          ) : (
            <div>
              <Link to="/login" className="btn btn-outline-light me-2">
                Login
              </Link>
              <Link to="/register" className="btn btn-light">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

// Componente Principal de la App
function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <div className="container mt-4">
          <Routes>
            {/* Rutas Privadas */}
            <Route element={<PrivateRoute />}>
              <Route path="/" element={<Exercises />} />
              <Route path="/nuevo-ejercicio" element={<AddExercise />} />
              <Route path="/nuevo-dia" element={<AddWorkoutDay />} />
              <Route path="/plan/editar/:id" element={<EditWorkoutDay />} />
              <Route path="/plan" element={<PlanSemanal />} />
              <Route
                path="/comenzar-entrenamiento"
                element={<ComenzarEntrenamiento />}
              />
              <Route path="/historial" element={<HistorialProgreso />} />
            </Route>
            {/* Rutas Públicas */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
