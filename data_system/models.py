from django.db import models


class UserInfo(models.Model):
    """用户表"""

    phone = models.CharField(max_length=64, verbose_name="手机号")

    password = models.CharField(max_length=32, verbose_name="密码")
    switch = models.BooleanField(default=True, verbose_name="是否激活")

    email = models.EmailField()
    nickname = models.CharField(max_length=32, verbose_name="昵称")
    date = models.DateTimeField(auto_now_add=True, verbose_name="注册日期")
    score = models.FloatField(default=0, verbose_name="剩余积分")
    session_key = models.CharField(max_length=64, default=None, null=True)
    # 自定义各个接口需要积分
    tel_score = models.FloatField(default=2.4, verbose_name="运营商三要素消耗积分")
    idcard_name_score = models.FloatField(default=3, verbose_name="身份中二要素查询消耗积分")
    idcard_img_score = models.FloatField(default=7, verbose_name="身份证实名核验及返照消耗积分")
    miguan_score = models.FloatField(default=10, verbose_name="蜜罐数据消耗积分")
    invest_score = models.FloatField(default=12, verbose_name="个人对外投资消耗积分")
    role = models.ForeignKey("Role", verbose_name="角色", on_delete=True, default=1)
    # 实名认证字段
    real_name = models.CharField(max_length=32, verbose_name="真实姓名", blank=True, null=True, default=None)
    id_card = models.CharField(max_length=64, verbose_name="身份证号", blank=True, null=True, default=None)
    pros_id_card_img = models.ImageField(upload_to='upload', verbose_name="身份证正面照", blank=True, null=True, default=None)
    cons_id_card_img = models.ImageField(upload_to='upload', verbose_name="身份证反面照", blank=True, null=True, default=None)
    # 企业认证字段
    enterprise_name = models.CharField(max_length=32, verbose_name="企业名称", default=None, blank=True, null=True)

    corporation_name = models.CharField(max_length=32, verbose_name="法人姓名", default=None, blank=True, null=True)

    organization_code = models.CharField(max_length=64, verbose_name="组织机构代码", default=None, blank=True, null=True, )

    business_license_img = models.ImageField(upload_to='upload', verbose_name="企业营业执照", default=None, blank=True,
                                             null=True, )


    def __str__(self):
        return "%s-%s" % (self.nickname, self.phone)

    class Meta:
        verbose_name_plural = "用户管理"


class Role(models.Model):
    """角色表"""

    name = models.CharField(max_length=32, verbose_name="角色名称")
    service = models.ManyToManyField("ServiceInterFace", verbose_name="对应权限", blank=True)

    def __str__(self):
        return "%s-%s" % (self.name, self.service)

    class Meta:
        verbose_name_plural = "角色管理"


class ServiceInterFace(models.Model):
    """接口权限表"""
    active_name = models.CharField(max_length=32, verbose_name="激活名称", default=None)
    service = models.CharField(max_length=32, verbose_name="服务名称")
    url = models.CharField(max_length=64, verbose_name="接口地址")

    def __str__(self):
        return "%s-%s" % (self.service, self.url)

    class Meta:
        verbose_name_plural = "接口权限管理"


class RechargeRecords(models.Model):
    """充值记录"""
    user = models.ForeignKey('UserInfo', None, verbose_name="用户-电话号码")
    amount = models.FloatField(verbose_name="充值金额")
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


class IdCardImgModel(models.Model):
    """ 身份证返照查询记录"""
    user = models.ForeignKey("UserInfo", None, verbose_name="查询人-手机号")
    real_name = models.CharField(max_length=64, verbose_name="被查询人姓名")
    id_card = models.CharField(max_length=64, verbose_name="被查询人身份证")
    data = models.TextField(verbose_name="查询返回数据")
    date = models.DateField(auto_now_add=True, verbose_name="查询时间")
    msg = models.CharField(max_length=64, verbose_name="查询结果")

    def __str__(self):
        return " 查询%s %s" % (self.real_name, self.msg)

    class Meta:
        verbose_name_plural = "身份证返照查询记录"


class IdCardRealNameModel(models.Model):
    """ 身份证二要素查询记录"""
    user = models.ForeignKey("UserInfo", None, verbose_name="查询人-手机号")
    real_name = models.CharField(max_length=64, verbose_name="被查询人姓名")
    id_card = models.CharField(max_length=64, verbose_name="被查询人身份证")
    data = models.TextField(verbose_name="查询返回数据")
    date = models.DateField(auto_now_add=True, verbose_name="查询时间")
    msg = models.CharField(max_length=64, verbose_name="查询结果")

    def __str__(self):
        return " 查询%s %s" % (self.real_name, self.msg)

    class Meta:
        verbose_name_plural = "身份证二要素查询记录"


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
    service_id = models.PositiveIntegerField(default=1, blank=True)
    service_chinese = models.CharField(max_length=64)

    def __str__(self):
        return " %s查询 %s" % (self.name, self.service)

    class Meta:
        verbose_name_plural = "近期查询记录"


class RealNameExamine(models.Model):
    """实名认证审核表"""
    user = models.ForeignKey("UserInfo", None)
    real_name = models.CharField(max_length=32, verbose_name="真实姓名")
    id_card = models.CharField(max_length=64, verbose_name="身份证号")
    pros_id_card_img = models.ImageField(upload_to='upload', verbose_name="身份证正面照", blank=True, null=True, default=None)
    cons_id_card_img = models.ImageField(upload_to='upload', verbose_name="身份证反面照", blank=True, null=True, default=None)
    is_adopt = models.BooleanField(default=False, verbose_name="是否通过")
    is_exam = models.BooleanField(default=False, verbose_name="是否审核")
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return "%s实名认证 审核状态%s" % (self.real_name, self.is_adopt)

    class Meta:
        verbose_name_plural = "实名认证审核表"


class EnterpriseExamine(models.Model):
    """企业认证审核表"""
    user = models.ForeignKey("UserInfo", None)
    enterprise_name = models.CharField(max_length=32, verbose_name="企业名称")
    corporation_name = models.CharField(max_length=32, verbose_name="法人姓名", default=None)
    organization_code = models.CharField(max_length=64, verbose_name="组织机构代码")
    business_license_img = models.ImageField(upload_to='upload', verbose_name="企业营业执照")
    is_adopt = models.BooleanField(default=False, verbose_name="是否通过")
    is_exam = models.BooleanField(default=False, verbose_name="是否审核")
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return "%s企业认证 审核状态%s" % (self.enterprise_name, self.is_adopt)

    class Meta:
        verbose_name_plural = "企业认证审核表"


class Order(models.Model):
    """订单表"""
    goods_name = models.CharField(max_length=64, verbose_name="商品名称")
    user = models.ForeignKey("UserInfo", None, verbose_name="昵称-手机号")
    price = models.FloatField(verbose_name="充值金额")
    pay_type = models.CharField(max_length=32, verbose_name="充值方式(1=支付宝,2=微信)")
    order_id = models.CharField(max_length=64, verbose_name="订单编号")
    is_success = models.BooleanField(default=False, verbose_name="是否成功")
    date = models.DateTimeField(auto_now_add=True, verbose_name="下单时间")

    def __str__(self):
        return "用户%s充值金额%s" % (self.user_id, self.price)

    class Meta:
        verbose_name_plural = "订单管理"


class ActionSwitch(models.Model):
    """功能开关"""
    name = models.CharField(max_length=64, verbose_name="功能名称")
    switch = models.BooleanField(default=False, verbose_name="开关")

    def __str__(self):
        return "%s功能%s" % (self.name, self.switch)

    class Meta:
        verbose_name_plural = "功能开关"


class Notice(models.Model):
    """公告通知"""
    title = models.CharField(max_length=64, verbose_name="公告标题")
    content = models.TextField(verbose_name="公告内容")
    switch = models.BooleanField(default=True, verbose_name="是否显示")
    date = models.DateTimeField(auto_now_add=True, verbose_name="创建时间")

    def __str__(self):
        return "%s创建时间 %s" % (self.title, self.date)

    class Meta:
        verbose_name_plural = "公告管理"


class MinRechargeAmount(models.Model):
    """最低充值金额"""
    amount = models.PositiveIntegerField(default=0, verbose_name="最低充值金额")

    class Meta:
        verbose_name_plural = "最低充值金额"
