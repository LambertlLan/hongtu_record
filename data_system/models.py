from django.db import models


class UserInfo(models.Model):
    """用户表"""
    phone = models.CharField(max_length=64)
    password = models.CharField(max_length=32)
    email = models.EmailField()
    name = models.CharField(max_length=32)
    date = models.DateTimeField(auto_now_add=True)
    score = models.PositiveIntegerField(default=0)

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


class TelecomRealName:
    """三要素查询记录"""
    user = models.ForeignKey("UserInfo", None)
    data = models.TextField()
    date = models.DateField(auto_now_add=True)
    msg = models.CharField(max_length=64)

    def __str__(self):
        return "%s %s" % (self.user, self.msg)
