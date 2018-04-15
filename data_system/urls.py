# __author: Lambert
# __date: 2018/4/14 13:26
from django.urls import path

from data_system import views
urlpatterns = [
    path('', views.Index.as_view()),
    path('index.html', views.Index.as_view()),
    path('public_data.html', views.PublicData.as_view()),

]