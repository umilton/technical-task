
from django.conf.urls import url
from rest_framework.urlpatterns import format_suffix_patterns
from .views import ContactList, ContactRud

urlpatterns = [
    url(r'^contact/$', ContactList.as_view(), name='contact-list'),
    url(r'^contact/(?P<pk>[0-9]+)$', ContactRud.as_view(), name='contact-rud'),
]

urlpatterns = format_suffix_patterns(urlpatterns)