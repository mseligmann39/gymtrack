from rest_framework import viewsets, generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.models import User
from django.db.models import Count, Q
from .models import Exercise, WorkoutDay, WorkoutExercise, WorkoutLog, WorkoutSession
from .serializers import (
    ExerciseSerializer, WorkoutDaySerializer, WorkoutExerciseSerializer,
    WorkoutLogSerializer, WorkoutSessionSerializer, UserSerializer
)


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = UserSerializer

    def perform_create(self, serializer):
        new_user = serializer.save()
        try:
            template_user = User.objects.get(username='test')
            template_workout_days = WorkoutDay.objects.filter(
                usuario=template_user)
            for day_template in template_workout_days:
                new_day = WorkoutDay.objects.create(
                    usuario=new_user,
                    dia_de_la_semana=day_template.dia_de_la_semana,
                    nombre=day_template.nombre
                )
                for exercise_link in day_template.ejercicios.all():
                    WorkoutExercise.objects.create(
                        workout_day=new_day,
                        ejercicio=exercise_link.ejercicio,
                        series=exercise_link.series,
                        repeticiones=exercise_link.repeticiones,
                        peso_estimado=exercise_link.peso_estimado
                    )
        except User.DoesNotExist:
            pass


class ExerciseViewSet(viewsets.ModelViewSet):
    serializer_class = ExerciseSerializer
    permission_classes = [IsAuthenticated]
    queryset = Exercise.objects.all()

    def get_queryset(self):
        user = self.request.user
        return Exercise.objects.filter(Q(user=None) | Q(user=user))

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_object(self):
        obj = super().get_object()
        if self.action in ['update', 'partial_update', 'destroy']:
            if obj.user != self.request.user:
                self.permission_denied(
                    self.request, message="No tienes permiso para editar o eliminar este ejercicio."
                )
        return obj


class WorkoutDayViewSet(viewsets.ModelViewSet):
    serializer_class = WorkoutDaySerializer
    permission_classes = [IsAuthenticated]
    queryset = WorkoutDay.objects.all()

    def get_queryset(self):
        return WorkoutDay.objects.filter(usuario=self.request.user)

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)

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
    queryset = WorkoutLog.objects.all()

    def get_queryset(self):
        return WorkoutLog.objects.filter(session__usuario=self.request.user)


class WorkoutSessionViewSet(viewsets.ModelViewSet):
    serializer_class = WorkoutSessionSerializer
    permission_classes = [IsAuthenticated]
    queryset = WorkoutSession.objects.all()

    def get_queryset(self):
        """
        Filtra las sesiones por el usuario actual.
        Para la vista de lista (historial), además oculta las sesiones vacías.
        """
        queryset = WorkoutSession.objects.filter(usuario=self.request.user)

        # ¡CORRECCIÓN! Solo aplicamos el filtro de "logs > 0"
        # cuando se pide la lista completa (en el historial).
        if self.action == 'list':
            queryset = queryset.annotate(
                log_count=Count('logs')
            ).filter(log_count__gt=0)

        return queryset
