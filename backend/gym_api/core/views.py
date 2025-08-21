from rest_framework import viewsets
# Añadir WorkoutSession
from .models import Exercise, WorkoutDay, WorkoutExercise, WorkoutLog, WorkoutSession
# Añadir WorkoutSessionSerializer
from .serializers import ExerciseSerializer, WorkoutDaySerializer, WorkoutExerciseSerializer, WorkoutLogSerializer, WorkoutSessionSerializer


class ExerciseViewSet(viewsets.ModelViewSet):
    queryset = Exercise.objects.all()
    serializer_class = ExerciseSerializer


class WorkoutDayViewSet(viewsets.ModelViewSet):
    queryset = WorkoutDay.objects.all()
    serializer_class = WorkoutDaySerializer


class WorkoutExerciseViewSet(viewsets.ModelViewSet):
    queryset = WorkoutExercise.objects.all()
    serializer_class = WorkoutExerciseSerializer


class WorkoutLogViewSet(viewsets.ModelViewSet):
    queryset = WorkoutLog.objects.all()
    serializer_class = WorkoutLogSerializer

# ¡NUEVO! ViewSet para las sesiones de entrenamiento


class WorkoutSessionViewSet(viewsets.ModelViewSet):
    queryset = WorkoutSession.objects.all()
    serializer_class = WorkoutSessionSerializer
