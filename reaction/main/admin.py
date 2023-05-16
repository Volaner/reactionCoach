from django.contrib import admin

from .models import *


class ResultAdmin(admin.ModelAdmin):
    list_display = ('id', 'time', 'time_create')

admin.site.register(Result, ResultAdmin)

