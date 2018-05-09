# __author: Lambert
# __date: 2018/4/23 10:15
from .models import TelecomRealName, AntifraudMiGuan, FinanceInvestment, IdCardRealNameModel, IdCardImgModel

# BASE_URL = "http://16313t6p27.iok.la:52686"  # 本地
BASE_URL = "http://www.hongtushuju.com"
# 身份证二要素接口
IDCARD_IMG_URL = {
    "url": "https://way.jd.com/hangzhoushumaikeji/eid_image_get",
    "app_key": "7fe5582455eb40da18b89b932749f29e"
}
# 身份证二要素接口
CHECK_NAME_ID = {
    "url": "https://way.jd.com/youhuoBeijing/YHVerifyIdcard",
    "app_key": "7fe5582455eb40da18b89b932749f29e"
}
# 分数对应参数
SCORE_DEFINE = {
    "Telecom_realname": "tel_score",  # 运营商三要素
    "Antifraud_miguan": "miguan_score",  # 蜜罐数据
    "Finance_investment": "invest_score",  # 个人对外投资
    "idcard_name": "idcard_name_score",  # 身份证两要素
    "idcard_img": "idcard_img_score"  # 身份证实名核验及返照
}
# 功能列表对应id
ACTION_ID_DEFINE = {
    "Telecom_realname": 2,  # 运营商三要素
    "Antifraud_miguan": 3,  # 蜜罐数据
    "Finance_investment": 4  # 个人对外投资
}
# 短信接口参数
MSG_CODE_DEFINE = {
    "url": "https://way.jd.com/chuangxin/dxjk",
    "app_key": "7fe5582455eb40da18b89b932749f29e",

}
# 法眼三个接口参数
URL_DEFINE = {
    "url": "http://api.fayanyun.com/v1/query/basic",
    "app_secret": "5S6HtkPbjbBDz2tm4bQmCTDnJHQWJtNa",
    "app_id": "1000000011"
}
# models分发
MODELS_DEFINE = {
    "Telecom_realname": TelecomRealName,  # 运营商三要素
    "Antifraud_miguan": AntifraudMiGuan,  # 蜜罐数据
    "Finance_investment": FinanceInvestment,  # 个人对外投资
    "idcard_name": IdCardRealNameModel,  # 身份证二要素
    "idcard_img": IdCardImgModel  # 身份证返照查询
}
# 中文含义
CHINESE_DEFINE = {
    "Telecom_realname": "运营商三要素",  # 运营商三要素
    "Antifraud_miguan": "个人反欺诈报告",  # 蜜罐数据
    "Finance_investment": "个人对外投资",  # 个人对外投资
    "idcard_name": "身份证二要素",  # 身份证二要素
    "idcard_img": "身份证核查及返照"  # 身份证返照查询
}
# 使用原始admin时使用
PAGE_NUM = 10

