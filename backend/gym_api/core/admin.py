from django.contrib import admin
from .models import Exercise, WorkoutDay, WorkoutExercise, WorkoutLog

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

# Clase para personalizar la vista de WorkoutLog


class WorkoutLogAdmin(admin.ModelAdmin):
    list_display = ('usuario', 'ejercicio', 'fecha',
                    'series_realizadas', 'repeticiones_realizadas', 'peso_usado')
    list_filter = ('fecha', 'usuario', 'ejercicio')
    search_fields = ('usuario__username', 'ejercicio__nombre')


# Registrar todos los modelos con sus personalizaciones
admin.site.register(Exercise, ExerciseAdmin)
admin.site.register(WorkoutDay, WorkoutDayAdmin)
admin.site.register(WorkoutExercise, WorkoutExerciseAdmin)
admin.site.register(WorkoutLog, WorkoutLogAdmin)
