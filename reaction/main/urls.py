from django.urls import path
from main.views import *

urlpatterns = [
    path('', Index.as_view(), name='home'),
    path('records/', Records.as_view(), name='records'),
    path('login/', LoginUser.as_view(), name='login'),
    path('login_ajax/', LoginAjax.as_view(), name='loginAjax'),
    path('logout/', logout_user, name='logout'),
    path('register/', RegisterUser.as_view(), name='register'),
]