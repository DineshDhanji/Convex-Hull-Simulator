from django.contrib import admin
from .models import AlgorithmComplexity
# Register your models here.
class AlgorithmComplexityAdmin(admin.ModelAdmin):
    list_display = ["pk", "algorithm_name"]

admin.site.register(AlgorithmComplexity, AlgorithmComplexityAdmin)