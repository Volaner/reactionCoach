from django.conf import settings
from django.contrib.auth import get_user_model
from django.db import models


def get_default_user():
    return get_user_model().objects.get_or_create(username='guest')[0]

class Result(models.Model):
    time = models.FloatField()
    time_create = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET(get_default_user),
    )
