from django.contrib import admin
from data_system.models import UserInfo


# Register your models here.
@admin.register(UserInfo)
class UserInfoAdmin(admin.ModelAdmin):
    # 显示的表名
    list_display = ('name', 'id', 'phone', 'date')
    # 右侧过滤器
    list_filter = ('phone', 'name', 'date')
    # 搜索关键字
    search_fields = ('phone', 'name')
    # raw_id_fields = ('phone',)
    # list_editable = ('name',)
