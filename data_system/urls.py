# __author: Lambert
# __date: 2018/4/14 13:26
from django.urls import path

from data_system import views

urlpatterns = [
    path('', views.Index.as_view()),
    path('index/', views.Index.as_view()),
    path('auth_real_name/', views.AuthRealName.as_view()),
    path('public_data/auth_real_name/', views.AuthRealNameView.as_view()),
    path('public_data/telecom_realname/', views.PublicData.as_view()),
    path('public_data/antifraud_miguan/', views.AntifraudMiGuan.as_view()),
    path('public_data/finance_investment/', views.FinanceInvestment.as_view()),
    path('public_data/check_data/', views.CheckPublicData.as_view()),
    path('public_data/history/', views.SearchHistory.as_view()),
    path('public_data/history_info/', views.SearchHistoryInfo.as_view()),
    path('debt_search/', views.DebtSearch.as_view()),
    path('customize_report/', views.CustomizeReport.as_view()),
    path('account/information/', views.AccountInformation.as_view()),
    path('account/pwd_modify/', views.AccountPWDModify.as_view()),
    path('account/update/', views.AccountUpdate.as_view()),
    path('account/update/real_name/', views.RealNameExamination.as_view()),
    path('account/update/enterprise/', views.EnterpriseExamination.as_view()),
    path('financial_information/recharge/', views.FinancialInformation.as_view()),
    path('recharge/', views.Recharge.as_view()),
    path('financial_information/recharge_record/', views.RechargeRecordView.as_view()),
    path('recharge/records/', views.RechargeRecord.as_view()),
    path('select_records/', views.SelectRecords.as_view()),

]
