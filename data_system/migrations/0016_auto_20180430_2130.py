# Generated by Django 2.0.4 on 2018-04-30 21:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('data_system', '0015_auto_20180430_2053'),
    ]

    operations = [
        migrations.AddField(
            model_name='enterpriseexamine',
            name='corporation_name',
            field=models.CharField(default=None, max_length=32, verbose_name='法人姓名'),
        ),
        migrations.AddField(
            model_name='userinfo',
            name='corporation_name',
            field=models.CharField(blank=True, default=None, max_length=32, verbose_name='法人姓名'),
        ),
    ]
