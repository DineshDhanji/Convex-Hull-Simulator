from django.db import models


# Create your models here.
class AlgorithmComplexity(models.Model):
    algorithm_name = models.CharField(max_length=50, unique=True)
    best_case = models.CharField(max_length=200, null=True)
    avg_case = models.CharField(max_length=200, null=True)
    worst_case = models.CharField(max_length=200, null=True)
    little_info  = models.CharField(max_length=250, null=True)
    
    class Meta:
        verbose_name = "Algorithm Complexity"
        verbose_name_plural = "Algorithm Complexities"
