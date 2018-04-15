from django.shortcuts import render
from django import views


# Create your views here.
class Index(views.View):
    def get(self, request):
        return render(request, "index.html", {"active": "index"})


class Help(views.View):
    def get(self, request):
        return render(request, "help.html", {"active": "help"})


class News(views.View):
    def get(self, request):
        return render(request, "news.html", {"active": "news"})
