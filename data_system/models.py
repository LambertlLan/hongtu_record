from django.db import models


class UserInfo(models.Model):
    """用户表"""
    phone = models.CharField(max_length=64, verbose_name="手机号")
    password = models.CharField(max_length=32)
    email = models.EmailField()
    name = models.CharField(max_length=32)
    date = models.DateTimeField(auto_now_add=True)
    score = models.PositiveIntegerField(default=0)
    tel_score = models.PositiveIntegerField(default=10)
    miguan_score = models.PositiveIntegerField(default=20)
    invest_score = models.PositiveIntegerField(default=30)

    def __str__(self):
        return "%s %s" % (self.name, self.phone)

    class Meta:
        verbose_name_plural = "用户表"


class RechargeRecords(models.Model):
    """充值记录"""
    user = models.ForeignKey('UserInfo', None)
    amount = models.PositiveIntegerField()
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return "%s %s" % (self.user, self.amount)

    class Meta:
        verbose_name_plural = "充值记录"


class TelecomRealName(models.Model):
    """ 运营商三要素查询记录"""
    user = models.ForeignKey("UserInfo", None)
    real_name = models.CharField(max_length=64)
    id_card = models.CharField(max_length=64)
    mobile = models.CharField(max_length=64)
    data = models.TextField()
    date = models.DateField(auto_now_add=True)
    msg = models.CharField(max_length=64)

    def __str__(self):
        return " 查询%s %s" % (self.real_name, self.msg)


class AntifraudMiGuan(models.Model):
    """  蜜罐查询记录"""
    real_name = models.CharField(max_length=64)
    id_card = models.CharField(max_length=64)
    mobile = models.CharField(max_length=64)
    user = models.ForeignKey("UserInfo", None)
    data = models.TextField()
    date = models.DateField(auto_now_add=True)
    msg = models.CharField(max_length=64)

    def __str__(self):
        return "查询%s %s" % (self.real_name, self.msg)


class FinanceInvestment(models.Model):
    """ 个人对外投资查询记录"""
    real_name = models.CharField(max_length=64)
    id_card = models.CharField(max_length=64)
    user = models.ForeignKey("UserInfo", None)
    data = models.TextField()
    date = models.DateField(auto_now_add=True)
    msg = models.CharField(max_length=64)

    def __str__(self):
        return " 查询%s %s" % (self.real_name, self.msg)


class RecentSearchRecord(models.Model):
    """近期查询记录"""
    user = models.ForeignKey("UserInfo", None)
    name = models.CharField(max_length=64)
    date = models.DateField(auto_now_add=True)
    service = models.CharField(max_length=64)
    service_chinese = models.CharField(max_length=64)

    def __str__(self):
        return " %s查询 %s" % (self.name, self.service)
