from django.urls import path, re_path
from main.views import *
from django.contrib.auth.views import PasswordResetConfirmView

urlpatterns = [
    path('', Index.as_view(), name='home'),
    path('records/', Records.as_view(), name='records'),
    path('login/', LoginUser.as_view(), name='login'),
    path('login_ajax/', LoginAjax.as_view(), name='loginAjax'),
    path('result_send/', ResultSend.as_view(), name='result_send'),
    path('reset/<uidb64>/<token>/', PasswordResetConfirm.as_view(), name='password_reset_confirm'),
    path('reset_password/', ResetPassword.as_view(), name='resetPassword'),
    path('reset_password/email_sent/', ResetPassword.as_view(), name='resetPasswordEmailSent'),
    path('change_password', ChangePassword.as_view(), name='change_password'),
    # path('test/<slug:slug>', test, name='test'),
    path('test/', test, name='test'),
    path('password_reset_complete/', ResetComplete.as_view(), name='password_reset_complete'),
    path('password_change_complete/', ChangePasswordComplete.as_view(), name='password_change_complete'),
    path('logout/', logout_user, name='logout'),
    path('register/', RegisterUser.as_view(), name='register'),
    path('your_profile/', YourProfile.as_view(), name='your_profile'),
    path('delete_user_confirm/', DeleteUser.as_view(), name='delete_user'),
    path('personal_records/', PersonalRecords.as_view(), name='personal_records'),
]