from django.urls import path
from .views import FileUploadView, RegexProcessView


urlpatterns = [
    path('upload/', FileUploadView.as_view(), name='file-upload'),
    path('process/', RegexProcessView.as_view(), name='regex-process'),
]