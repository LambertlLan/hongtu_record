# Generated by Django 2.0.4 on 2018-04-30 12:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('data_system', '0011_auto_20180430_1235'),
    ]

    operations = [
        migrations.AddField(
            model_name='userinfo',
            name='role',
            field=models.ForeignKey(default=1, on_delete=True, to='data_system.Role', verbose_name='角色'),
        ),
    ]