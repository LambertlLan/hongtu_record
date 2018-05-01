# __author: Lambert
# __date: 2018/4/23 10:15
from .models import TelecomRealName, AntifraudMiGuan, FinanceInvestment

SCORE_DEFINE = {
    "Telecom_realname": "tel_score",  # 运营商三要素
    "Antifraud_miguan": "miguan_score",  # 蜜罐数据
    "Finance_investment": "invest_score"  # 个人对外投资
}
MSG_CODE_DEFINE = {
    "url": "https://way.jd.com/chuangxin/dxjk",
    "app_key": "7fe5582455eb40da18b89b932749f29e",

}
URL_DEFINE = {
    "url": "http://api.fayanyun.com/v1/query/basic",
    "app_secret": "5S6HtkPbjbBDz2tm4bQmCTDnJHQWJtNa",
    "app_id": "1000000011"
}
MODELS_DEFINE = {
    "Telecom_realname": TelecomRealName,  # 运营商三要素
    "Antifraud_miguan": AntifraudMiGuan,  # 蜜罐数据
    "Finance_investment": FinanceInvestment  # 个人对外投资
}
CHINESE_DEFINE = {
    "Telecom_realname": "运营商三要素",  # 运营商三要素
    "Antifraud_miguan": "蜜罐数据",  # 蜜罐数据
    "Finance_investment": "个人对外投资"  # 个人对外投资
}
PAGE_NUM = 10