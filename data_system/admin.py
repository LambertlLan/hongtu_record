from django.contrib import admin
from data_system.models import UserInfo, RechargeRecords, TelecomRealName, AntifraudMiGuan, FinanceInvestment, Role, \
    ServiceInterFace, RealNameExamine, ActionSwitch, Order, Notice, IdCardRealNameModel, IdCardImgModel

admin.site.site_header = '宏图数据后台管理系统'
admin.site.site_title = '宏图数据'


@admin.register(UserInfo)
class UserInfoAdmin(admin.ModelAdmin):
    """用户表"""
    # 设置只读字段
    readonly_fields = ('id',)
    # 显示的表名
    list_display = ('id', 'nickname', 'phone', 'date', 'score', 'tel_score', 'miguan_score', 'invest_score')
    # 右侧过滤器
    list_filter = ('nickname', 'date')
    # 搜索关键字
    search_fields = ('phone', 'nickname')
    # list_per_page设置每页显示多少条记录，默认是100条
    # list_editable 设置默认可编辑字段
    list_editable = ['tel_score', 'miguan_score', 'invest_score']
    # 设置哪些字段可以点击进入编辑界面
    list_display_links = ('id', 'nickname')
    # 详细时间分层筛选　
    date_hierarchy = 'date'


@admin.register(RechargeRecords)
class RechargeRecordsAdmin(admin.ModelAdmin):
    """充值记录"""
    readonly_fields = ('id',)
    list_display = ('id', 'user', 'amount', 'date')
    list_filter = ('amount', 'date')
    search_fields = ('user__real_name', 'user__phone')
    list_display_links = ('id', 'user')
    date_hierarchy = 'date'


@admin.register(TelecomRealName)
class TelecomRealNameAdmin(admin.ModelAdmin):
    """运营商三要素查询记录"""

    readonly_fields = ('id', 'user', 'real_name', 'id_card', 'mobile', 'msg', 'date', 'data', 'order_num')
    list_display = ('id', 'user', 'real_name', 'id_card', 'mobile', 'order_num', 'msg', 'date')
    list_filter = ('date',)
    search_fields = ('user__real_name', 'user__phone', 'real_name', 'id_card', 'mobile')
    list_display_links = ('id', 'user')
    date_hierarchy = 'date'


@admin.register(AntifraudMiGuan)
class AntifraudMiGuanAdmin(admin.ModelAdmin):
    """蜜罐查询记录"""

    readonly_fields = ('id', 'user', 'real_name', 'id_card', 'mobile', 'msg', 'date', 'data', 'order_num')
    list_display = ('id', 'user', 'real_name', 'id_card', 'mobile', 'order_num', 'msg', 'date')
    list_filter = ('date',)
    search_fields = ('user__real_name', 'user__phone', 'real_name', 'id_card', 'mobile')
    list_display_links = ('id', 'user')
    date_hierarchy = 'date'


@admin.register(FinanceInvestment)
class FinanceInvestmentAdmin(admin.ModelAdmin):
    """个人对外投资查询记录"""

    readonly_fields = ('id', 'user', 'real_name', 'id_card', 'msg', 'date', 'data', 'order_num')
    list_display = ('id', 'user', 'real_name', 'id_card', 'order_num', 'msg', 'date')
    list_filter = ('date',)
    search_fields = ('user__real_name', 'user__phone', 'real_name', 'id_card', 'mobile')
    list_display_links = ('id', 'user')
    date_hierarchy = 'date'


@admin.register(IdCardRealNameModel)
class IdCardRealNameAdmin(admin.ModelAdmin):
    """身份证二要素查询记录"""

    readonly_fields = ('id', 'user', 'real_name', 'id_card', 'msg', 'date', 'data')
    list_display = ('id', 'user', 'real_name', 'id_card', 'msg', 'date')
    list_filter = ('date',)
    search_fields = ('user__real_name', 'user__phone', 'real_name', 'id_card')
    list_display_links = ('id', 'user')
    date_hierarchy = 'date'


@admin.register(IdCardImgModel)
class IdCardRealNameAdmin(admin.ModelAdmin):
    """身份证核查与返照片查询记录"""

    readonly_fields = ('id', 'user', 'real_name', 'id_card', 'msg', 'date', 'data')
    list_display = ('id', 'user', 'real_name', 'id_card', 'msg', 'date')
    list_filter = ('date',)
    search_fields = ('user__real_name', 'user__phone', 'real_name', 'id_card')
    list_display_links = ('id', 'user')
    date_hierarchy = 'date'


@admin.register(ServiceInterFace)
class ServiceInterFaceAdmin(admin.ModelAdmin):
    """运营商三要素服务接口"""

    readonly_fields = ('id',)
    list_display = ('id', 'service', 'url','active_name')
    list_display_links = ('id', 'service')


@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    """角色管理"""

    readonly_fields = ('id',)
    list_display = ('id', 'name',)
    filter_horizontal = ('service',)
    list_display_links = ('id', 'name')


@admin.register(ActionSwitch)
class ActionSwitchAdmin(admin.ModelAdmin):
    """功能开关管理"""

    readonly_fields = ('id',)
    list_display = ('id', 'name', 'switch')
    list_display_links = ('id', 'name')
    list_editable = ['switch', ]


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    """订单管理"""

    readonly_fields = ('id', 'is_success')
    list_display = ('id', 'user', 'price', 'pay_type_chinese', 'order_id', 'is_success', 'date')
    search_fields = ('user', 'order_id')
    list_display_links = ('id', 'user')
    list_filter = ('date', 'pay_type')
    date_hierarchy = 'date'

    def pay_type_chinese(self, obj):
        if obj.pay_type == "1":
            return '支付宝'
        elif obj.pay_type == "2":
            return '微信'

    pay_type_chinese.short_description = "充值方式"


@admin.register(Notice)
class NoticeAdmin(admin.ModelAdmin):
    """订单管理"""

    readonly_fields = ('id',)
    list_editable = ['switch', ]
    list_display = ('id', 'title', 'content', 'switch', 'date')
    search_fields = ('title',)
    list_display_links = ('id', 'title')
    list_filter = ('date',)
    date_hierarchy = 'date'
