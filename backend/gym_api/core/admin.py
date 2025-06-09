from django.contrib import admin
from .models import Exercise, WorkoutDay, WorkoutExercise, WorkoutLog

admin.site.register(Exercise)
admin.site.register(WorkoutDay)
admin.site.register(WorkoutExercise)
admin.site.register(WorkoutLog)
