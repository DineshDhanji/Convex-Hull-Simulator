# Generated by Django 4.2.6 on 2023-11-19 19:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('CHS_App', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='algorithmcomplexity',
            options={'verbose_name': 'Algorithm Complexity', 'verbose_name_plural': 'Algorithm Complexities'},
        ),
        migrations.AddField(
            model_name='algorithmcomplexity',
            name='little_info',
            field=models.CharField(max_length=250, null=True),
        ),
    ]
