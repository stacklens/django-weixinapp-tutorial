激动人心的时刻要来了。搞来搞去这么多章，终于要真正实现在云端存取待办清单数据了。

袖子撸好，马上开车。

## Django后端

要存取数据，Django 内置的 `User` 肯定不够用啊（因为没有存储清单数据的合适字段），所以要对其进行扩展。

扩展就意味着修改。为了避免新手同学们搞不清状况，先进入Django 管理员后台，将之前章节 openid 生成的微信用户都删除掉，以免扩表时发生冲突。

> 如果没清除干净，数据迁移时命令行会问你某字段应该填入什么默认值，诸如此类的问题。

在 `backend/weixin/models.py` 写入以下代码：

```python
# backend/weixin/models.py

from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver


def empty_items():
    return {'items': []}

class Profile(models.Model):
    # 与User外键连接
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    # 待办清单的json字段
    items = models.JSONField(default=empty_items)


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)


@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()
```

内容不多，但信息量相当大。

首先看模型类 `Profile()` ，它通过”一对一外键“ `OneToOneField` 和内置的 `User` 链接起来，通过它就起到扩展用户字段的作用。

字段 `items` 是个 json 字段，用于存储待办清单的数据。它的默认值 `empty_items` 是个**可调用对象**，此对象返回一个字典。

有同学可能会问了：那为什么不直接指定一个字典对象呢？比如这样写：

```python
items = models.JSONField(default={'items': []})
```

上面这样写是有问题的，因为 Django 的底层实现对这个默认值采用的是引用的方式。也就是说，如果存在多个 `Profile` 的实例，此字典对象会在多个实例间共享，这通常不是你想要的结果。（比如某个实例数据莫名其妙改变了）

代码下半部分两个函数都用到了 `@receiver` 装饰器，表示这是两个接收**信号**的函数。它们的原理是每当 `User` 创建或保存时，会发送自动**信号**通知对应的 `@receiver` 装饰的函数，而这两个函数则立即创建了 `Profile` 模型与之对应。

继续。修改了模型，当然要数据迁移：

```bash
(venv) > python manage.py makemigrations
(venv) > python manage.py migrate
```

模型搞定了，就来修改视图类 `UserData()` ：

```python
# backend/weixin/views.py

# ...

# 获取用户数据
class UserData(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        print('Get data: ', request.user.profile.items)
        return Response({'code': 'get ok', 'items': request.user.profile.items['items']})

    def post(self, request, format=None):
        user = request.user
        user.profile.items = request.data
        user.save()
        print('Post data: ', user.profile.items)
        return Response({'code': 'post ok'})
    
# ...
```

- get 请求中，将当前用户的清单数据 items 返回。
- post 请求中，将用户上传的数据更新到数据库。

欧了，下面整前端。

## 小程序前端

前端中要改的地方分为两种交互：下载和上传。

直接看修改好的代码：

```javascript
// frontend/pages/index/index.js

// ...

lifetimes: {
  attached() {
    this.login(() => {
      const access = wx.getStorageSync('access')
      // 从django后端获取数据
      wx.request({
        url: 'http://127.0.0.1:8000/api/weixin/data/',
        header: {
          'Authorization': 'Bearer ' + access
        },
        success: res => {
          this.setData({
            items: res.data.items.filter(v => v.checked === false)
          })
        }
      })
    })
  },
},

methods: {
  // ...
  // 将清单数据提交到django
  uploadData(items) {
    const access = wx.getStorageSync('access')
    wx.request({
      url: 'http://127.0.0.1:8000/api/weixin/data/',
      method: 'POST',
      header: {
        'Authorization': 'Bearer ' + access
      },
      data: {
        items: items
      }
    })
  },
  _inputSubmit() {
    // ...
    // 尾部添加下面的代码
    // 将items提交到django
    this.uploadData(items)
  },
  _checkboxChange(e) {
    // ...
    // 尾部添加下面的代码
    // 将items提交到django
    this.uploadData(items)
  }
}
```

- `attached()` 中下载数据，它和前面章节的本地版本的数据加载非常像，唯一不同的是数据是从 Django 拉取的。
- **提交新清单**和**更改勾选状态**都是上传数据，因此将上传逻辑放到单独的方法 `uploadData()` 里头，并且调用它。

这下是真搞定了，刷新模拟器：

![dwt-110-1](https://blog.dusaiphoto.com/img/dwt-110-1.jpg)

把你女朋友的手机抢过来，换个用户登录试试。顺利的话，不同的人会对应加载出不同的数据，并且数据是从 Django 服务器获取的，更换手机也没有影响。非常的安全（大概）。

## 接下来干什么？

目前我们的小程序和 Django 都是在单机上折腾的。接下来你可能会想把辛苦开发的成果部署到 Web 上，以便在小伙伴面前得瑟得瑟。

步骤有二：

- 将 Django 部署到云服务器。这方面文章我写过很多（老读者都看烦了），有需要的请参考 [将Django项目部署到云服务器](https://www.dusaiphoto.com/article/71/) 和 [将Django-Vue项目部署到云服务器](https://www.dusaiphoto.com/article/135/) 。部署成功后还需要将协议升级为 HTTPS ，这是小程序的硬性要求。
- 将小程序代码包部署到微信官方。测试号肯定是不行的，你得先申请小程序正式的账号，然后从开发工具中上传。

部署虽然麻烦，但是非常推荐你去折腾。这是磨练，也是必经之路。

走通全流程后，你要着眼于更有追求的小程序项目了，本教程里吹水的知识铁定不够用了。这时候你应该多读读[小程序官方指南](https://developers.weixin.qq.com/miniprogram/dev/framework/) 和 [Vue官方指南](https://cn.vuejs.org/index.html)，学习进阶知识。

> 特别提醒，微信对于小程序的管理非常严格，企业和个人能涉及的服务类目是非常不同的。比如你可能想要做个留言板或者评论的功能，很遗憾，个人账号是不允许的。详见[小程序开放的服务类目](https://developers.weixin.qq.com/miniprogram/product/material/)。

## 总结

虽然后续要学的还有很多，但教程就到此为止了。

如果对你有帮助，欢迎你来我的[GitHub](https://github.com/stacklens)给个小星星；或者到[博客](https://www.dusaiphoto.com/article/167/)请我喝杯咖啡，看看别的优质（划掉）教程。

江湖再见，后会有期！

> 点赞 or 吐槽？来评论区！
