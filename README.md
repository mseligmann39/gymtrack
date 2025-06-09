# GymTrack

GymTrack es una aplicación web para gestionar rutinas de gimnasio, creada con Django REST Framework para el backend y React para el frontend. Permite a los usuarios crear y gestionar sus rutinas, agregar ejercicios, ver su progreso y planificar su semana de entrenamiento.

---

## Tecnologías

- Backend: Django + Django REST Framework  
- Frontend: React  
- Comunicación: API REST consumida desde React  

---

## Funcionalidades principales

- Crear, modificar y eliminar ejercicios  
- Crear rutinas personalizadas  
- Registrar progreso diario  
- Visualizar historial de progreso  
- Planificar y consultar el plan semanal de entrenamiento  

---

## Instalación

### Backend

```bash
cd backend
python -m venv env
source env/bin/activate  # Windows: env\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
npm start
```

---

## Uso

1. Abre la aplicación en tu navegador (por defecto `http://localhost:3000`).  
2. Navega entre las páginas para gestionar ejercicios, planes y progreso.  
3. La aplicación se comunica con el backend para almacenar y recuperar datos.  

---

## Contribuciones

¡Las contribuciones son bienvenidas! Puedes abrir issues o pull requests para mejorar el proyecto.

---

## Licencia

Este proyecto está bajo la licencia MIT.

---

## Autor

Maximiliano Seligmann
