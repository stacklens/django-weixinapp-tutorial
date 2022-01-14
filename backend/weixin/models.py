from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

def empty_items():
    return {'items': []}

class Profile(models.Model):
    # 与User外键连接
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    # 待办清单的json字段
    items = models.JSONField(default=empty_items)


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)


@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()