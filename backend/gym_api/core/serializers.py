from rest_framework import serializers
from .models import Exercise, WorkoutDay, WorkoutExercise, WorkoutLog

class ExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercise
        fields = "__all__"

class WorkoutExerciseSerializer(serializers.ModelSerializer):
    ejercicio_detalle = ExerciseSerializer(source='ejercicio', read_only=True)  # para lectura
    ejercicio = serializers.PrimaryKeyRelatedField(queryset=Exercise.objects.all())  # para escritura

    class Meta:
        model = WorkoutExercise
        fields = "__all__"


class WorkoutDaySerializer(serializers.ModelSerializer):
    ejercicios = WorkoutExerciseSerializer(many=True, read_only=True)

    class Meta:
        model = WorkoutDay
        fields = "__all__"

class WorkoutLogSerializer(serializers.ModelSerializer):
    ejercicio = ExerciseSerializer(read_only=True)
    ejercicio_id = serializers.PrimaryKeyRelatedField(queryset=Exercise.objects.all(), write_only=True, source='ejercicio')

    class Meta:
        model = WorkoutLog
        fields = '__all__'

