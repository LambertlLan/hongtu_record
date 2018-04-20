from django.shortcuts import render, HttpResponse
from django import views
from django.http import JsonResponse

import time
import json
from utils.createMsgCode import create_msg_code
import logging

from data_system.models import UserInfo

logger = logging.getLogger('django')


# Create your views here.
class Index(views.View):
    def get(self, request):
        return render(request, "index.html")


class Login(views.View):
    """登录"""

    def get(self, request):
        return render(request, "login.html")


class Register(views.View):
    """注册"""

    def get(self, request):
        return render(request, "register.html")

    def post(self, request):
        register_dict = request.POST.dict()
        phone_user = UserInfo.objects.filter(phone=register_dict["phone"])

        if phone_user:
            res = {"code": 1, "msg": "手机号已注册"}
            logger.info("该手机号已注册:% s" % register_dict["phone"])
            return JsonResponse(res)
        else:
            try:
                UserInfo.objects.create(**register_dict)
            except Exception as e:
                res = {"code": 1, "msg": "存入数据库出错"}
                logger.info(e)
            else:
                request.session["user_data"] = {"name": register_dict["name"], "phone": register_dict["phone"]}
                logger.info("用户 %s 注册成功手机号为 %s" % (register_dict["name"], register_dict["phone"]))
                res = {"code": 0, "msg": "注册成功"}
        return JsonResponse(res)


class GetMsgCode(views.View):
    """获取短信验证码"""

    def get(self, request):
        phone_num = request.GET.get("phone")
        msg_code = create_msg_code()
        logger.info("%s 请求获取手机验证码 %s" % (phone_num, msg_code))
        request.session["phoneVerifyCode"] = {"time": int(time.time()), "code": msg_code}
        return JsonResponse({"code": 0, "msg": "success", "msgCode": msg_code})


class CheckMsgCode(views.View):
    """验证验证码"""

    def post(self, request):
        msg_code = request.POST.get("msgCode")
        res = {"code": 1, "msg": "验证码不正确"}
        if msg_code == request.session.get("phoneVerifyCode")["code"]:
            res["code"] = 0
            res["msg"] = "success"
            del request.session["phoneVerifyCode"]
        return JsonResponse(res)
