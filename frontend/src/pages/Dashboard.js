import React, { useState, useEffect, useContext } from "react"; // Import useContext
import { Link } from "react-router-dom";
import api from "../api";
import AuthContext from "../context/AuthContext"; // Import AuthContext
import "./Dashboard.css";
import { FaSun, FaMoon } from "react-icons/fa"; // Import icons

// ... (quotes array remains the same)
const quotes = [
  "La disciplina es el puente entre metas y logros.",
  "El dolor que sientes hoy será la fuerza que sientas mañana.",
  "No se trata de tener tiempo, se trata de hacer tiempo.",
  "El cuerpo logra lo que la mente cree.",
  "El único mal entrenamiento es el que no se hizo.",
];

const Dashboard = () => {
  const { user, theme, toggleTheme } = useContext(AuthContext); // Use theme from context
  const [workoutDays, setWorkoutDays] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [quote, setQuote] = useState("");

  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);

    const fetchData = async () => {
      try {
        const daysRes = await api.get("/workout-days/");
        setWorkoutDays(daysRes.data);

        const sessionsRes = await api.get("/workout-sessions/");
        setSessions(sessionsRes.data);
      } catch (error) {
        console.error("Error al cargar los datos del dashboard:", error);
      }
    };

    fetchData();
  }, []);

  // ... (logic functions remain the same)
  const getWorkoutsThisMonth = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    return sessions.filter((s) => {
      const sessionDate = new Date(s.fecha);
      return (
        sessionDate.getMonth() === currentMonth &&
        sessionDate.getFullYear() === currentYear
      );
    }).length;
  };

  const getTodayWorkout = () => {
    const dayMapping = ["DOM", "LUN", "MAR", "MIE", "JUE", "VIE", "SAB"];
    const today = dayMapping[new Date().getDay()];
    return workoutDays.find((day) => day.dia_de_la_semana === today);
  };

  const getWeekSummary = () => {
    const weekDays = ["LUN", "MAR", "MIE", "JUE", "VIE", "SAB", "DOM"];
    const today = new Date();
    const startOfWeek = new Date(
      today.setDate(
        today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)
      )
    ); // Lunes de esta semana

    return weekDays.map((dayCode) => {
      const dayData = {
        code: dayCode,
        hasRoutine: workoutDays.some((wd) => wd.dia_de_la_semana === dayCode),
        isCompleted: false,
      };

      const dayIndex = weekDays.indexOf(dayCode);
      const dateForDay = new Date(startOfWeek);
      dateForDay.setDate(startOfWeek.getDate() + dayIndex);

      dayData.isCompleted = sessions.some((s) => {
        const sessionDate = new Date(s.fecha);
        return sessionDate.toDateString() === dateForDay.toDateString();
      });

      return dayData;
    });
  };

  const todayWorkout = getTodayWorkout();
  const weekSummary = getWeekSummary();

  return (
    // Use a generic class that will be styled by theme.css
    <div className="dashboard-container">
      <div className="theme-switcher">
        <button onClick={toggleTheme}>
          {theme === "dark" ? <FaSun /> : <FaMoon />}
        </button>
      </div>

      <div className="theme-card welcome-card">
        <h2>Hola, {user.username}</h2>
        <p className="quote">
          <em>{quote}</em>
        </p>
        <p>
          Has completado <strong>{getWorkoutsThisMonth()}</strong>{" "}
          entrenamientos este mes.
        </p>
      </div>

      <div className="theme-card next-workout-card">
        <h3>Tu Próximo Entrenamiento</h3>
        {todayWorkout ? (
          <>
            <p>
              Hoy toca:{" "}
              <strong>
                {todayWorkout.nombre ||
                  `Rutina de ${todayWorkout.get_dia_de_la_semana_display}`}
              </strong>
            </p>
            <Link to="/comenzar-entrenamiento" className="btn-start-workout">
              Comenzar Entrenamiento
            </Link>
          </>
        ) : (
          <>
            <p>Hoy tienes descanso. ¡Disfruta!</p>
            <Link to="/nuevo-dia" className="btn-create-routine">
              Crear Rutina
            </Link>
          </>
        )}
      </div>

      <div className="theme-card week-summary-card">
        <h3>Resumen Semanal</h3>
        <div className="week-days">
          {weekSummary.map((day) => (
            <div
              key={day.code}
              className={`day-summary ${day.hasRoutine ? "assigned" : ""} ${
                day.isCompleted ? "completed" : ""
              }`}
            >
              <span>{day.code}</span>
              {day.isCompleted && <span className="checkmark">✅</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; // <-- AÑADIR ESTA LÍNEA
