from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import (
    ExerciseViewSet, WorkoutDayViewSet, WorkoutExerciseViewSet,
    WorkoutLogViewSet, WorkoutSessionViewSet, RegisterView  # Importar RegisterView
)


router = DefaultRouter()
router.register(r'exercises', ExerciseViewSet)
router.register(r'workout-days', WorkoutDayViewSet)
router.register(r'workout-exercises', WorkoutExerciseViewSet)
router.register(r'workout-logs', WorkoutLogViewSet)
# Añadir esta línea
router.register(r'workout-sessions', WorkoutSessionViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegisterView.as_view(),
         name='auth_register'),  # ¡Añadir esta línea!
]
