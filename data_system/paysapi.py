# __author: Lambert
# __date: 2018/5/1 21:13
import time
import os
from .setting import BASE_URL
from .create_md5 import doMd5
from .models import Order


class PaysApi(object):
    """三方支付接口"""

    def __init__(self, price, uid, pay_type):
        self.order_id = "CZ_%d" % int(round(time.time() * 1000))
        self.order_no = doMd5(self.order_id)
        self.price = price
        self.pay_uid = "84ebb8f38ae3a9dc39c9bf6f"
        self.token = "d865756907088ed994d84136a6a75f7b"
        self.goods_name = "商品名称"
        self.is_type = pay_type
        # 支付后payapi通知系统更新订单状态URL
        self.notify_url = "%s%s" % (BASE_URL, '/record/recharge/pay_success/')
        # 支付后paysapi跳转URL
        self.return_url = "%s%s" % (BASE_URL, '/record/recharge/pay_complete/')
        self.order_uid = uid
        self.string_key = self._get_string_key()
        self.api_key = doMd5(self.string_key)

    def _get_string_key(self):
        return self.goods_name + self.is_type + self.notify_url + self.order_id + str(self.order_uid) + str(
            self.price) + self.return_url + self.token + self.pay_uid

    def get_order_json(self):
        return self.__dict__

    def save_data(self):
        Order.objects.create(goods_name=self.goods_name, user_id=self.order_uid, price=self.price,
                             pay_type=self.is_type, order_id=self.order_id)


if __name__ == "__main__":
    paysapi = PaysApi(100, 1, 1)
    print(paysapi.get_order_json())
