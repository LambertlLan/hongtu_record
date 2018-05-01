import base64
import json
import logging
import math
import time
import os
import random

import requests
from django import views
from django.http import JsonResponse
from django.shortcuts import redirect, render
from django.utils.decorators import method_decorator
from django.core.files.base import ContentFile

from .create_md5 import doMd5
from .models import RechargeRecords, UserInfo, RecentSearchRecord, RealNameExamine, EnterpriseExamine, ActionSwitch, \
    Order
from .rc4crypt import rc4crypt
from .paysapi import PaysApi
from .setting import MODELS_DEFINE, SCORE_DEFINE, URL_DEFINE, CHINESE_DEFINE, PAGE_NUM, ACTION_ID_DEFINE, BASE_URL

logger = logging.getLogger('django')


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


# 检查 角色 装饰器
def check_role(func):
    def inner(request, *args, **kwargs):
        uid = request.session.get("user_data")["uid"]
        role_id = UserInfo.objects.filter(id=uid)[0].role_id
        if role_id == 1:
            return redirect('/record/public_data/auth_real_name/')
        else:
            return func(request, *args, **kwargs)

    return inner


# 检查 score 装饰器
def check_score(func):
    def inner(request, *args, **kwargs):
        uid = request.session.get("user_data")["uid"]
        score = request.session.get("user_data")["score"]
        service = request.POST.get("service")
        service_fee = UserInfo.objects.filter(id=uid).values(SCORE_DEFINE[service])[0]
        if score > service_fee[SCORE_DEFINE[service]]:
            return func(request, *args, **kwargs)
        else:
            return JsonResponse({"code": 11001, "msg": "积分不足"})

    return inner


# 扣除积分
def take_off_score(request, take_score):
    uid = request.session.get("user_data")["uid"]
    score = UserInfo.objects.filter(id=uid)[0].score
    if score > take_score:
        new_score = score - take_score
        UserInfo.objects.filter(id=uid).update(score=new_score)
        user_data = request.session.get("user_data")
        user_data["score"] = new_score
        request.session["user_data"] = user_data
        return new_score
    else:
        return -1


# 获取用户查询服务需要支付的积分
def get_service_fee(uid, service):
    service_fee = UserInfo.objects.filter(id=uid).values(SCORE_DEFINE[service])[0][SCORE_DEFINE[service]]
    return service_fee


# 账户首页
@method_decorator(check_session, name="dispatch")
class Index(views.View):
    def get(self, request):
        uid = request.session.get("user_data")["uid"]
        records_list = RecentSearchRecord.objects.filter(user_id=uid)[:10]
        return render(request, "record/index.html", {"active": "index", "records_list": records_list})


# 实名认证页面
@method_decorator(check_session, name="dispatch")
class AuthRealNameView(views.View):
    def get(self, request):
        return render(request, "record/pulic_data/auth_real_name.html", {"active": "public_data"})


# 实名认证页面
@method_decorator(check_session, name="dispatch")
class AuthRealName(views.View):
    def post(self, request):
        uid = request.session.get("user_data")["uid"]
        # 读取上传的文件中的video项为二进制文件
        file_content = ContentFile(request.FILES['img'].read())
        # ImageField的save方法，第一个参数是保存的文件名，第二个参数是ContentFile对象，里面的内容是要上传的图片、视频的二进制内容
        UserInfo.objects.get(id=uid).id_card_img.save(request.FILES['img'].name, file_content)
        return JsonResponse({"msg": "上传成功"})


# 公众数据获取
@method_decorator(check_session, name="dispatch")
@method_decorator(check_role, name="dispatch")
class PublicData(views.View):
    """运营商三要素页面"""

    def get(self, request):
        uid = request.session.get("user_data")["uid"]
        service_fee = get_service_fee(uid, "Telecom_realname")
        switch = ActionSwitch.objects.get(id=2).switch
        return render(request, "record/pulic_data/telecom_realname.html",
                      {"active": "public_data", "public_active": "telecom_realname", "service_fee": service_fee,
                       "switch": switch})


@method_decorator(check_session, name="dispatch")
class AntifraudMiGuan(views.View):
    """蜜罐数据查询页面"""

    def get(self, request):
        uid = request.session.get("user_data")["uid"]
        service_fee = get_service_fee(uid, "Antifraud_miguan")
        switch = ActionSwitch.objects.get(id=3).switch
        return render(request, "record/pulic_data/miguan.html",
                      {"active": "public_data", "public_active": "miguan", "service_fee": service_fee,
                       "switch": switch})


@method_decorator(check_session, name="dispatch")
class FinanceInvestment(views.View):
    """ 对外投资查询页面"""

    def get(self, request):
        uid = request.session.get("user_data")["uid"]
        service_fee = get_service_fee(uid, "Finance_investment")
        switch = ActionSwitch.objects.get(id=3).switch
        return render(request, "record/pulic_data/finance_investment.html",
                      {"active": "public_data", "public_active": "finance_investment", "service_fee": service_fee,
                       "switch": switch})


@method_decorator(check_session, name="dispatch")
@method_decorator(check_score, name="dispatch")
class CheckPublicData(views.View):
    """调用法眼三个接口"""

    def post(self, request):
        service = request.POST.get("service")
        switch = ActionSwitch.objects.get(id=ACTION_ID_DEFINE[service]).switch
        if not switch:
            del request.session["phoneVerifyCode"]
            return JsonResponse({"code": 12000, "msg": "该功能暂时关闭"})
        msg_code = request.POST.get("msgCode")
        if msg_code != request.session.get("phoneVerifyCode")["code"]:
            return JsonResponse({"code": 1, "msg": "验证码不正确"})
        else:
            del request.session["phoneVerifyCode"]

        data_json = {
            "app_id": URL_DEFINE["app_id"],
            "timestamp": int(time.time()),
        }
        sign = str(data_json["timestamp"]) + URL_DEFINE["app_secret"]
        data_json["sign"] = doMd5(sign)
        params = {
            "sn": "HT" + str(data_json["timestamp"]),
            "id_number": request.POST.get("idCard"),
            "name": request.POST.get("realName"),
            "service": request.POST.get("service")
        }
        try:
            phone = request.POST.get("mobile")
        except Exception as e:
            phone = None

        if phone:
            params["phone"] = phone
        try:
            rc4_data = rc4crypt(json.dumps(params), URL_DEFINE["app_secret"])
        except Exception as e:
            logger.info(e)
            return JsonResponse({"code": 1, "msg": "加密发生错误"})
        # 开始请求,先扣钱
        uid = request.session.get("user_data")["uid"]

        service_fee = get_service_fee(uid, service)
        new_score = take_off_score(request, service_fee)
        if new_score < 0:
            logger.info("扣费发生错误")
            return JsonResponse({"code": 1, "msg": "扣费发生错误"})

        base64_rc4 = base64.b64encode(rc4_data.encode("latin1"))
        data_json["params"] = str(base64_rc4, "latin1")
        res_msg = requests.post(URL_DEFINE["url"], data_json, json=True)
        data_text = json.loads(res_msg.text)
        if data_text["code"] == 200:
            wait_jie = data_text["data"]["report"]
            jie = base64.b64decode(wait_jie)
            try:
                decrypt = rc4crypt(jie.decode("latin1"), URL_DEFINE["app_secret"])
            except Exception as e:
                logger.info(e)
                return JsonResponse({"code": 1, "msg": "解密过程发生问题"})
            else:
                logger.info(data_text)
                database_dict = {
                    "real_name": params["name"],
                    "id_card": params["id_number"],
                    "user_id": uid,
                    "data": decrypt,
                    "msg": data_text["message"],
                    "order_num": params["sn"]
                }
                if "phone" in params.keys():
                    database_dict["mobile"] = params["phone"]
                # 存入对应的数据库表
                if request.POST.get("service") in MODELS_DEFINE.keys():
                    obj = MODELS_DEFINE[params["service"]]
                    obj.objects.create(**database_dict)
                # 存入近期查询表
                RecentSearchRecord.objects.create(user_id=database_dict["user_id"], name=database_dict["real_name"],
                                                  service=params["service"],
                                                  service_chinese=CHINESE_DEFINE[params["service"]])
                return JsonResponse(
                    {"code": 0, "msg": "success", "new_score": new_score, "data": json.loads(decrypt),
                     "info": request.POST.dict()})
        else:
            logger.info(data_text)
            return JsonResponse({"code": 1, "msg": "外部服务器出错"})


@method_decorator(check_session, name="dispatch")
class SearchHistory(views.View):
    """获取查询记录"""

    def post(self, request):
        uid = request.session.get("user_data")["uid"]
        service = request.POST.get("service")
        obj = MODELS_DEFINE[service]
        total_num = obj.objects.filter(user_id=uid).count()
        start = (int(request.POST.get("page")) - 1) * PAGE_NUM  # 每页十条
        end = int(request.POST.get("page")) * PAGE_NUM
        if service == "Finance_investment":

            result_list = list(
                obj.objects.filter(user_id=uid).values("id", "date", "id_card", "real_name")[start:end])
        else:
            result_list = list(
                obj.objects.filter(user_id=uid).values("id", "date", "mobile", "id_card", "real_name")[start:end])

        return JsonResponse(
            {"code": 0, "service": service, "service_chinese": CHINESE_DEFINE[service], "resultList": result_list,
             "totalPages": math.ceil(total_num / PAGE_NUM)})


@method_decorator(check_session, name="dispatch")
class SearchHistoryInfo(views.View):
    """获取查询记录详情"""

    def post(self, request):
        tid = request.POST.get("id")
        service = request.POST.get("service")
        obj = MODELS_DEFINE[service]
        if service == "Finance_investment":

            result = list(obj.objects.filter(id=tid).values("date", "id_card", "real_name", "data", "msg"))[0]
        else:
            result = list(obj.objects.filter(id=tid).values("date", "mobile", "id_card", "real_name", "data", "msg"))[0]

        result["data"] = json.loads(result["data"])
        return JsonResponse({"code": 0, "result": result, "msg": "查询成功"})


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


# 修改密码
@method_decorator(check_session, name="dispatch")
class AccountPWDModify(views.View):
    def get(self, request):
        return render(request, "record/account_pwd_modify.html", {"active": "account_information"})


# 账户升级页面
@method_decorator(check_session, name="dispatch")
class AccountUpdate(views.View):
    def get(self, request):
        uid = request.session.get("user_data")["uid"]
        # 查身份认证和企业认证有没有正在审核中的数据
        real_name_exists = RealNameExamine.objects.filter(user_id=uid, is_exam=False).exists()
        enterprise_exists = EnterpriseExamine.objects.filter(user_id=uid, is_exam=False).exists()
        if real_name_exists or enterprise_exists:
            return render(request, "record/account_update.html", {"active": "account_information", "examining": True})
        else:
            return render(request, "record/account_update.html", {"active": "account_information"})


# 实名认证
@method_decorator(check_session, name="dispatch")
class RealNameExamination(views.View):
    def post(self, request):
        uid = request.session.get("user_data")["uid"]
        # 读取上传的文件中的video项为二进制文件
        real_name = request.POST.get("real_name")
        id_card = request.POST.get("id_card")
        pros_file_content = ContentFile(request.FILES['pros_id_card_img'].read())

        pro_file_source_ext = os.path.splitext(request.FILES['pros_id_card_img'].name)[1]
        pro_file_source_fn = '%d_%d' % (int(time.time()), random.randint(0, 100))
        pro_file_name = "pro_%s%s" % (pro_file_source_fn, pro_file_source_ext)

        cons_file_content = ContentFile(request.FILES['cons_id_card_img'].read())
        cons_file_source_ext = os.path.splitext(request.FILES['cons_id_card_img'].name)[1]
        cons_file_source_fn = '%d_%d' % (int(time.time()), random.randint(0, 100))
        cons_file_name = "cons_%s%s" % (cons_file_source_fn, cons_file_source_ext)

        info_id = RealNameExamine.objects.create(user_id=uid, real_name=real_name, id_card=id_card).id
        try:

            RealNameExamine.objects.get(id=info_id).pros_id_card_img.save(pro_file_name,
                                                                          pros_file_content)
            RealNameExamine.objects.get(id=info_id).cons_id_card_img.save(cons_file_name,
                                                                          cons_file_content)
        except Exception as e:
            logger.info(e)
            return JsonResponse({"code": 1, "msg": "发生未知错误"})
        else:
            return JsonResponse({"code": 0, "msg": "success"})


@method_decorator(check_session, name="dispatch")
class EnterpriseExamination(views.View):
    def post(self, request):
        uid = request.session.get("user_data")["uid"]
        # 读取上传的文件中的video项为二进制文件
        enterprise_name = request.POST.get("enterprise_name")
        corporation_name = request.POST.get("corporation_name")
        organization_code = request.POST.get("organization_code")
        business_license_content = ContentFile(request.FILES['business_license_img'].read())

        business_license_ext = os.path.splitext(request.FILES['business_license_img'].name)[1]
        business_license_fn = '%d_%d' % (int(time.time()), random.randint(0, 100))
        business_license_name = "ent_%s%s" % (business_license_fn, business_license_ext)

        info_id = EnterpriseExamine.objects.create(user_id=uid, enterprise_name=enterprise_name,
                                                   corporation_name=corporation_name,
                                                   organization_code=organization_code).id
        try:

            EnterpriseExamine.objects.get(id=info_id).business_license_img.save(business_license_name,
                                                                                business_license_content)
        except Exception as e:
            logger.info(e)
            return JsonResponse({"code": 1, "msg": "发生未知错误"})
        else:
            return JsonResponse({"code": 0, "msg": "success"})


# 财务信息
@method_decorator(check_session, name="dispatch")
class FinancialInformation(views.View):
    def get(self, request):
        return render(request, "record/financial_information.html",
                      {"active": "financial_information"})


class PaySuccess(views.View):
    """充值成功供外部回调"""

    def post(self, request):
        token = "d865756907088ed994d84136a6a75f7b"

        uid = request.POST.get("orderuid")
        order_id = request.POST.get("orderid")
        price = int(request.POST.get("price"))
        real_price = int(request.POST.get("realprice"))
        server_key = request.POST.get("key")
        paysapi_id = request.POST.get("paysapi_id")
        string_key = order_id + uid + paysapi_id + price + real_price + token
        key = doMd5(string_key)
        if server_key == key:
            # 更新订单状态
            Order.objects.filter(order_id=order_id).update(is_success=True)
            # 更新用户积分
            score = UserInfo.objects.filter(id=uid)[0].score
            new_score = score + int(price) * 2
            UserInfo.objects.filter(id=uid).update(score=new_score)
            # 增加一条充值记录
            RechargeRecords.objects.create(user_id=uid, amount=price)
            # 更新session
            user_data = request.session.get("user_data")
            user_data["score"] = new_score
            request.session["user_data"] = user_data

        return JsonResponse({"code": 200, "msg": "购买成功"})


@method_decorator(check_session, name="dispatch")
class PayComplate(views.View):
    """充值"""

    def post(self, request):
        uid = request.session.get("user_data")["uid"]
        score = UserInfo.objects.get(id=uid).score
        return render(request, "record/financial_pay_success.html", {"score": score})


@method_decorator(check_session, name="dispatch")
class GetPayPage(views.View):
    """跳转到支付页面"""

    def post(self, request):
        uid = request.session.get("user_data")["uid"]
        amount = request.POST.get("amount")
        pay_type = request.POST.get("payType")
        pays_api = PaysApi(amount, uid, pay_type)
        pays_api.save_data()
        return render(request, "record/financial_paysubmit.html", {"order_json": pays_api.get_order_json()})


@method_decorator(check_session, name="dispatch")
class RechargeRecordView(views.View):
    """充值记录页面"""

    def get(self, request):
        return render(request, "record/recharge_records.html", {"active": "financial_information"})


@method_decorator(check_session, name="dispatch")
class RechargeRecord(views.View):
    """充值记录"""

    def get(self, request):
        uid = request.session.get("user_data")["uid"]
        page = int(request.GET.get("page"))
        total_num = RechargeRecords.objects.filter(user_id=uid).count()
        start = (page - 1) * PAGE_NUM  # 每页十条
        end = page * PAGE_NUM
        records = RechargeRecords.objects.filter(user_id=uid).values("id", "date", "amount")[start:end]
        return JsonResponse(
            {"code": 0, "msg": "success", "totalPages": math.ceil(total_num / PAGE_NUM), "resultList": list(records)})


# 查询记录
@method_decorator(check_session, name="dispatch")
class SelectRecords(views.View):
    def get(self, request):
        return render(request, "record/select_records.html", {"active": "select_records"})
