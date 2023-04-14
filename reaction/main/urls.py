from django.urls import path
from main.views import *

urlpatterns = [
    path('', Index.as_view(), name='home'),
    path('records/', records, name='records'),
]