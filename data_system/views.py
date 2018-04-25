import base64
import json
import logging
import math
import time

import requests
from django import views
from django.http import JsonResponse
from django.shortcuts import redirect, render
from django.utils.decorators import method_decorator

from .create_md5 import doMd5
from .models import RechargeRecords, UserInfo, RecentSearchRecord
from .rc4crypt import rc4crypt
from .setting import MODELS_DEFINE, PAGE_NUM, SCORE_DEFINE, URL_DEFINE, CHINESE_DEFINE

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


# 检查 score 装饰器
def check_score(func):
    def inner(request, *args, **kwargs):
        score = request.session.get("user_data")["score"]
        service = request.POST.get("service")
        if score > SCORE_DEFINE[service]:
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
        return False


# 账户首页
@method_decorator(check_session, name="dispatch")
class Index(views.View):
    def get(self, request):
        uid = request.session.get("user_data")["uid"]
        records_list = RecentSearchRecord.objects.filter(user_id=uid)[:10]
        return render(request, "record/index.html", {"active": "index", "records_list": records_list})


# 公众数据获取
@method_decorator(check_session, name="dispatch")
class PublicData(views.View):
    """运营商三要素页面"""

    def get(self, request):
        return render(request, "record/pulic_data/telecom_realname.html",
                      {"active": "public_data", "public_active": "telecom_realname"})


@method_decorator(check_session, name="dispatch")
class AntifraudMiGuan(views.View):
    """蜜罐数据查询页面"""

    def get(self, request):
        return render(request, "record/pulic_data/miguan.html",
                      {"active": "public_data", "public_active": "miguan"})


@method_decorator(check_session, name="dispatch")
class FinanceInvestment(views.View):
    """ 对外投资查询页面"""

    def get(self, request):
        return render(request, "record/pulic_data/finance_investment.html",
                      {"active": "public_data", "public_active": "finance_investment"})


@method_decorator(check_session, name="dispatch")
@method_decorator(check_score, name="dispatch")
class CheckPublicData(views.View):
    """调用法眼三个接口"""

    def post(self, request):
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
        new_score = take_off_score(request, SCORE_DEFINE[request.POST.get("service")])
        if new_score is False or new_score < 0:
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
                    "user_id": request.session.get("user_data")["uid"],
                    "data": decrypt,
                    "msg": data_text["message"]
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


# 财务信息
@method_decorator(check_session, name="dispatch")
class FinancialInformation(views.View):
    def get(self, request):
        return render(request, "record/financial_information.html",
                      {"active": "financial_information"})


@method_decorator(check_session, name="dispatch")
class Recharge(views.View):
    """充值"""

    def post(self, request):
        uid = request.session.get("user_data")["uid"]
        amount = int(request.POST.get("amount"))
        score = UserInfo.objects.filter(id=uid)[0].score
        new_score = score + int(amount) * 2
        UserInfo.objects.filter(id=uid).update(score=new_score)
        RechargeRecords.objects.create(user_id=uid, amount=amount)
        user_data = request.session.get("user_data")
        user_data["score"] = new_score
        request.session["user_data"] = user_data
        return JsonResponse({"code": 0, "msg": "购买成功"})


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
