from django.shortcuts import render, redirect
from django.http import JsonResponse
from django import views
from django.utils.decorators import method_decorator


# 检查 session 装饰器
def check_session(func):
    def inner(request, *args, **kwargs):
        is_login = request.session.get("user_data")
        if is_login:
            return func(request, *args, **kwargs)
        else:
            if request.method == "GET":
                return redirect('/login/')
            else:
                return JsonResponse({"code": 11000, "msg": "session已过期"})

    return inner


# 账户首页
@method_decorator(check_session, name="dispatch")
class Index(views.View):
    def get(self, request):
        return render(request, "record/index.html", {"active": "index"})

    def post(self, request):
        return render(request, "record/index.html", {"active": "index"})


# 公众数据获取
@method_decorator(check_session, name="dispatch")
class PublicData(views.View):
    def get(self, request):
        return render(request, "record/public_data.html", {"active": "public_data"})


# 负债搜索报告
@method_decorator(check_session, name="dispatch")
class DebtSearch(views.View):
    def get(self, request):
        return render(request, "record/debt_search.html", {"active": "debt_search"})


# 定制版报告
@method_decorator(check_session, name="dispatch")
class CustomizeReport(views.View):
    def get(self, request):
        return render(request, "record/customize_report.html", {"active": "customize_report"})


# 账户信息
@method_decorator(check_session, name="dispatch")
class AccountInformation(views.View):
    def get(self, request):
        return render(request, "record/account_information.html", {"active": "account_information"})


# 财务信息
@method_decorator(check_session, name="dispatch")
class FinancialInformation(views.View):
    def get(self, request):
        return render(request, "record/financial_information.html", {"active": "financial_information"})


# 查询记录
@method_decorator(check_session, name="dispatch")
class SelectRecords(views.View):
    def get(self, request):
        return render(request, "record/select_records.html", {"active": "select_records"})
