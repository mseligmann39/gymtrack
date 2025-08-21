from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

# El modelo Exercise no cambia


class Exercise(models.Model):
    # ¡CAMBIO AQUÍ! Añadimos la relación con el usuario.
    # Es opcional (null=True) para los ejercicios globales.
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, null=True, blank=True)

    nombre = models.CharField(max_length=100)
    descripcion = models.TextField()
    musculo_principal = models.CharField(max_length=50)
    video_url = models.URLField(blank=True, null=True)

    def __str__(self):
        return self.nombre

# El modelo WorkoutDay no cambia


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
    # Hacemos el nombre opcional, sin valor por defecto
    nombre = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        # El __str__ ahora puede confiar en que siempre habrá un nombre
        return f"{self.usuario.username} - {self.nombre}"

    def save(self, *args, **kwargs):
        # Si no se proporciona un nombre, generamos uno automáticamente
        if not self.nombre:
            # Contamos cuántas rutinas existen ya para este día
            count = WorkoutDay.objects.filter(
                usuario=self.usuario,
                dia_de_la_semana=self.dia_de_la_semana
            ).count()
            # Asignamos el nombre con el número correspondiente
            self.nombre = f"Rutina de {self.get_dia_de_la_semana_display()} #{count + 1}"

        super().save(*args, **kwargs)  # Llamamos al método save original
# El modelo WorkoutExercise no cambia


class WorkoutExercise(models.Model):
    workout_day = models.ForeignKey(
        WorkoutDay, on_delete=models.CASCADE, related_name="ejercicios")
    ejercicio = models.ForeignKey(Exercise, on_delete=models.CASCADE)
    series = models.IntegerField()
    repeticiones = models.IntegerField()
    peso_estimado = models.FloatField(null=True, blank=True)

    def __str__(self):
        return f"{self.ejercicio.nombre} en {self.workout_day}"

# ¡NUEVO! Modelo para agrupar los logs de una sesión


class WorkoutSession(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    workout_day = models.ForeignKey(WorkoutDay, on_delete=models.CASCADE)
    fecha = models.DateTimeField(default=timezone.now)
    comentarios = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Sesión de {self.usuario.username} el {self.fecha.strftime('%Y-%m-%d')}"

# ¡MODIFICADO! WorkoutLog ahora se relaciona con WorkoutSession


class WorkoutLog(models.Model):
    session = models.ForeignKey(
        WorkoutSession, related_name='logs', on_delete=models.CASCADE)  # Cambio principal aquí
    ejercicio = models.ForeignKey(Exercise, on_delete=models.CASCADE)
    series_realizadas = models.IntegerField()
    repeticiones_realizadas = models.IntegerField()
    peso_usado = models.FloatField()

    def __str__(self):
        return f"Log de {self.ejercicio.nombre} en sesión {self.session.id}"
