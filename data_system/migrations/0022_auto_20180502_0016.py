# Generated by Django 2.0.4 on 2018-05-02 00:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('data_system', '0021_auto_20180501_2331'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userinfo',
            name='real_name',
            field=models.CharField(blank=True, default=None, max_length=32, null=True, verbose_name='真实姓名'),
        ),
    ]
