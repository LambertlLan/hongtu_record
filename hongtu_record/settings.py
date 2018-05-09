"""
Django settings for hongtu_record project.

Generated by 'django-admin startproject' using Django 2.0.4.

For more information on this file, see
https://docs.djangoproject.com/en/2.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/2.0/ref/settings/
"""

import os

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/2.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'z)be5op91#l^_aevnf5z9cydnuy_b=e0laci)&#+g*69mwbv$*'

ALLOWED_HOSTS = "*"

# Application definition

INSTALLED_APPS = [
    'suit',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'data_system.apps.DataSystemConfig',
    'web.apps.DataSystemConfig',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    # 'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'hongtu_record.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')]
        ,
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'django.template.context_processors.media'  # TEMPLATE 中引用media

            ],
        },
    },
]

WSGI_APPLICATION = 'hongtu_record.wsgi.application'

# Password validation
# https://docs.djangoproject.com/en/2.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
# https://docs.djangoproject.com/en/2.0/topics/i18n/

LANGUAGE_CODE = 'zh-Hans'

TIME_ZONE = 'Asia/Shanghai'

USE_I18N = True

USE_L10N = False

USE_TZ = False

DATETIME_FORMAT = 'Y-m-d H:i:s'

DATE_FORMAT = 'Y-m-d'

SUIT_CONFIG = {
    'ADMIN_NAME': '宏图数据后台管理系统',
    'LIST_PER_PAGE': 10,
    'MENU': (
        'sites',
        {'app': 'data_system', 'label': '用户管理', 'icon': 'icon-user', 'models': ('UserInfo',)},
        {'app': 'data_system', 'label': '充值记录', 'icon': 'icon-list-alt', 'models': ('RechargeRecords',)},
        {'app': 'data_system', 'label': '接口查询记录', 'icon': 'icon-eye-open',
         'models': (
         'TelecomRealName', 'AntifraudMiGuan', 'FinanceInvestment', 'IdCardRealNameModel', 'IdCardImgModel')},
        {'app': 'data_system', 'label': '权限管理', 'icon': 'icon-tags',
         'models': ('Role', 'ServiceInterFace')},
        {'label': '审核管理', 'icon': 'icon-bookmark', 'models': (
            {'url': '/gz/examination/real_name/', 'label': '实名认证审核'},
            {'url': '/gz/examination/enterprise/', 'label': '企业认证审核'},
        )},
        {'app': 'data_system', 'label': '功能管理', 'icon': 'icon-list-alt', 'models': ('ActionSwitch',)},
        {'app': 'data_system', 'label': '订单管理', 'icon': 'icon-gift', 'models': ('Order',)},
        {'app': 'data_system', 'label': '公告管理', 'icon': 'icon-bullhorn', 'models': ('Notice',)},
        {'app': 'data_system', 'label': '最低充值金额', 'icon': 'icon-tint', 'models': ('MinRechargeAmount',)},
    )

}
# Database
# https://docs.djangoproject.com/en/2.0/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'hongtu_record',
        'HOST': "localhost",
        'PORT': "3306",
        'USER': "root",
        'PASSWORD': "lanyu0409"
        # 'PASSWORD': "hongtu123"  # 服务器
    }
}

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/2.0/howto/static-files/

STATIC_URL = '/static/'

# 部署时需要加上,nginx静态文件夹要加上statics
# STATIC_ROOT = os.path.join(BASE_DIR, 'static')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

STATICFILES_DIRS = (
    os.path.join(BASE_DIR, 'static'),
)
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

APPEND_SLASH = True

# 日志文件
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '[%(asctime)s] [%(levelname)s] %(message)s'
        },
    },
    'handlers': {
        'console': {
            'level': 'INFO',
            'class': 'logging.StreamHandler',
            'formatter': 'verbose'
        },
        'file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': os.path.join(BASE_DIR, "hongtuRecord.log"),
            'formatter': 'verbose'
        },
        'email': {
            'level': 'ERROR',
            'class': 'django.utils.log.AdminEmailHandler',
            'include_html': True,
        }
    },
    'loggers': {
        'django': {
            'handlers': ['console', 'file', 'email'],
            'level': 'INFO',
            'propagate': True,
        },
    },
}
