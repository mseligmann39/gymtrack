from rest_framework import viewsets, generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.db import transaction
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
        # SOLUCIÓN: Simplemente creamos el usuario sin copiar ninguna plantilla.
        serializer.save()


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
    queryset = WorkoutSession.objects.all()  # <-- ESTA LÍNEA ES LA SOLUCIÓN

    def get_queryset(self):
        """
        Filtra las sesiones por el usuario actual y solo muestra las que tienen logs.
        """
        return WorkoutSession.objects.filter(usuario=self.request.user).annotate(
            log_count=Count('logs')
        ).filter(log_count__gt=0)

    @action(detail=False, methods=['post'], url_path='complete')
    def complete_session(self, request):
        """
        Crea una sesión de entrenamiento y sus logs en una sola transacción.
        Este endpoint reemplaza el flujo anterior de crear y luego actualizar.
        """
        workout_day_id = request.data.get('workout_day')
        logs_data = request.data.get('logs', [])
        comentarios = request.data.get('comentarios', '')

        if not workout_day_id or not logs_data:
            return Response(
                {'error': 'Se requiere workout_day y al menos un log.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            workout_day = WorkoutDay.objects.get(
                id=workout_day_id, usuario=request.user)
        except WorkoutDay.DoesNotExist:
            return Response(
                {'error': 'El día de entrenamiento no existe o no te pertenece.'},
                status=status.HTTP_404_NOT_FOUND
            )

        try:
            with transaction.atomic():
                # 1. Crear la sesión
                session = WorkoutSession.objects.create(
                    usuario=request.user,
                    workout_day=workout_day,
                    comentarios=comentarios
                )

                # 2. Crear los logs
                for log_data in logs_data:
                    WorkoutLog.objects.create(
                        session=session,
                        ejercicio_id=log_data.get('ejercicio'),
                        series_realizadas=log_data.get('series_realizadas'),
                        repeticiones_realizadas=log_data.get('repeticiones_realizadas'),
                        peso_usado=log_data.get('peso_usado')
                    )

                serializer = self.get_serializer(session)
                return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response(
                {'error': f'Ocurrió un error inesperado: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
