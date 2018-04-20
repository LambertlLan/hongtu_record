# __author: Lambert
# __date: 2018/4/14 13:26
from django.urls import path

from data_system import views
urlpatterns = [
    path('', views.Index.as_view()),
    path('index/', views.Index.as_view()),
    path('public_data/', views.PublicData.as_view()),
    path('debt_search/', views.DebtSearch.as_view()),
    path('customize_report/', views.CustomizeReport.as_view()),
    path('account_information/', views.AccountInformation.as_view()),
    path('financial_information/', views.FinancialInformation.as_view()),
    path('select_records/', views.SelectRecords.as_view()),

]