from datetime import datetime

from .models import *

menu = [{'title': 'Coach', 'url_name': 'home'},
        {'title': 'Records', 'url_name': 'records'}]

class DataMixin:
    def get_context(self, **kwargs):
        context = kwargs
        if not self.request.user.is_authenticated:
            context['is_login'] = False
        else:
            context['is_login'] = True
        context['menu'] = menu

        context['date'] = datetime.now().year

        return context