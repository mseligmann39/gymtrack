from rest_framework import viewsets, generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.models import User
from django.db.models import Count
from .models import Exercise, WorkoutDay, WorkoutExercise, WorkoutLog, WorkoutSession
from .serializers import (
    ExerciseSerializer, WorkoutDaySerializer, WorkoutExerciseSerializer,
    WorkoutLogSerializer, WorkoutSessionSerializer, UserSerializer
)


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = UserSerializer


class ExerciseViewSet(viewsets.ModelViewSet):
    queryset = Exercise.objects.all()
    serializer_class = ExerciseSerializer
    permission_classes = [IsAuthenticated]


class WorkoutDayViewSet(viewsets.ModelViewSet):
    serializer_class = WorkoutDaySerializer
    permission_classes = [IsAuthenticated]
    # ¡CORRECCIÓN! Se añade el queryset estático de nuevo.
    queryset = WorkoutDay.objects.all()

    def get_queryset(self):
        # El método dinámico sigue funcionando y filtrando por usuario.
        return WorkoutDay.objects.filter(usuario=self.request.user)

    def get_serializer_context(self):
        context = super(WorkoutDayViewSet, self).get_serializer_context()
        context.update({"request": self.request})
        return context


class WorkoutExerciseViewSet(viewsets.ModelViewSet):
    queryset = WorkoutExercise.objects.all()
    serializer_class = WorkoutExerciseSerializer
    permission_classes = [IsAuthenticated]


class WorkoutLogViewSet(viewsets.ModelViewSet):
    serializer_class = WorkoutLogSerializer
    permission_classes = [IsAuthenticated]
    # ¡CORRECCIÓN! Se añade el queryset estático de nuevo.
    queryset = WorkoutLog.objects.all()

    def get_queryset(self):
        return WorkoutLog.objects.filter(session__usuario=self.request.user)


class WorkoutSessionViewSet(viewsets.ModelViewSet):
    serializer_class = WorkoutSessionSerializer
    permission_classes = [IsAuthenticated]
    # ¡CORRECCIÓN! Se añade el queryset estático de nuevo.
    queryset = WorkoutSession.objects.all()

    def get_queryset(self):
        return WorkoutSession.objects.annotate(
            log_count=Count('logs')
        ).filter(
            log_count__gt=0,
            usuario=self.request.user
        )
