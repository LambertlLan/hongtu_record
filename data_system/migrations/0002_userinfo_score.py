# Generated by Django 2.0.4 on 2018-04-20 07:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('data_system', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='userinfo',
            name='score',
            field=models.PositiveIntegerField(default=0),
        ),
    ]
