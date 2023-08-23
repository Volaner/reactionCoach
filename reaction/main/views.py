from django.contrib.auth import logout, login, authenticate
from django.contrib.auth.forms import PasswordResetForm
from django.contrib.auth.views import LoginView, PasswordResetView, PasswordResetConfirmView
from django.shortcuts import render, redirect
from django.urls import reverse_lazy
from django.views import View
from django.views.generic import ListView, CreateView, TemplateView
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
        mixin_context = self.get_context(
            title='reactionCoach - Home',
            description='Aliquam erat volutpat. Proin quis augue id magna accumsan euismod. Donec ornare sagittis nulla ac facilisis. Curabitur accumsan efficitur faucibus. Suspendisse a cursus sapien.',
            h1='reactionCoach',
            page_active='home'
        )

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
        mixin_context = self.get_context(
            title='Registration',
            description='Registration new user',
            h1='Please, fill in the form'
        )

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
        mixin_context = self.get_context(
            title='Authorization',
            description='Authorization user',
            h1='Authorization'
        )

        return dict(list(context.items()) + list(mixin_context.items()))

    def get_success_url(self):
        return reverse_lazy('home')


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


class ResetPassword(DataMixin, PasswordResetView):
    form_class = PasswordReset
    success_url = reverse_lazy('resetPasswordEmailSent')
    template_name = 'main/reset_password.html'

    def get_context_data(self, *, object_list=None, **kwargs):
        context = super().get_context_data(**kwargs)
        slug = self.request.path.split('/')

        mixin_context = self.get_context(
            title='Forgot your password?',
            description='You can change your password on this page',
            h1='Reset your password', slug=slug[-2]
        )

        return dict(list(context.items()) + list(mixin_context.items()))


class PasswordResetConfirm(DataMixin, PasswordResetConfirmView):
    form_class = SetPassword
    template_name = 'main/password_reset_confirm.html'

    def get_context_data(self, *, object_list=None, **kwargs):
        context = super().get_context_data(**kwargs)
        mixin_context = self.get_context(
            title='Enter new password',
            description='Page with password reset confirm',
            h1='Enter new password'
        )

        return dict(list(context.items()) + list(mixin_context.items()))


class ResetComplete(DataMixin, TemplateView):
    template_name = 'main/password_reset_complete.html'

    def get_context_data(self, *, object_list=None, **kwargs):
        context = super().get_context_data(**kwargs)
        mixin_context = self.get_context(
            title='Your password has been reset',
            description='Your password has been reset. You can log in with your new password',
            h1='Your password has been reset'
        )

        return dict(list(context.items()) + list(mixin_context.items()))


def test(request, slug: str):
    return HttpResponse("<h1>"+ slug +"</h1>")


def logout_user(request):
    logout(request)

    return redirect('login')


def get404(request, exception):
    return HttpResponseNotFound('<h1>Страница не найдена</h1>')




