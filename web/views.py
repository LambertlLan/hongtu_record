from django.shortcuts import render, HttpResponse, redirect
from django import views
from django.http import JsonResponse

import time
import json
import requests
from utils.createMsgCode import create_msg_code
import logging

from data_system.models import UserInfo
from data_system.setting import MSG_CODE_DEFINE

logger = logging.getLogger('django')


# Create your views here.
class Index(views.View):
    def get(self, request):
        return render(request, "index.html")


class Login(views.View):
    """登录"""

    def get(self, request):
        return render(request, "login.html")

    def post(self, request):
        get_phone = request.POST.get("phone")
        get_password = request.POST.get("password")
        count = UserInfo.objects.filter(phone=get_phone).count()

        if count:
            user_data = UserInfo.objects.filter(phone=get_phone)[0]
            if get_password == user_data.password:
                request.session["user_data"] = {"name": user_data.name, "phone": user_data.phone,
                                                "score": user_data.score,
                                                "uid": user_data.id}
                return JsonResponse({"code": 0, "msg": "success"})
        return JsonResponse({"code": 1, "msg": "账号或密码错误"})


class Register(views.View):
    """注册"""

    def get(self, request):
        return render(request, "register.html")

    def post(self, request):
        register_dict = request.POST.dict()
        phone_user = UserInfo.objects.filter(phone=register_dict["phone"]).first()

        if phone_user:
            res = {"code": 1, "msg": "手机号已注册"}
            logger.info("该手机号已注册:% s" % register_dict["phone"])
        else:
            try:
                UserInfo.objects.create(**register_dict)
            except Exception as e:
                res = {"code": 1, "msg": "存入数据库出错"}
                logger.info(e)
            else:
                uid = UserInfo.objects.filter(phone=register_dict["phone"])[0].id
                request.session["user_data"] = {"name": register_dict["name"], "phone": register_dict["phone"]
                    , "score": 0, "uid": uid}
                logger.info("用户 %s 注册成功手机号为 %s" % (register_dict["name"], register_dict["phone"]))
                res = {"code": 0, "msg": "注册成功"}
        return JsonResponse(res)


class Logout(views.View):
    """注销"""

    def get(self, request):
        request.session.clear()
        return redirect("/login/")

    def post(self, request):
        request.session.clear()
        return JsonResponse({"code": 0, "msg": "注销成功"})


class GetMsgCode(views.View):
    """获取短信验证码"""

    def get(self, request):
        phone_num = request.GET.get("phone")
        msg_code = create_msg_code()
        logger.info("%s 请求获取手机验证码 %s" % (phone_num, msg_code))
        data_json = {
            "mobile": phone_num,
            # "content": "【宏图数据】验证码为：%s,请在页面中提交验证码完成验证" % msg_code,
            "content": "【成都创信信息】验证码为：5873,欢迎注册平台！",
            "appkey": MSG_CODE_DEFINE["app_key"]
        }
        res_msg = requests.post(MSG_CODE_DEFINE["url"], data_json, json=True)
        print(res_msg.text)
        data_text = json.loads(res_msg.text)
        if data_text["code"] == "10000":
            logger.info("手机号%s获取验证码%s成功" % (phone_num, msg_code))
            request.session["phoneVerifyCode"] = {"time": int(time.time()), "code": msg_code}
            res_json = {"code": 0, "msg": "success"}
            is_login = request.session.get("user_data")
            if is_login:
                res_json["msgCode"] = msg_code
            return JsonResponse(res_json)
        else:
            logger.info("手机号%s获取验证码%s失败,失败code:%s,msg:%s" % (phone_num, msg_code, data_text["code"], data_text["msg"]))
            return JsonResponse({"code": 1, "msg": data_text["msg"]})


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


class ResetPwd(views.View):
    """重置密码"""

    def post(self, request):
        msg_code = request.POST.get("msgCode")
        phone = request.POST.get("phoneNumber")
        user_session = request.session.get("phoneVerifyCode")
        if not user_session:
            return JsonResponse({"code": 1, "msg": "请先获取验证码"})
        if not UserInfo.objects.filter(phone=phone).count():
            return JsonResponse({"code": 1, "msg": "无此账号"})
        if msg_code == request.session.get("phoneVerifyCode")["code"]:
            del request.session["phoneVerifyCode"]
            UserInfo.objects.filter(phone=phone).update(**{"password": request.POST.get("newPwd")})
            return JsonResponse({"code": 0, "msg": "success"})
        else:
            return JsonResponse({"code": 1, "msg": "验证码不正确"})


class ModifyPwd(views.View):
    """修改密码"""

    def post(self, request):
        phone = request.POST.get("phone")
        old_pwd = request.POST.get("oldPwd")
        new_pwd = request.POST.get("newPwd")
        print("%s %s" % (phone, old_pwd))
        obj = UserInfo.objects.filter(phone=phone, password=old_pwd)
        if obj.count():
            obj.update(**{"password": new_pwd})
            return JsonResponse({"code": 0, "msg": "success"})
        else:
            return JsonResponse({"code": 1, "msg": "原密码不正确"})
