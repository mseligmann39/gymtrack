from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import ExerciseViewSet, WorkoutDayViewSet, WorkoutExerciseViewSet, WorkoutLogViewSet

router = DefaultRouter()
router.register(r'exercises', ExerciseViewSet)
router.register(r'workout-days', WorkoutDayViewSet)
router.register(r'workout-exercises', WorkoutExerciseViewSet)
router.register(r'workout-logs', WorkoutLogViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
