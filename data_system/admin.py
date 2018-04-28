from django.contrib import admin
from data_system.models import UserInfo, RechargeRecords, TelecomRealName, AntifraudMiGuan, FinanceInvestment

admin.site.site_header = '宏图数据后台管理系统'
admin.site.site_title = '宏图数据'


@admin.register(UserInfo)
class UserInfoAdmin(admin.ModelAdmin):
    """用户表"""
    # 设置只读字段
    readonly_fields = ('id',)
    # 显示的表名
    list_display = ('id', 'name', 'phone', 'date', 'score', 'tel_score', 'tel_score', 'invest_score')
    # 右侧过滤器
    list_filter = ('name', 'date')
    # 搜索关键字
    search_fields = ('phone', 'name')
    # list_per_page设置每页显示多少条记录，默认是100条
    # list_editable 设置默认可编辑字段
    list_editable = ['tel_score', 'tel_score', 'invest_score']
    # 设置哪些字段可以点击进入编辑界面
    list_display_links = ('id', 'name')
    # 详细时间分层筛选　
    date_hierarchy = 'date'


@admin.register(RechargeRecords)
class RechargeRecordsAdmin(admin.ModelAdmin):
    """充值记录"""
    readonly_fields = ('id',)
    list_display = ('id', 'user', 'amount', 'date')
    list_filter = ('amount', 'date')
    search_fields = ('user__name', 'user__phone')
    list_display_links = ('id', 'user')
    date_hierarchy = 'date'


@admin.register(TelecomRealName)
class TelecomRealNameAdmin(admin.ModelAdmin):
    """运营商三要素查询记录"""

    readonly_fields = ('id', 'user', 'real_name', 'id_card', 'mobile', 'msg', 'date', 'data', 'order_num')
    list_display = ('id', 'user', 'real_name', 'id_card', 'mobile', 'order_num', 'msg', 'date')
    list_filter = ('date',)
    search_fields = ('user__name', 'user__phone', 'real_name', 'id_card', 'mobile')
    list_display_links = ('id', 'user')
    date_hierarchy = 'date'


@admin.register(AntifraudMiGuan)
class AntifraudMiGuanAdmin(admin.ModelAdmin):
    """蜜罐查询记录"""

    readonly_fields = ('id', 'user', 'real_name', 'id_card', 'mobile', 'msg', 'date', 'data', 'order_num')
    list_display = ('id', 'user', 'real_name', 'id_card', 'mobile', 'order_num', 'msg', 'date')
    list_filter = ('date',)
    search_fields = ('user__name', 'user__phone', 'real_name', 'id_card', 'mobile')
    list_display_links = ('id', 'user')
    date_hierarchy = 'date'


@admin.register(FinanceInvestment)
class FinanceInvestmentAdmin(admin.ModelAdmin):
    """蜜罐查询记录"""

    readonly_fields = ('id', 'user', 'real_name', 'id_card', 'msg', 'date', 'data', 'order_num')
    list_display = ('id', 'user', 'real_name', 'id_card', 'order_num', 'msg', 'date')
    list_filter = ('date',)
    search_fields = ('user__name', 'user__phone', 'real_name', 'id_card', 'mobile')
    list_display_links = ('id', 'user')
    date_hierarchy = 'date'
