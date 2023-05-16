from django.contrib.auth import logout, login
from django.contrib.auth.views import LoginView
from django.shortcuts import render, redirect
from django.urls import reverse_lazy
from django.views.generic import ListView, CreateView
from django.http import HttpResponse, HttpResponseNotFound

from .forms import *
from .models import *
from .mixins import *


class Index(DataMixin, ListView):
    model = Result
    template_name = 'main/index.html'
    context_object_name = 'result'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        mixin_context = self.get_context(title="reactionCoach - Home", h1='reactionCoach', page_active='home')
        # context['title'] = 'reactionCoach'
        # context['menu'] = menu
        # context['page_active'] = 'home'
        # context['is_login'] = False

        return dict(list(context.items()) + list(mixin_context.items()))


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


class Records(DataMixin, ListView):
    model = Result
    template_name = 'main/records.html'
    context_object_name = 'result'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        mixin_context = self.get_context(title="reactionCoach - Records", h1='Records', page_active='records')

        return dict(list(context.items()) + list(mixin_context.items()))


class RegisterUser(DataMixin, CreateView):
    # form_class = UserCreationForm
    form_class = RegisterUserForm
    template_name = 'main/register.html'
    success_url = reverse_lazy('login')

    def get_context_data(self, *, object_list=None, **kwargs):
        context = super().get_context_data(**kwargs)
        mixin_context = self.get_context(title='Registration', h1='Please, fill in the form')

        return dict(list(context.items()) + list(mixin_context.items()))

    def form_valid(self, form):
        user = form.save()
        login(self.request, user)

        return redirect('home')


class LoginUser(DataMixin, LoginView):
    form_class = LoginUserForm
    template_name = 'main/login.html'

    def get_context_data(self, *, object_list=None, **kwargs):
        context = super().get_context_data(**kwargs)
        mixin_context = self.get_context(title='Authorization', h1='Authorization')

        return dict(list(context.items()) + list(mixin_context.items()))

    def get_success_url(self):
        return reverse_lazy('home')


def logout_user(request):
    logout(request)

    return redirect('login')


# menu = [{'title': 'Coach', 'url_name': 'home'},
#         {'title': 'Records', 'url_name': 'records'}]


def get404(request, exception):
    return HttpResponseNotFound('<h1>Страница не найдена</h1>')




