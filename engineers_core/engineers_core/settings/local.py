from .base import *
import environ
from google.oauth2 import service_account

root = environ.Path(__file__) - 3
env_file = str(root.path('.env'))
env = environ.Env()
env.read_env(env_file)

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = env('DEBUG')

# Database
# https://docs.djangoproject.com/en/2.0/ref/settings/#databases
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'engineersCore',
        'USER': env('DATABASE_USER'),
        'PASSWORD': env('DATABASE_PASSWORD'),
        'HOST': env('DATABASE_HOST'),
        'PORT': '5432',
        'OPTIONS': {
            'charset': 'utf8mb4',
        },
    }
}

# Email
EMAIL_HOST = 'localhost'
EMAIL_PORT = 25

WEB_HOST = 'http://127.0.0.1:4200/'
BUCKET_URL = 'https://storage.cloud.google.com/test-packet-engineerscore/'
GS_BUCKET_NAME = 'test-packet-engineerscore'
# TODO: 認証ファイル読み込めてない？BUCKETへの読み書きアクセス失敗する...
GS_CREDENTIALS = service_account.Credentials.from_service_account_file(
    "./sodium-chalice-245511-a2e97bee388a.json"
)
