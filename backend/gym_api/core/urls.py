from django.urls import include, path
from rest_framework.routers import DefaultRouter
# Añadir WorkoutSessionViewSet
from .views import ExerciseViewSet, WorkoutDayViewSet, WorkoutExerciseViewSet, WorkoutLogViewSet, WorkoutSessionViewSet

router = DefaultRouter()
router.register(r'exercises', ExerciseViewSet)
router.register(r'workout-days', WorkoutDayViewSet)
router.register(r'workout-exercises', WorkoutExerciseViewSet)
router.register(r'workout-logs', WorkoutLogViewSet)
# Añadir esta línea
router.register(r'workout-sessions', WorkoutSessionViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
