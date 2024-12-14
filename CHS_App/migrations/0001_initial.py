# Generated by Django 4.2.6 on 2023-11-19 19:05

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='AlgorithmComplexity',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('algorithm_name', models.CharField(max_length=50, unique=True)),
                ('best_case', models.CharField(max_length=200, null=True)),
                ('avg_case', models.CharField(max_length=200, null=True)),
                ('worst_case', models.CharField(max_length=200, null=True)),
            ],
        ),
    ]
