from django.http import HttpResponse, HttpResponseNotFound
from django.shortcuts import render
from django.views.generic import ListView

from .models import *

menu = [{'title': 'Coach', 'url_name': 'home'},
        {'title': 'Records', 'url_name': 'records'}]

class Index(ListView):
    model = Result
    template_name = 'main/index.html'
    context_object_name = 'result'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'reactionCoach'
        context['menu'] = menu
        context['page_active'] = 'home'
        context['is_login'] = False
        return context


"""
def index(request):
    context = {
        'title': 'reactionCoach',
        'menu': menu,
        'page_active': 'home',
        'is_login': False
    }

    return render(request, 'main/index.html', context)
"""

def records(request):
    context = {
        'title': 'Records',
        'menu': menu,
        'page_active': 'records',
        'is_login': True
    }
    return render(request, 'main/records.html', context)


def get404(request, exception):
    return HttpResponseNotFound('<h1>Страница не найдена</h1>')