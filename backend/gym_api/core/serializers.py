from rest_framework import serializers
from .models import Exercise, WorkoutDay, WorkoutExercise, WorkoutLog, WorkoutSession

class ExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercise
        fields = "__all__"

class WorkoutExerciseSerializer(serializers.ModelSerializer):
    ejercicio_detalle = ExerciseSerializer(source='ejercicio', read_only=True)
    ejercicio = serializers.PrimaryKeyRelatedField(queryset=Exercise.objects.all())

    class Meta:
        model = WorkoutExercise
        fields = "__all__"

class WorkoutDaySerializer(serializers.ModelSerializer):
    ejercicios = WorkoutExerciseSerializer(many=True, read_only=True)

    class Meta:
        model = WorkoutDay
        fields = "__all__"

# ¡MODIFICADO! Serializer para los logs individuales dentro de una sesión
class WorkoutLogSerializer(serializers.ModelSerializer):
    ejercicio_detalle = ExerciseSerializer(source='ejercicio', read_only=True)

    class Meta:
        model = WorkoutLog
        fields = ['ejercicio', 'ejercicio_detalle', 'series_realizadas', 'repeticiones_realizadas', 'peso_usado']

# ¡NUEVO! Serializer para la sesión de entrenamiento completa
class WorkoutSessionSerializer(serializers.ModelSerializer):
    logs = WorkoutLogSerializer(many=True, read_only=True)
    workout_day_detalle = WorkoutDaySerializer(source='workout_day', read_only=True)

    class Meta:
        model = WorkoutSession
        fields = ['id', 'usuario', 'workout_day', 'workout_day_detalle', 'fecha', 'comentarios', 'logs']