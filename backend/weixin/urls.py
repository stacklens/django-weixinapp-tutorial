from django.urls import path
from weixin.views import WeixinLogin, UserData

app_name = 'weixin'

urlpatterns = [
    path('login/', WeixinLogin.as_view(), name='login'),
    path('data/', UserData.as_view(), name='data'),
]