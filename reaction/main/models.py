from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.models import User
from django.db import models
from django.dispatch import receiver
from django.db.models.signals import post_save


def get_default_user():
    return get_user_model().objects.get_or_create(username='guest')[0]

class Result(models.Model):
    time = models.FloatField()
    time_create = models.DateTimeField(auto_now_add=True)
    enable_keyboard = models.BooleanField(default=0)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET(get_default_user),
    )


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    show_in_records = models.BooleanField(default=1)

    def __str__(self):
        return self.user.username


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)
