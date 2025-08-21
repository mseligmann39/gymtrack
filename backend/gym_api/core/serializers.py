from rest_framework import serializers
from .models import Exercise, WorkoutDay, WorkoutExercise, WorkoutLog, WorkoutSession
from django.contrib.auth.models import User


class ExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercise
        fields = ('id', 'user', 'nombre', 'descripcion',
                  'musculo_principal', 'video_url')
        read_only_fields = ('user',)


class WorkoutExerciseSerializer(serializers.ModelSerializer):
    ejercicio_detalle = ExerciseSerializer(source='ejercicio', read_only=True)
    ejercicio = serializers.PrimaryKeyRelatedField(
        queryset=Exercise.objects.all())

    class Meta:
        model = WorkoutExercise
        fields = "__all__"


class WorkoutDaySerializer(serializers.ModelSerializer):
    ejercicios = WorkoutExerciseSerializer(many=True, read_only=True)

    class Meta:
        model = WorkoutDay
        fields = "__all__"
        # ¡CORRECCIÓN! Le decimos al serializer que el campo 'usuario'
        # será manejado por el backend y no vendrá en la petición.
        read_only_fields = ('usuario',)

    def validate(self, data):
        """
        Verifica que no haya otra rutina con el mismo nombre para el mismo usuario y día.
        """
        usuario = self.context['request'].user
        dia_de_la_semana = data.get('dia_de_la_semana')
        nombre = data.get('nombre')

        if not nombre or nombre == 'Mi Rutina':
            return data

        queryset = WorkoutDay.objects.filter(
            usuario=usuario,
            dia_de_la_semana=dia_de_la_semana,
            nombre=nombre
        )
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
            'id', 'session', 'ejercicio', 'ejercicio_detalle',
            'series_realizadas', 'repeticiones_realizadas', 'peso_usado'
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


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password']
        )
        return user
