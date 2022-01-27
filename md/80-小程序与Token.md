上一章中，我们已经从微信接口服务中取到了用户的 openid ，并和 Django 服务器的本地用户关联上了。

但是这还没完啊，小程序客户端还不知道发生了啥，得给它也颁发个密码之类的**凭证**吧，以便后续发起业务请求时表明自己的身份。这类**凭证**的形式很多（甚至可以自定义个密钥），为了方便和主流起见，本文就直接采用 JSON Web Token 了。（下文称 Token）

## Django 后端

首先安装 `simplejwt` 库。这是个基于 DRF 的库，用它来操作 Token 非常之方便。

虚拟环境里执行：

```bash
(venv) > pip install djangorestframework-simplejwt
```

按照库文档的指示，在 Django 全局配置中增加下面的代码，指定通过 Token 的形式进行身份认证：

```python
# backend/backend/settings.py

...

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    )
}
```

接下来处理视图。对原有的 `WeixinLogin()` 类进行修改，并且新增 `UserData()` 视图类：

```python
# backend/weixin/views.py

...
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated


# 获取用户数据
class UserData(APIView):
    # 鉴权方式
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        return Response({'code': 'Authenticated.'})

    
# 微信登录
class WeixinLogin(APIView):
    def post(self, request, format=None):
        ...
        try:
            ...
        except KeyError:
            ...
        else:
            ...

            refresh = RefreshToken.for_user(user)

            return Response({
                    'code': 'success',
                    'refresh': str(refresh),
                    'access': str(refresh.access_token)
                })
```

- 视图类 `UserData()` 通过 `permission_classes` ，指定任何通过此类的请求必须是已登录用户。然后定义了一个简单的用于测试的 GET 请求。
- 视图类 `WeixinLogin()` 新增了一行代码，用于给当前用户生成一个有效期为 5 分钟的 Token，并将 Token 返回给小程序前端。

> `access` 即为 Token 。`refresh` 是用于 Token 失效后，重新获取新 Token 的令牌。不过本文为了简单起见，并不会用到这个刷新令牌。

老规矩，给新的视图类安排路由：

```python
# backend/weixin/urls.py

...
from weixin.views import WeixinLogin, UserData

urlpatterns = [
    ...
    path('data/', UserData.as_view(), name='data'),
]
```

Django 部分这样就可以了。

## 小程序前端

上一章在生命周期 `attached()` 中写的代码只是测试的，没太大用处。

因此这里将其大幅修改，变为下面这样：

```javascript
// frontend/pages/index/index.js

...

lifetimes: {
  attached() {
      
    // --------------
    // 步骤一：获取code
    // --------------
      
    wx.login({
      success(res) {
        if (res.code) {
            
          // --------------
          // 步骤二：用code换取token
          // --------------
            
          wx.request({
            url: 'http://127.0.0.1:8000/api/weixin/login/',
            method: 'POST',
            data: {
              code: res.code
            },
            success: res => {
              // 在小程序调试器中查看是否收到token
              console.log(res)
              const access = res.data.access
              // 将token保存到缓存
              wx.setStorage({ key: "access", data: access })
              // 保存token的获取时间
              wx.setStorage({
                key: "access_time",
                data: Date.parse(new Date())
              })
                
              // --------------
              // 步骤三：用token获取用户数据
              // --------------

              wx.request({
                url: 'http://127.0.0.1:8000/api/weixin/data/',
                header: {
                  // 注意字符串 'Bearer ' 尾部有个空格！
                  'Authorization': 'Bearer ' + access
                },
                success: res => {
                  // 在小程序调试器中查看返回值是否正确
                  console.log(res)
                }
              })
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },
},
```

这一大坨东西共分为三块功能：

- 步骤一：`wx.login()` 获取临时登录凭证 Code。
- 步骤二：`wx.request()` 用 Code 从 Django 服务器换取 Token，并将 Token 和获取的时间戳存到缓存中。
- 步骤三：`wx.request()` 在请求的 header 中携带 Token，去请求 Django 服务器的 `UserData()` 视图类。

一切顺利的话，这三步都会成功，并且在小程序调试器中打印出获取的数据，像下面这样：

![dwt-90-1](https://blog.dusaiphoto.com/img/dwt-90-1.jpg)

## 总结

到这里，我们已经打通小程序、Django 和微信接口服务的三端链路了。

接下来的工作就和常规的前后端分离项目基本相同了，即前端和后端通过 Token 进行鉴权和通讯的故事。

> 点赞 or 吐槽？来[博客](https://www.dusaiphoto.com/)或[GitHub](https://github.com/stacklens)评论区！



