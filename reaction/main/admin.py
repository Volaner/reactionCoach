from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User

from .models import *


class ResultAdmin(admin.ModelAdmin):
    list_display = ('id', 'time', 'time_create')


class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False
    verbose_name = 'profile'
    verbose_name_plural = 'profiles'


class UserAdmin(BaseUserAdmin):
    def add_view(self, *args, **kwargs):
        self.inlines = []
        return super(UserAdmin, self).add_view(*args, **kwargs)
    def change_view(self, *args, **kwargs):
        self.inlines = [UserProfileInline]
        return super(UserAdmin, self).change_view(*args, **kwargs)


admin.site.register(Result, ResultAdmin)
admin.site.unregister(User)
admin.site.register(User, UserAdmin)

