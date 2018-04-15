from django.shortcuts import render
from django import views


# Create your views here.
class Index(views.View):
    def get(self, request):
        return render(request, "record/index.html", {"active": "index"})


class PublicData(views.View):
    def get(self, request):
        return render(request, "record/public_data.html", {"active": "public_data"})
