import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  NavLink,
} from "react-router-dom";
import React, { useContext } from "react";

// Iconos
import {
  FaHome,
  FaCalendarAlt,
  FaRunning,
  FaHistory,
  FaDumbbell,
  FaSun,
  FaMoon,
} from "react-icons/fa";

// Contexto y Utilidades
import AuthContext, { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./utils/PrivateRoute";

// Páginas
import Dashboard from "./pages/Dashboard";
import Exercises from "./pages/Exercises";
import AddExercise from "./pages/AddExercise";
import AddWorkoutDay from "./pages/AddWorkoutDay";
import PlanSemanal from "./pages/PlanSemanal";
import ComenzarEntrenamiento from "./pages/ComenzarEntrenamiento";
import HistorialProgreso from "./pages/HistorialProgreso";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import EditWorkoutDay from "./pages/EditWorkoutDay";

// Estilos
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

// --- BARRA DE NAVEGACIÓN MEJORADA ---
const Navbar = () => {
  const { user, logoutUser, theme, toggleTheme } = useContext(AuthContext);

  const navLinkStyles = ({ isActive }) => ({
    color: isActive ? (theme === 'dark' ? 'var(--dark-accent-orange)' : 'var(--light-accent-red)') : (theme === 'dark' ? 'var(--dark-text-secondary)' : 'var(--light-text-secondary)'),
    padding: '0.5rem 1rem',
    borderRadius: '5px',
    transition: 'background-color 0.3s'
  });

  return (
    <nav 
      className="navbar navbar-expand-lg"
      style={{
        backgroundColor: theme === 'dark' ? 'var(--dark-surface)' : 'var(--light-surface)',
        borderBottom: `1px solid ${theme === 'dark' ? 'var(--dark-border)' : 'var(--light-border)'}`
      }}
    >
      <div className="container-fluid">
        <Link className="navbar-brand" style={{ color: theme === 'dark' ? 'var(--dark-accent-orange)' : 'var(--light-accent-red)' }} to="/">
          <FaDumbbell /> GymTrack
        </Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {user && (
              <>
                <li><NavLink className="nav-link" style={navLinkStyles} to="/"><FaHome title="Dashboard" /></NavLink></li>
                <li><NavLink className="nav-link" style={navLinkStyles} to="/ejercicios">Ejercicios</NavLink></li>
                <li><NavLink className="nav-link" style={navLinkStyles} to="/plan"><FaCalendarAlt title="Mi Plan" /></NavLink></li>
                <li><NavLink className="nav-link" style={navLinkStyles} to="/comenzar-entrenamiento"><FaRunning title="Comenzar" /></NavLink></li>
                <li><NavLink className="nav-link" style={navLinkStyles} to="/historial"><FaHistory title="Historial" /></NavLink></li>
              </>
            )}
          </ul>
          <div className="d-flex align-items-center">
            <button onClick={toggleTheme} className="btn btn-outline-secondary me-2">
              {theme === 'dark' ? <FaSun /> : <FaMoon />}
            </button>
            {user ? (
              <button onClick={logoutUser} className="btn btn-outline-danger">Logout</button>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline-primary me-2">Login</Link>
                <Link to="/register" className="btn btn-primary">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

// --- COMPONENTE PRINCIPAL ---
function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

// --- CONTENEDOR DE CONTENIDO (para usar el contexto del tema) ---
const AppContent = () => {
  const { theme } = useContext(AuthContext);

  return (
    <div className={`${theme}-theme`}>
      <Navbar />
      <div className="page-container">
        <Routes>
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/ejercicios" element={<Exercises />} />
            <Route path="/nuevo-ejercicio" element={<AddExercise />} />
            <Route path="/nuevo-dia" element={<AddWorkoutDay />} />
            <Route path="/plan/editar/:id" element={<EditWorkoutDay />} />
            <Route path="/plan" element={<PlanSemanal />} />
            <Route path="/comenzar-entrenamiento" element={<ComenzarEntrenamiento />} />
            <Route path="/historial" element={<HistorialProgreso />} />
          </Route>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
