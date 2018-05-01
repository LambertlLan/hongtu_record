from django.shortcuts import render, redirect
from django.db.models import Sum

from django import views
from django.http import JsonResponse

import time
import json
import requests
from utils.createMsgCode import create_msg_code
import logging

from data_system.models import UserInfo, RealNameExamine, EnterpriseExamine, ActionSwitch
from data_system.setting import MSG_CODE_DEFINE
# 验证自定义admin
from django.utils.decorators import method_decorator
from django.contrib.admin.views.decorators import staff_member_required
# 分页
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

logger = logging.getLogger('django')


# Create your views here.
class Index(views.View):
    def get(self, request):
        return render(request, "index.html")


class Login(views.View):
    """登录"""

    def get(self, request):
        is_register = ActionSwitch.objects.get(id=1).switch
        return render(request, "login.html", {"registerSwitch": is_register})

    def post(self, request):
        get_phone = request.POST.get("phone")
        get_password = request.POST.get("password")
        count = UserInfo.objects.filter(phone=get_phone).count()

        if count:
            user_data = UserInfo.objects.filter(phone=get_phone)[0]
            if get_password == user_data.password:
                request.session["user_data"] = {"nickname": user_data.nickname, "phone": user_data.phone,
                                                "score": user_data.score,
                                                "uid": user_data.id,
                                                "role": user_data.role_id}
                return JsonResponse({"code": 0, "msg": "success"})
        return JsonResponse({"code": 1, "msg": "账号或密码错误"})


class Register(views.View):
    """注册"""

    def get(self, request):
        return render(request, "register.html")

    def post(self, request):
        is_register = ActionSwitch.objects.get(id=1).switch
        if not is_register:
            return JsonResponse({"code": 12000, "msg": "注册功能暂时关闭"})
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
                request.session["user_data"] = {"nick": register_dict["nick"], "phone": register_dict["phone"]
                    , "score": 0, "uid": uid, "role": 1}
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
            "content": "【宏图科技】验证码：%s，请在页面上输入您收到的验证码！" % msg_code,
            # "content": "【成都创信信息】验证码为：5873,欢迎注册平台！",
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


@method_decorator(staff_member_required, name="dispatch")
class ExaminationRealNameAdmin(views.View):
    """admin实名认证审核列表"""

    def get(self, request):
        exam_list = RealNameExamine.objects.all()
        paginator = Paginator(exam_list, 10, 3)
        page = request.GET.get("page")
        try:
            exam_list = paginator.page(page)
        except PageNotAnInteger:
            exam_list = paginator.page(1)
        except EmptyPage:
            exam_list = paginator.page(paginator.num_pages)
        return render(request, 'my_admin/exame_real_name.html', {'exam_list': exam_list})


@method_decorator(staff_member_required, name="dispatch")
class ExaminationRealNameInfoAdmin(views.View):
    """admin实名认证审核详情"""

    def get(self, request):
        info_id = request.GET.get("id")
        exam_info = RealNameExamine.objects.get(id=info_id)
        return render(request, 'my_admin/exame_real_name_info.html', {'exam_info': exam_info})


@method_decorator(staff_member_required, name="dispatch")
class ExaminationRealNameExamAdmin(views.View):
    """admin实名认证审核"""

    def post(self, request):
        is_adopt = request.POST.get("isAdopt")
        info_id = request.POST.get("id")
        exam_obj = RealNameExamine.objects.filter(id=info_id)
        exam_obj.update(is_exam=True, is_adopt=(is_adopt == '0'))

        if is_adopt == "0":
            uid = request.session.get("user_data")["uid"]

            UserInfo.objects.filter(id=uid).update(real_name=exam_obj[0].real_name, id_card=exam_obj[0].id_card,
                                                   pros_id_card_img=exam_obj[0].pros_id_card_img,
                                                   cons_id_card_img=exam_obj[0].cons_id_card_img, role=2)
            user_data = request.session.get("user_data")
            user_data["role"] = 2
            request.session["user_data"] = user_data
        return JsonResponse({"code": 0, "msg": "success"})


@method_decorator(staff_member_required, name="dispatch")
class ExaminationEnterpriseAdmin(views.View):
    """admin企业认证审核列表"""

    def get(self, request):
        exam_list = EnterpriseExamine.objects.all()
        paginator = Paginator(exam_list, 10, 3)
        page = request.GET.get("page")
        try:
            exam_list = paginator.page(page)
        except PageNotAnInteger:
            exam_list = paginator.page(1)
        except EmptyPage:
            exam_list = paginator.page(paginator.num_pages)
        return render(request, 'my_admin/exame_enterprise.html', {'exam_list': exam_list})


@method_decorator(staff_member_required, name="dispatch")
class ExaminationEnterpriseInfoAdmin(views.View):
    """admin企业认证审核详情"""

    def get(self, request):
        info_id = request.GET.get("id")
        exam_info = EnterpriseExamine.objects.get(id=info_id)
        return render(request, 'my_admin/exame_enterprise_info.html', {'exam_info': exam_info})


@method_decorator(staff_member_required, name="dispatch")
class ExaminationEnterpriseExamAdmin(views.View):
    """admin企业认证审核"""

    def post(self, request):
        is_adopt = request.POST.get("isAdopt")
        info_id = request.POST.get("id")
        exam_obj = EnterpriseExamine.objects.filter(id=info_id)
        exam_obj.update(is_exam=True, is_adopt=(is_adopt == '0'))

        if is_adopt == "0":
            uid = request.session.get("user_data")["uid"]

            UserInfo.objects.filter(id=uid).update(enterprise_name=exam_obj[0].enterprise_name,
                                                   corporation_name=exam_obj[0].corporation_name,
                                                   organization_code=exam_obj[0].organization_code,
                                                   business_license_img=exam_obj[0].business_license_img, role=3)
            user_data = request.session.get("user_data")
            user_data["role"] = 3
            request.session["user_data"] = user_data
        return JsonResponse({"code": 0, "msg": "success"})
