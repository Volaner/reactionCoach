from django.contrib.auth import logout, login, authenticate
from django.contrib.auth.views import LoginView
from django.shortcuts import render, redirect
from django.urls import reverse_lazy
from django.views import View
from django.views.generic import ListView, CreateView
from django.http import HttpResponse, HttpResponseNotFound, JsonResponse
import json

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

        return dict(list(context.items()) + list(mixin_context.items()))


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


# class LoginAjaxSample(View):
#
#     def post(self, request):
#         post = json.loads(request.body)
#         username = post.get('login')
#         password = post.get('password')
#
#         if username and password:
#             user = authenticate(username=username, password=password)
#             if user is not None:
#                 login(request, user)
#                 return JsonResponse(data={'status': 'Done'}, status=200)
#             else:
#                 return JsonResponse(data={'status': 'Fail'}, status=200)
#         else:
#             return JsonResponse(data={'status': 'login or password is empty'}, status=200)


class LoginAjax(View):

    def post(self, request):
        username = request.POST.get('username')
        password = request.POST.get('password')

        if username and password:
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                return JsonResponse(data={'status': 'Done'}, status=200)
            else:
                return JsonResponse(data={'status': 'Fail'}, status=200)
        elif username is None or password is None:
            return JsonResponse(data={'status': 'Error: login or password is not exist'}, status=200)
        elif username == '' and password == '':
            return JsonResponse(data={'status': 'login and password is empty'}, status=200)
        elif username == '':
            return JsonResponse(data={'status': 'login is empty'}, status=200)
        elif password == '':
            return JsonResponse(data={'status': 'password is empty'}, status=200)
        else:
            return JsonResponse(data={'status': 'Error: something is wrong'}, status=200)


def logout_user(request):
    logout(request)

    return redirect('login')


def get404(request, exception):
    return HttpResponseNotFound('<h1>Страница не найдена</h1>')




