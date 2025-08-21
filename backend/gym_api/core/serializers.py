from rest_framework import serializers
from .models import Exercise, WorkoutDay, WorkoutExercise, WorkoutLog, WorkoutSession
# Asegúrate de que User esté importado
from django.contrib.auth.models import User


class ExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercise
        fields = "__all__"


class WorkoutExerciseSerializer(serializers.ModelSerializer):
    ejercicio_detalle = ExerciseSerializer(source='ejercicio', read_only=True)
    ejercicio = serializers.PrimaryKeyRelatedField(
        queryset=Exercise.objects.all())

    class Meta:
        model = WorkoutExercise
        fields = "__all__"

# ¡CORREGIDO! Serializer de WorkoutDay con la validación correcta


class WorkoutDaySerializer(serializers.ModelSerializer):
    ejercicios = WorkoutExerciseSerializer(many=True, read_only=True)

    class Meta:
        model = WorkoutDay
        fields = "__all__"

    def validate(self, data):
        """
        Verifica que no haya otra rutina con el mismo nombre para el mismo usuario y día.
        """
        # Obtenemos el usuario del ID que viene en los datos, no del request.
        usuario_id = data.get('usuario').id
        usuario = User.objects.get(pk=usuario_id)

        dia_de_la_semana = data.get('dia_de_la_semana')
        nombre = data.get('nombre')

        # Si el nombre no se provee, no es necesario validar duplicados.
        if not nombre or nombre == 'Mi Rutina':
            return data

        # Construimos la consulta para buscar duplicados
        queryset = WorkoutDay.objects.filter(
            usuario=usuario,
            dia_de_la_semana=dia_de_la_semana,
            nombre=nombre
        )

        # Si estamos actualizando una instancia, la excluimos de la búsqueda
        if self.instance:
            queryset = queryset.exclude(pk=self.instance.pk)

        if queryset.exists():
            raise serializers.ValidationError(
                f"Ya tienes una rutina llamada '{nombre}' para este día. Por favor, elige otro nombre."
            )

        return data


class WorkoutLogSerializer(serializers.ModelSerializer):
    ejercicio_detalle = ExerciseSerializer(source='ejercicio', read_only=True)

    class Meta:
        model = WorkoutLog
        fields = [
            'id',
            'session',
            'ejercicio',
            'ejercicio_detalle',
            'series_realizadas',
            'repeticiones_realizadas',
            'peso_usado'
        ]
        read_only_fields = ['ejercicio_detalle']


class WorkoutSessionSerializer(serializers.ModelSerializer):
    logs = WorkoutLogSerializer(many=True, read_only=True)
    workout_day_detalle = WorkoutDaySerializer(
        source='workout_day', read_only=True)

    class Meta:
        model = WorkoutSession
        fields = ['id', 'usuario', 'workout_day',
                  'workout_day_detalle', 'fecha', 'comentarios', 'logs']
