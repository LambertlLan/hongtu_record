from django.shortcuts import render
from django import views


# Create your views here.
# 账户首页
class Index(views.View):
    def get(self, request):
        return render(request, "record/index.html", {"active": "index"})

    def post(self, request):
        return render(request, "record/index.html", {"active": "index"})


# 公众数据获取
class PublicData(views.View):
    def get(self, request):
        return render(request, "record/public_data.html", {"active": "public_data"})


# 负债搜索报告
class DebtSearch(views.View):
    def get(self, request):
        return render(request, "record/debt_search.html", {"active": "debt_search"})


# 定制版报告
class CustomizeReport(views.View):
    def get(self, request):
        return render(request, "record/customize_report.html", {"active": "customize_report"})


# 账户信息
class AccountInformation(views.View):
    def get(self, request):
        return render(request, "record/account_information.html", {"active": "account_information"})


# 财务信息
class FinancialInformation(views.View):
    def get(self, request):
        return render(request, "record/financial_information.html", {"active": "financial_information"})


# 查询记录
class SelectRecords(views.View):
    def get(self, request):
        return render(request, "record/select_records.html", {"active": "select_records"})
