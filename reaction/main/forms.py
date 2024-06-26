from django import forms
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm, PasswordResetForm, SetPasswordForm, \
    PasswordChangeForm
from django.contrib.auth.models import User

from main.models import UserProfile


class RegisterUserForm(UserCreationForm):
    username = forms.CharField(label='Login',
                               widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': ''}))
    email = forms.EmailField(label='Email',
                             widget=forms.EmailInput(attrs={'class': 'form-control', 'placeholder': ''}))
    password1 = forms.CharField(label='Password',
                                widget=forms.PasswordInput(attrs={'class': 'form-control', 'placeholder': ''}))
    password2 = forms.CharField(label='Repeat password',
                                widget=forms.PasswordInput(attrs={'class': 'form-control', 'placeholder': ''}))

    class Meta:
        model = User
        fields = ('username', 'email', 'password1', 'password2')


class LoginUserForm(AuthenticationForm):
    username = forms.CharField(label='Login',
                               widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': ''}))
    password = forms.CharField(label='Password',
                               widget=forms.PasswordInput(attrs={'class': 'form-control', 'placeholder': ''}))


class PasswordReset(PasswordResetForm):
    email = forms.EmailField(label='Enter your email',
                             widget=forms.EmailInput(attrs={'class': 'form-control', 'placeholder': ''}))


class SetPassword(SetPasswordForm):
    new_password1 = forms.CharField(label='New password',
                                    widget=forms.PasswordInput(attrs={'class': 'form-control', 'placeholder': ''}))
    new_password2 = forms.CharField(label='Confirm password',
                                    widget=forms.PasswordInput(attrs={'class': 'form-control', 'placeholder': ''}))


class ChangePassword(PasswordChangeForm):
    old_password = forms.CharField(label='Old password',
                                    widget=forms.PasswordInput(attrs={'class': 'form-control', 'placeholder': ''}))
    new_password1 = forms.CharField(label='New password',
                                    widget=forms.PasswordInput(attrs={'class': 'form-control', 'placeholder': ''}))
    new_password2 = forms.CharField(label='Confirm password',
                                    widget=forms.PasswordInput(attrs={'class': 'form-control', 'placeholder': ''}))


class UserProfileForm(forms.ModelForm):
    show_in_records = forms.BooleanField(label='Show your records in the main table of records',
                                         widget=forms.CheckboxInput(
                                             attrs={'class': 'form-check-input', 'placeholder': ''}),
                                         required=False)

    class Meta:
        model = UserProfile
        fields = ('show_in_records',)


class UserEmailForm(forms.ModelForm):
    email = forms.EmailField(label='Email',
                             widget=forms.EmailInput(attrs={'class': 'form-control', 'placeholder': ''}))

    class Meta:
        model = User
        fields = ('email',)