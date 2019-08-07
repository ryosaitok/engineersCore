from django.contrib import admin
from django.urls import include, path, re_path
from django.conf.urls import url
from django.views.generic import TemplateView
from django.http import HttpResponse

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('engineers_core_app.urls')),
    # 検索エンジンのクロールを全拒否
    url(r'^robots.txt$', lambda r: HttpResponse("User-agent: *\nDisallow: /", content_type="text/plain")),
    re_path('.*', TemplateView.as_view(template_name='index.html')),
]
