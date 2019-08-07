from .base import *
import environ
from google.oauth2 import service_account

env = environ.Env()

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

# Database
# https://docs.djangoproject.com/en/2.0/ref/settings/#databases
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'HOST': env('DATABASE_HOST'),
        'USER': env('DATABASE_USER'),
        'PASSWORD': env('DATABASE_PASSWORD'),
        'NAME': 'engineersCore',
    }
}

# Email
EMAIL_HOST = 'smtp.sendgrid.net'
EMAIL_HOST_USER = env('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = env('EMAIL_HOST_PASSWORD')
EMAIL_PORT = 587
EMAIL_USE_TLS = True

WEB_HOST = 'https://engineers-core-frontend.appspot.com/'
BUCKET_URL = 'https://storage.cloud.google.com/packet-engineerscore/'
GS_BUCKET_NAME = 'packet-engineerscore'
# TODO: 認証ファイル読み込めてない？BUCKETへの読み書きアクセス失敗する...
GS_CREDENTIALS = service_account.Credentials.from_service_account_file(
    ""  # 認証ファイルを安全な場所から参照できるようにする必要あり
)
