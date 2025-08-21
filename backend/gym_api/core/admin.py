from django.contrib import admin
from .models import Exercise, WorkoutDay, WorkoutExercise, WorkoutLog, WorkoutSession

# Clase para personalizar la vista de Exercise


class ExerciseAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'musculo_principal')
    search_fields = ('nombre', 'musculo_principal')

# Clase para personalizar la vista de WorkoutDay


class WorkoutDayAdmin(admin.ModelAdmin):
    list_display = ('usuario', 'dia_de_la_semana')
    list_filter = ('dia_de_la_semana', 'usuario')
    search_fields = ('usuario__username', 'dia_de_la_semana')

# Clase para personalizar la vista de WorkoutExercise


class WorkoutExerciseAdmin(admin.ModelAdmin):
    list_display = ('ejercicio', 'workout_day', 'series',
                    'repeticiones', 'peso_estimado')
    list_filter = ('workout_day__dia_de_la_semana',)
    search_fields = ('ejercicio__nombre', 'workout_day__usuario__username')

# ¡NUEVO! Clase para la vista de WorkoutSession


class WorkoutSessionAdmin(admin.ModelAdmin):
    list_display = ('usuario', 'workout_day', 'fecha', 'comentarios')
    list_filter = ('fecha', 'usuario')
    search_fields = ('usuario__username', 'workout_day__dia_de_la_semana')

# ¡CORREGIDO! Clase para la vista de WorkoutLog


class WorkoutLogAdmin(admin.ModelAdmin):
    # Accedemos a los campos a través de la relación 'session'
    list_display = ('get_usuario', 'ejercicio', 'get_fecha',
                    'series_realizadas', 'repeticiones_realizadas', 'peso_usado')
    list_filter = ('session__fecha', 'session__usuario', 'ejercicio')
    search_fields = ('session__usuario__username', 'ejercicio__nombre')

    # Métodos para mostrar los campos relacionados en la lista
    def get_usuario(self, obj):
        return obj.session.usuario
    get_usuario.short_description = 'Usuario'

    def get_fecha(self, obj):
        return obj.session.fecha
    get_fecha.short_description = 'Fecha'


# Registrar todos los modelos, incluyendo el nuevo
admin.site.register(Exercise, ExerciseAdmin)
admin.site.register(WorkoutDay, WorkoutDayAdmin)
admin.site.register(WorkoutExercise, WorkoutExerciseAdmin)
# Se registra el nuevo modelo
admin.site.register(WorkoutSession, WorkoutSessionAdmin)
admin.site.register(WorkoutLog, WorkoutLogAdmin)
