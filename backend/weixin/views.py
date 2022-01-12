from rest_framework.views import APIView
from rest_framework.response import Response

class WeixinLogin(APIView):
    def get(self, request, format=None):
        """
        提供 get 请求
        """
        return Response({"data": "hello world."})
