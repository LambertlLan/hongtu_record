from django.shortcuts import render
from django import views


# Create your views here.
class Index(views.View):
    def get(self, request):
        return render(request, "index.html")


class Login(views.View):
    def get(self, request):
        return render(request, "login.html")


