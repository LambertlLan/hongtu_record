=====
Hongtu_record
=====

Polls is a simple Django app to conduct Web-based polls. For each
question, visitors can choose between a fixed number of answers.

Detailed documentation is in the "docs" directory.

Quick start
-----------

1. 将appname添加到settings中:

    INSTALLED_APPS = [
        ...
        'hongtu_record',
    ]

2. 关闭debug模式DEBUG = False

3. 迁移数据库:Run `python manage.py migrate` to create the polls models.

4. 添加静态根路径add "STATIC_ROOT = os.path.join(BASE_DIR, 'static')" in settings.py

5. 集合静态文件 python3 manage.py collectstatic

6.添加角色管理,中角色为普通用户,实名认证用户,企业认证用户

7.添加各个要素权限

8.添加功能开关顺序为注册\运营商\蜜罐\个人对外投资\身份证两要素\身份证核查

9.配置服务器数据库地址
 edit DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'hongtu_record',
        'HOST': "localhost",
        'PORT': "3306",
        'USER': "root",
        'PASSWORD': "" # 服务器
    }
}

