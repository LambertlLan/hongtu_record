# Generated by Django 2.0.4 on 2018-04-26 15:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('data_system', '0004_recentsearchrecord'),
    ]

    operations = [
        migrations.AddField(
            model_name='userinfo',
            name='invest_score',
            field=models.PositiveIntegerField(default=30),
        ),
        migrations.AddField(
            model_name='userinfo',
            name='miguan_score',
            field=models.PositiveIntegerField(default=20),
        ),
        migrations.AddField(
            model_name='userinfo',
            name='tel_score',
            field=models.PositiveIntegerField(default=10),
        ),
    ]