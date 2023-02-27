from django.http import HttpResponse, HttpResponseNotFound
from django.shortcuts import render

menu = [{'title': 'Coach', 'url_name': 'home'},
        {'title': 'Records', 'url_name': 'records'}]

def index(request):
    context = {
        'title': 'reactionCoach',
        'menu': menu,
        'page_active': 'home',
        'is_login': False
    }

    return render(request, 'main/index.html', context)


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