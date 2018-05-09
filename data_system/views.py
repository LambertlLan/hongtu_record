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
    Order, Notice, IdCardRealNameModel, IdCardImgModel, Role, MinRechargeAmount
from .rc4crypt import rc4crypt
from .paysapi import PaysApi
from .setting import MODELS_DEFINE, SCORE_DEFINE, URL_DEFINE, CHINESE_DEFINE, PAGE_NUM, ACTION_ID_DEFINE, BASE_URL, \
    CHECK_NAME_ID, IDCARD_IMG_URL

logger = logging.getLogger('django')


# 检查 session 装饰器
def check_session(func):
    def inner(request, *args, **kwargs):
        is_login = request.session.get("user_data")
        if is_login:
            uid = is_login["uid"]
            # 判断开关是否开启
            if not UserInfo.objects.get(id=uid).switch:
                return redirect('/login/')

            session_key = UserInfo.objects.get(id=uid).session_key
            if request.session.session_key == session_key:

                return func(request, *args, **kwargs)
            else:
                return redirect('/login/')
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
        role_id = UserInfo.objects.get(id=uid).role_id
        interface_list = Role.objects.get(id=role_id).service.order_by("id").values("active_name", "service", "url")
        if len(interface_list) == 0:
            return redirect('/record/public_data/auth_real_name/')
        else:

            return func(request, interface_list, *args, **kwargs)

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


# 获取用户角色
def get_role(uid):
    role_id = UserInfo.objects.get(id=uid).role_id
    return role_id


# 调用外部接口验证姓名，身份证两要素
def check_name_id(name, id_card):
    res_msg = requests.get(CHECK_NAME_ID["url"],
                           {"realName": name, "cardNo": id_card, "appkey": CHECK_NAME_ID["app_key"]}, json=True)
    data_text = json.loads(res_msg.text)

    return data_text


# 首页
@method_decorator(check_session, name="dispatch")
class Index(views.View):
    def get(self, request):
        uid = request.session.get("user_data")["uid"]
        records_list = RecentSearchRecord.objects.order_by("-date").filter(user_id=uid)[:10]
        role_id = get_role(uid)
        notice = Notice.objects.last()
        return render(request, "record/index.html",
                      {"active": "index", "records_list": records_list, "notice": notice, "role_id": role_id})


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
class IdCardName(views.View):
    """身份中两要素查询"""

    def get(self, request, interface_list=None):
        uid = request.session.get("user_data")["uid"]
        service_fee = get_service_fee(uid, "idcard_name")
        switch = ActionSwitch.objects.get(id=5).switch
        return render(request, "record/pulic_data/idcard_name.html",
                      {"active": "public_data", "public_active": "idcard_name", "service_fee": service_fee,
                       "switch": switch, "interface_list": interface_list})

    def post(self, request, interface_list=None):
        uid = request.session.get("user_data")["uid"]
        name = request.POST.get("realName")
        id_card = request.POST.get("idCard")

        service_fee = get_service_fee(uid, "idcard_name")
        new_score = take_off_score(request, service_fee)
        if new_score < 0:
            logger.info("扣费发生错误")
            return JsonResponse({"code": 1, "msg": "扣费发生错误"})

        res_json = check_name_id(name, id_card)
        res_text = json.dumps(res_json)
        # 存入查询记录表
        obj = IdCardRealNameModel(user_id=uid, real_name=name, id_card=id_card, data=res_text,
                                  msg=res_json["msg"])
        obj.save()
        service_id = obj.id
        # 存入近期查询表
        RecentSearchRecord.objects.create(user_id=uid, name=name,
                                          service="idcard_name",
                                          service_chinese=CHINESE_DEFINE["idcard_name"], service_id=service_id)
        return JsonResponse({"code": 0, "msg": "success", "data": res_json, "new_score": new_score})


@method_decorator(check_session, name="dispatch")
@method_decorator(check_role, name="dispatch")
class IdCardImg(views.View):
    """身份中核验及返照"""

    def get(self, request, interface_list=None):
        uid = request.session.get("user_data")["uid"]
        service_fee = get_service_fee(uid, "idcard_img")
        switch = ActionSwitch.objects.get(id=6).switch
        return render(request, "record/pulic_data/idcard_img.html",
                      {"active": "public_data", "public_active": "idcard_img", "service_fee": service_fee,
                       "switch": switch, "interface_list": interface_list})

    def post(self, request, interface_list=None):
        uid = request.session.get("user_data")["uid"]
        name = request.POST.get("realName")
        id_card = request.POST.get("idCard")
        # 检查验证码
        self.check_msg_code(request)
        # 扣费
        service_fee = get_service_fee(uid, "idcard_img")
        new_score = take_off_score(request, service_fee)
        if new_score < 0:
            logger.info("扣费发生错误")
            return JsonResponse({"code": 1, "msg": "扣费发生错误"})

        res_json = self.get_idcard_img(name, id_card)
        res_text = json.dumps(res_json)
        # 存入查询记录表
        obj = IdCardImgModel(user_id=uid, real_name=name, id_card=id_card, data=res_text,
                             msg=res_json["msg"])
        obj.save()
        service_id = obj.id
        # 存入近期查询表
        RecentSearchRecord.objects.create(user_id=uid, name=name,
                                          service="idcard_img",
                                          service_chinese=CHINESE_DEFINE["idcard_img"],
                                          service_id=service_id)
        return JsonResponse({"code": 0, "msg": "success", "data": res_json, "new_score": new_score})

    # 调用外部接口获取身份证照片
    def get_idcard_img(self, name, id_card):
        data = 'name=%s&idcard=%s' % (name, id_card,)
        res_msg = requests.post(IDCARD_IMG_URL["url"], params={"appkey": IDCARD_IMG_URL["app_key"]},
                                data=data.encode(), json=True)
        data_text = json.loads(res_msg.text)

        return data_text

    def check_msg_code(self, request):
        msg_code = request.POST.get("msgCode")
        try:
            if msg_code != request.session.get("phoneVerifyCode")["code"]:
                return JsonResponse({"code": 1, "msg": "验证码不正确"})
            else:
                del request.session["phoneVerifyCode"]
        except Exception as e:
            return JsonResponse({"code": 1, "msg": "验证码不正确"})


@method_decorator(check_session, name="dispatch")
@method_decorator(check_role, name="dispatch")
class PublicData(views.View):
    """运营商三要素页面"""

    def get(self, request, interface_list=None):
        uid = request.session.get("user_data")["uid"]
        service_fee = get_service_fee(uid, "Telecom_realname")
        switch = ActionSwitch.objects.get(id=2).switch
        return render(request, "record/pulic_data/telecom_realname.html",
                      {"active": "public_data", "public_active": "telecom_realname", "service_fee": service_fee,
                       "switch": switch, "interface_list": interface_list})


@method_decorator(check_session, name="dispatch")
@method_decorator(check_role, name="dispatch")
class AntifraudMiGuan(views.View):
    """蜜罐数据查询页面"""

    def get(self, request, interface_list=None):
        uid = request.session.get("user_data")["uid"]
        service_fee = get_service_fee(uid, "Antifraud_miguan")
        switch = ActionSwitch.objects.get(id=3).switch
        return render(request, "record/pulic_data/miguan.html",
                      {"active": "public_data", "public_active": "miguan", "service_fee": service_fee,
                       "switch": switch, "interface_list": interface_list})


@method_decorator(check_session, name="dispatch")
@method_decorator(check_role, name="dispatch")
class FinanceInvestment(views.View):
    """ 对外投资查询页面"""

    def get(self, request, interface_list=None):
        uid = request.session.get("user_data")["uid"]
        service_fee = get_service_fee(uid, "Finance_investment")
        switch = ActionSwitch.objects.get(id=4).switch
        return render(request, "record/pulic_data/finance_investment.html",
                      {"active": "public_data", "public_active": "finance_investment", "service_fee": service_fee,
                       "switch": switch, "interface_list": interface_list})


@method_decorator(check_session, name="dispatch")
@method_decorator(check_score, name="dispatch")
class CheckPublicData(views.View):
    """调用法眼三个接口"""

    def post(self, request, interface_list=None):
        service = request.POST.get("service")
        switch = ActionSwitch.objects.get(id=ACTION_ID_DEFINE[service]).switch

        # 判断功能是否已经在后台关闭
        if not switch:
            del request.session["phoneVerifyCode"]
            return JsonResponse({"code": 12000, "msg": "该功能暂时关闭"})

        # 如果不是查询运营商三要素就验证验证码
        if service != "Telecom_realname":
            msg_code = request.POST.get("msgCode")
            try:
                if msg_code != request.session.get("phoneVerifyCode")["code"]:
                    return JsonResponse({"code": 1, "msg": "验证码不正确"})
                else:
                    del request.session["phoneVerifyCode"]
            except Exception as e:
                return JsonResponse({"code": 1, "msg": "验证码不正确"})

        # 由于需要验证身份证和姓名,所以先扣钱
        uid = request.session.get("user_data")["uid"]
        service_fee = get_service_fee(uid, service)
        new_score = take_off_score(request, service_fee)
        if new_score < 0:
            logger.info("扣费发生错误")
            return JsonResponse({"code": 1, "msg": "扣费发生错误"})

        # 如果查询蜜罐数据先验证身份证姓名两要素
        if service == "Antifraud_miguan":
            flag = False
            name_id_res = check_name_id(request.POST.get("realName"), request.POST.get("idCard"))
            try:
                flag = name_id_res["result"]["result"]["isok"]
            except Exception as e:
                logger.info("请求两要素验证出错,%s" % name_id_res.text)
            if not flag:
                return JsonResponse({"code": 1, "msg": "身份证和姓名不一致", "new_score": new_score})

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

        # 个人对外投资查询不需要手机号
        try:
            phone = request.POST.get("mobile")
        except Exception as e:
            phone = None

        if phone:
            params["phone"] = phone

        # 开始rc4加密
        try:
            rc4_data = rc4crypt(json.dumps(params), URL_DEFINE["app_secret"])
        except Exception as e:
            logger.info(e)
            return JsonResponse({"code": 1, "msg": "加密发生错误", "new_score": new_score})

        # base64转码
        base64_rc4 = base64.b64encode(rc4_data.encode("latin1"))
        data_json["params"] = str(base64_rc4, "latin1")
        res_msg = requests.post(URL_DEFINE["url"], data_json, json=True)
        data_text = json.loads(res_msg.text)
        if data_text["code"] == 200:
            wait_jie = data_text["data"]["report"]
            jie = base64.b64decode(wait_jie)

            # 解密
            try:
                decrypt = rc4crypt(jie.decode("latin1"), URL_DEFINE["app_secret"])
            except Exception as e:
                logger.info(e)
                return JsonResponse({"code": 1, "msg": "解密过程发生问题", "new_score": new_score})
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
                    obj = obj(**database_dict)
                    obj.save()
                    service_id = obj.id
                    # 存入近期查询表
                    RecentSearchRecord.objects.create(user_id=database_dict["user_id"], name=database_dict["real_name"],
                                                      service=params["service"],
                                                      service_chinese=CHINESE_DEFINE[params["service"]],
                                                      service_id=service_id)
                    base64_decrypt = bytes.decode(base64.b64encode(decrypt.encode("utf8")))
                    return JsonResponse(
                        {"code": 0, "msg": "success", "new_score": new_score, "data": base64_decrypt,
                         "info": request.POST.dict()})
                else:
                    return JsonResponse({"code": 1, "msg": "存入数据库出错"})
        else:
            logger.info(data_text)
            return JsonResponse({"code": 1, "msg": "外部服务器出错", "new_score": new_score})


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
        if service == "Finance_investment" or service == "idcard_name" or service == "idcard_img":

            result_list = list(
                obj.objects.order_by("-date").filter(user_id=uid).values("id", "date", "id_card", "real_name")[
                start:end])
        else:
            result_list = list(
                obj.objects.order_by("-date").filter(user_id=uid).values("id", "date", "mobile", "id_card",
                                                                         "real_name")[start:end])

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
        if service == "Finance_investment" or service == "idcard_name" or service == "idcard_img":

            result = list(obj.objects.filter(id=tid).values("date", "id_card", "real_name", "data", "msg"))[0]
        else:
            result = list(obj.objects.filter(id=tid).values("date", "mobile", "id_card", "real_name", "data", "msg"))[0]

        result["data"] = bytes.decode(base64.b64encode(result["data"].encode("utf8")))
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
        uid = request.session.get("user_data")["uid"]
        role_id = get_role(uid)
        return render(request, "record/account_information.html", {"active": "account_information", "role_id": role_id})


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
        role_id = get_role(uid)
        if real_name_exists or enterprise_exists:
            return render(request, "record/account_update.html", {"active": "account_information", "examining": True})
        else:
            return render(request, "record/account_update.html", {"active": "account_information", "role_id": role_id})


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
    '''企业用户认证'''

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
        min_recharge_amount = MinRechargeAmount.objects.last().amount
        return render(request, "record/financial_information.html",
                      {"active": "financial_information", "minAmount": min_recharge_amount})


class PaySuccess(views.View):
    """充值成功供外部回调"""

    def post(self, request):
        token = "d865756907088ed994d84136a6a75f7b"

        uid = request.POST.get("orderuid")
        order_id = request.POST.get("orderid")
        price = request.POST.get("price")
        real_price = request.POST.get("realprice")
        server_key = request.POST.get("key")
        paysapi_id = request.POST.get("paysapi_id")
        string_key = order_id + uid + paysapi_id + str(price) + str(real_price) + token
        key = doMd5(string_key)
        if server_key == key:
            # 更新订单状态
            Order.objects.filter(order_id=order_id).update(is_success=True)
            # 更新用户积分
            score = UserInfo.objects.filter(id=uid)[0].score
            new_score = score + float(price) * 2
            UserInfo.objects.filter(id=uid).update(score=new_score)
            # 增加一条充值记录
            RechargeRecords.objects.create(user_id=uid, amount=float(price))

        return JsonResponse({"code": 0})


@method_decorator(check_session, name="dispatch")
class PayComplete(views.View):
    """充值完成"""

    def get(self, request):
        uid = request.session.get("user_data")["uid"]
        score = UserInfo.objects.get(id=uid).score
        # 更新session
        user_data = request.session.get("user_data")
        user_data["score"] = score
        request.session["user_data"] = user_data
        return render(request, "record/financial_pay_success.html", {"score": score})


@method_decorator(check_session, name="dispatch")
class GetPayPage(views.View):
    """跳转到支付页面"""

    def post(self, request):
        uid = request.session.get("user_data")["uid"]
        amount = request.POST.get("amount")
        min_recharge_amount = MinRechargeAmount.objects.last().amount
        if int(amount) < min_recharge_amount:
            return redirect('/record/financial_information/recharge/')
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
