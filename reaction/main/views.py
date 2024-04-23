from django.contrib import messages
from django.contrib.auth import logout, login, authenticate
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.views import LoginView, PasswordResetView, PasswordResetConfirmView, PasswordChangeView
from django.contrib.auth.models import User
from django.contrib.messages.views import SuccessMessageMixin
from django.db.models import Min
from django.forms import inlineformset_factory
from django.shortcuts import render, redirect, get_object_or_404
from django.urls import reverse_lazy
from django.views import View
from django.views.generic import ListView, CreateView, TemplateView, UpdateView, DeleteView
from django.http import HttpResponse, HttpResponseNotFound, JsonResponse
import json

from .forms import *
from .models import Result
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

    def __get_user(self, chart):
        chart = sorted(chart, key=lambda item: item['time'])
        users = []

        for item in chart:
            user_result = Result.objects.get(user_id=item['user'], time=item['time'])
            users.append(user_result)

        return users

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        mixin_context = self.get_context(title="reactionCoach - Records", h1='Records', page_active='records')

        return dict(list(context.items()) + list(mixin_context.items()))

    def get_queryset(self):
        chart = Result.objects.values('user').filter(enable_keyboard=1).filter(user__userprofile__show_in_records=True).annotate(time=Min('time'))[:10]
        chart_results = dict()
        chart_results['enable_keyboard'] = self.__get_user(chart)

        chart = Result.objects.values('user').filter(enable_keyboard=0).filter(user__userprofile__show_in_records=True).annotate(time=Min('time'))[:10]
        chart_results['disable_keyboard'] = self.__get_user(chart)

        return chart_results


class PersonalRecords(LoginRequiredMixin, DataMixin, ListView):
    model = Result
    template_name = 'main/personal_records.html'
    context_object_name = 'result'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        mixin_context = self.get_context(title="reactionCoach - Your records", h1='Your records')

        return dict(list(context.items()) + list(mixin_context.items()))

    def get_queryset(self):
        return Result.objects.filter(user=self.request.user.pk).order_by('time')


class RegisterUser(DataMixin, CreateView):
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


class ResultSend(View):

    def post(self, request):
        post = json.loads(request.body)
        time = post.get('time')
        enable_keyboard = post.get('enable_keyboard')

        if request.user.is_authenticated:
            try:
                Result.objects.create(time=time, enable_keyboard=enable_keyboard, user=request.user)

                message = 'Record added successfully for user - ' + request.user.username
                return JsonResponse(data={'message': message}, status=200)
            except Exception as e:
                error_text = str(e)
                message = 'Error: Added failed for user - ' + request.user.username + '. ' + error_text
                return JsonResponse(data={'message': message}, status=200)
        else:
            default_user = get_user_model().objects.get_or_create(username='guest')[0]

            try:
                Result.objects.create(time=time, enable_keyboard=enable_keyboard, user=default_user)

                message = 'Record added successfully for user - ' + default_user.username
                return JsonResponse(data={'message': message}, status=200)
            except Exception as e:
                error_text = str(e)
                message = 'Error: Added failed for user - ' + default_user.username + '. ' + error_text
                return JsonResponse(data={'message': message}, status=200)


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


class ChangePassword(DataMixin, PasswordChangeView):
    form_class = ChangePassword
    success_url = reverse_lazy('password_change_complete')
    template_name = 'main/change_password.html'

    def get_context_data(self, *, object_list=None, **kwargs):
        context = super().get_context_data(**kwargs)
        mixin_context = self.get_context(
            title='Change your password',
            description='If you want, you can change your password here.',
            h1='Change your password'
        )

        return dict(list(context.items()) + list(mixin_context.items()))


class ChangePasswordComplete(DataMixin, TemplateView):
    template_name = 'main/password_change_complete.html'

    def get_context_data(self, *, object_list=None, **kwargs):
        context = super().get_context_data(**kwargs)
        mixin_context = self.get_context(
            title='Your password has been change',
            description='Your password has been change',
            h1='Change password'
        )

        return dict(list(context.items()) + list(mixin_context.items()))


class UserProfileView(LoginRequiredMixin, DataMixin, UpdateView):
    model = UserProfile
    form_class = UserProfileForm
    template_name = 'main/user_profile.html'
    success_url = reverse_lazy('user_profile')

    def get_context_data(self, *, object_list=None, **kwargs):
        context = super().get_context_data(**kwargs)
        if 'user_email_form' not in context.keys() and 'user_profile_form' not in context.keys():
            self.object = self.get_object()
            context['user_email_form'] = UserEmailForm(instance=self.object.user)
            context['user_profile_form'] = UserProfileForm(instance=self.object)

        mixin_context = self.get_context(
            title='Your profile',
            description='You can change your data here',
            h1='Edit your profile',
        )

        return dict(list(context.items()) + list(mixin_context.items()))

    def get_object(self, queryset=None):
        return get_object_or_404(UserProfile, user=self.request.user.pk)


    def post(self, request, *args, **kwargs):
        self.object = self.get_object()
        user_email_form = UserEmailForm(request.POST, instance=self.object.user)
        user_profile_form = UserProfileForm(request.POST, instance=self.object)

        if user_email_form.is_valid() and user_profile_form.is_valid():
            user_email_form.save()
            return self.form_valid(user_profile_form)
        else:
            return self.render_to_response(self.get_context_data(user_email_form=user_email_form, user_profile_form=user_profile_form))


class DeleteUser(LoginRequiredMixin, SuccessMessageMixin, DataMixin, DeleteView):
    model = User
    template_name = 'main/delete_user_confirm.html'
    success_message = 'User has been deleted'
    success_url = reverse_lazy('login')

    def get_context_data(self, *, object_list=None, **kwargs):
        context = super().get_context_data(**kwargs)
        mixin_context = self.get_context(
            title='Delete your account',
            description='You can delete your account here',
            h1='Do you really want to delete your account?'
        )

        return dict(list(context.items()) + list(mixin_context.items()))

    def get_object(self, queryset=None):
        user_id = self.request.user.pk
        user_obj = User.objects.get(id=user_id)

        return user_obj


# def test(request, slug: str):
# return HttpResponse("<h1>"+ slug +"</h1>")
def test(request):
    messages.success(request, 'Hellow world')
    messages.error(request, "Document deleted.")

    data = {
        'title': 'Test',
        'description': 'This is a test page',
        'h1': 'Test page'
    }
    return render(request, 'main/test.html', data)


def logout_user(request):
    logout(request)

    return redirect('login')


def get404(request, exception):
    return HttpResponseNotFound('<h1>Страница не найдена</h1>')




