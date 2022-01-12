from django.urls import path
from weixin.views import WeixinLogin

app_name = 'weixin'

urlpatterns = [
    path('login/', WeixinLogin.as_view(), name='login'),
]