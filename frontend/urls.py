from django.conf.urls import url
from django.views.generic import TemplateView

from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    url(r'^index/$', TemplateView.as_view(template_name='index.html')),
]+ static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

