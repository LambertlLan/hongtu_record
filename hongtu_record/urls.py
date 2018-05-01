"""hongtu_record URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
# 处理favicon.ico
from django.views.generic.base import RedirectView

from django.conf import settings
from django.conf.urls.static import static
# 门户网站路由
import web.views
# 查询系统路由
import data_system.urls

urlpatterns = [
                  # 实名认证
                  path('admin/examination/real_name/', web.views.ExaminationRealNameAdmin.as_view()),
                  path('admin/examination/real_name/info/', web.views.ExaminationRealNameInfoAdmin.as_view()),
                  path('admin/examination/real_name/exam/', web.views.ExaminationRealNameExamAdmin.as_view()),
                  # 企业认证
                  path('admin/examination/enterprise/', web.views.ExaminationEnterpriseAdmin.as_view()),
                  path('admin/examination/enterprise/info/', web.views.ExaminationEnterpriseInfoAdmin.as_view()),
                  path('admin/examination/enterprise/exam/', web.views.ExaminationEnterpriseExamAdmin.as_view()),
                  path('admin/', admin.site.urls),
                  # favicon.ico
                  path('favicon.ico/', RedirectView.as_view(url=r'static/favicon.ico')),
                  # 查询系统
                  path('record/', include(data_system.urls)),
                  # 门户页面
                  path('', web.views.Index.as_view()),
                  path('index/', web.views.Index.as_view()),
                  path('login/', web.views.Login.as_view()),
                  path('logout/', web.views.Logout.as_view()),
                  path('register/', web.views.Register.as_view()),
                  path('getMsgCode/', web.views.GetMsgCode.as_view()),
                  path('checkMsgCode/', web.views.CheckMsgCode.as_view()),
                  path('reset_pwd/', web.views.ResetPwd.as_view()),
                  path('modify_pwd/', web.views.ModifyPwd.as_view()),
              ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)  # 配置静态文件路径
