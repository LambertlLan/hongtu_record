from django.db import models


class UserInfo(models.Model):
    """用户表"""
    phone = models.CharField(max_length=64, verbose_name="手机号")
    password = models.CharField(max_length=32, verbose_name="密码")
    email = models.EmailField()
    name = models.CharField(max_length=32, verbose_name="姓名")
    date = models.DateTimeField(auto_now_add=True, verbose_name="注册日期")
    score = models.PositiveIntegerField(default=0, verbose_name="剩余积分")
    tel_score = models.PositiveIntegerField(default=10, verbose_name="运营商三要素消耗积分")
    miguan_score = models.PositiveIntegerField(default=20, verbose_name="蜜罐数据消耗积分")
    invest_score = models.PositiveIntegerField(default=30, verbose_name="个人对外投资消耗积分")

    def __str__(self):
        return "%s-%s" % (self.name, self.phone)

    class Meta:
        verbose_name_plural = "用户管理"


class RechargeRecords(models.Model):
    """充值记录"""
    user = models.ForeignKey('UserInfo', None, verbose_name="用户-电话号码")
    amount = models.PositiveIntegerField(verbose_name="充值金额")
    date = models.DateTimeField(auto_now_add=True, verbose_name="充值日期")

    def __str__(self):
        return "%s %s" % (self.user, self.amount)

    class Meta:
        verbose_name_plural = "充值记录"


class TelecomRealName(models.Model):
    """ 运营商三要素查询记录"""
    user = models.ForeignKey("UserInfo", None, verbose_name="查询人-手机号")
    real_name = models.CharField(max_length=64, verbose_name="被查询人姓名")
    id_card = models.CharField(max_length=64, verbose_name="被查询人身份证")
    mobile = models.CharField(max_length=64, verbose_name="被查询人手机号")
    data = models.TextField(verbose_name="查询返回数据")
    date = models.DateField(auto_now_add=True, verbose_name="查询时间")
    msg = models.CharField(max_length=64, verbose_name="查询结果")
    order_num = models.CharField(default=0, max_length=64, verbose_name="订单号")

    def __str__(self):
        return " 查询%s %s" % (self.real_name, self.msg)

    class Meta:
        verbose_name_plural = "运营商三要素查询记录"


class AntifraudMiGuan(models.Model):
    """  蜜罐查询记录"""
    real_name = models.CharField(max_length=64, verbose_name="被查询人姓名")
    id_card = models.CharField(max_length=64, verbose_name="被查询人身份证")
    mobile = models.CharField(max_length=64, verbose_name="被查询人手机号")
    user = models.ForeignKey("UserInfo", None, verbose_name="查询人-手机号")
    data = models.TextField(verbose_name="查询返回数据")
    date = models.DateField(auto_now_add=True, verbose_name="查询时间")
    msg = models.CharField(max_length=64, verbose_name="查询结果")
    order_num = models.CharField(default=0, max_length=64, verbose_name="订单号")

    def __str__(self):
        return "查询%s %s" % (self.real_name, self.msg)

    class Meta:
        verbose_name_plural = "蜜罐查询记录"


class FinanceInvestment(models.Model):
    """ 个人对外投资查询记录"""
    real_name = models.CharField(max_length=64, verbose_name="被查询人姓名")
    id_card = models.CharField(max_length=64, verbose_name="被查询人身份证")
    user = models.ForeignKey("UserInfo", None, verbose_name="查询人-手机号")
    data = models.TextField(verbose_name="查询返回数据")
    date = models.DateField(auto_now_add=True, verbose_name="查询时间")
    msg = models.CharField(max_length=64, verbose_name="查询结果")
    order_num = models.CharField(default=0, max_length=64, verbose_name="订单号")

    def __str__(self):
        return " 查询%s %s" % (self.real_name, self.msg)

    class Meta:
        verbose_name_plural = "个人对外投资查询记录"


class RecentSearchRecord(models.Model):
    """近期查询记录"""
    user = models.ForeignKey("UserInfo", None)
    name = models.CharField(max_length=64)
    date = models.DateField(auto_now_add=True)
    service = models.CharField(max_length=64)
    service_chinese = models.CharField(max_length=64)

    def __str__(self):
        return " %s查询 %s" % (self.name, self.service)
