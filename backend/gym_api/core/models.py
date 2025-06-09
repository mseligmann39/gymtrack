from django.db import models
from django.contrib.auth.models import User

class Exercise(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField()
    musculo_principal = models.CharField(max_length=50)
    video_url = models.URLField(blank=True, null=True)

class WorkoutDay(models.Model):
    DIAS_SEMANA = [
        ('LUN', 'Lunes'),
        ('MAR', 'Martes'),
        ('MIE', 'Miércoles'),
        ('JUE', 'Jueves'),
        ('VIE', 'Viernes'),
        ('SAB', 'Sábado'),
        ('DOM', 'Domingo'),
    ]
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    dia_de_la_semana = models.CharField(max_length=3, choices=DIAS_SEMANA)

class WorkoutExercise(models.Model):
    workout_day = models.ForeignKey(WorkoutDay, on_delete=models.CASCADE, related_name="ejercicios")
    ejercicio = models.ForeignKey(Exercise, on_delete=models.CASCADE)
    series = models.IntegerField()
    repeticiones = models.IntegerField()
    peso_estimado = models.FloatField(null=True, blank=True)

class WorkoutLog(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    ejercicio = models.ForeignKey(Exercise, on_delete=models.CASCADE)
    fecha = models.DateField()
    series_realizadas = models.IntegerField()
    repeticiones_realizadas = models.IntegerField()
    peso_usado = models.FloatField()
    comentarios = models.TextField(blank=True, null=True)
