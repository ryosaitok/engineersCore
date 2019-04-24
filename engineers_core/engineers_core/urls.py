from django.contrib import admin
from django.urls import include, path, re_path
from django.views.generic import TemplateView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('engineers_core_app.urls')),
    re_path('.*', TemplateView.as_view(template_name='index.html')),
]