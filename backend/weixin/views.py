from rest_framework.views import APIView
from rest_framework.response import Response

import requests
import json

from django.contrib.auth.models import User


class WeixinLogin(APIView):
    def post(self, request, format=None):
        """
        提供 post 请求
        """
        # 从请求中获得code
        code = json.loads(request.body).get('code')

        # 从本地文件中读取密钥
        # 读者可跳过此步骤，直接填写密钥
        f = open(r'D:\Developer\Py\django_weixinapp_tutorial\backend\secret.json', 'r')
        secrets = json.loads(f.read())
        f.close

        # 填写你的测试号密钥
        appid = secrets['appid']
        appsecret = secrets['appsecret']
        # 微信服务接口地址
        base_url = 'https://api.weixin.qq.com/sns/jscode2session'
        # 实际请求
        url = base_url + "?appid=" + appid + "&secret=" + appsecret + "&js_code=" + code + "&grant_type=authorization_code"
        response = requests.get(url)
        # 处理获取的 openid 
        try:
            openid = response.json()['openid']
            session_key = response.json()['session_key']
        except KeyError:
            return Response({'code': 'fail'})
        else:
            # 打印到后端命令行
            print(openid, session_key)

            try:
                user = User.objects.get(username=openid)
            except User.DoesNotExist:
                user = None

            if user:
                user = User.objects.get(username=openid)
            else:
                user = User.objects.create(
                    username=openid,
                    password=openid
                )

            return Response({'code': 'success'})