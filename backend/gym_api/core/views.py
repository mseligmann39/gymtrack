from rest_framework import viewsets
from .models import Exercise, WorkoutDay, WorkoutExercise, WorkoutLog
from .serializers import ExerciseSerializer, WorkoutDaySerializer, WorkoutExerciseSerializer, WorkoutLogSerializer

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
