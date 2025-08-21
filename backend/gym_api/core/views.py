from rest_framework import viewsets
from django.db.models import Count
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

    # Añadimos este método para pasar el 'request' al serializer
    def get_serializer_context(self):
        context = super(WorkoutDayViewSet, self).get_serializer_context()
        context.update({"request": self.request})
        return context


class WorkoutExerciseViewSet(viewsets.ModelViewSet):
    queryset = WorkoutExercise.objects.all()
    serializer_class = WorkoutExerciseSerializer


class WorkoutLogViewSet(viewsets.ModelViewSet):
    queryset = WorkoutLog.objects.all()
    serializer_class = WorkoutLogSerializer

# ¡NUEVO! ViewSet para las sesiones de entrenamiento


class WorkoutSessionViewSet(viewsets.ModelViewSet):
    # Filtramos para devolver solo sesiones con 1 o más logs
    queryset = WorkoutSession.objects.annotate(
        log_count=Count('logs')
    ).filter(log_count__gt=0)
    serializer_class = WorkoutSessionSerializer
