# __author: Lambert
# __date: 2018/4/18 11:27
# md5加密
import hashlib


def doMd5(data):
    hl = hashlib.md5()
    hl.update(data.encode(encoding="utf-8"))
    return hl.hexdigest()
