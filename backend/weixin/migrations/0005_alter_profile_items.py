# Generated by Django 4.0.1 on 2022-01-14 12:43

from django.db import migrations, models
import weixin.models


class Migration(migrations.Migration):

    dependencies = [
        ('weixin', '0004_remove_profile_liststr_profile_items'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='items',
            field=models.JSONField(default=weixin.models.empty_items),
        ),
    ]
