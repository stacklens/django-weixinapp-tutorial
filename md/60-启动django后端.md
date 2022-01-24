经过前几章折腾，我们已经完成一个还不错的待办清单微信小程序了。但是它是完全本地的版本，如果用户换了手机、或者不小心删除了小程序，那里面的数据自然也没有了。

本着“学习就是瞎折腾”的精神，我们接着开发 Web 版本的 Todo-List ，将数据存到云服务器，那就“万无一失”了。

教程将采用 Django 作为后端框架。

> 如果你是我的老读者，那么启动 Django 服务的步骤肯定听我唠叨好多遍了，哈哈。

## 安装Python

python的安装比较简单，首先找到[Python官方网站](https://www.python.org/)，选择 python 3.10.0 的 windows 版本，下载并安装。

**安装时注意勾选添加python到环境变量中。**如果没找到或者漏掉这一步，请安装完毕后自行添加。

安装完成后打开[命令行](https://jingyan.baidu.com/article/046a7b3e83a505f9c27fa9a2.html)，输入`python -V`，系统打印出python的版本号，说明安装成功了：

```bash
C:\Users\dusai> python -V
Python 3.10.0
```

## 配置虚拟环境

**虚拟环境**是 Python 多版本管理的利器，可以使每个项目环境与其他项目独立开来，保持环境的干净，解决包冲突问题。你可以将虚拟环境理解为一个隔绝的小系统。为方便管理，我们将 Django 项目放到和微信小程序同一个目录下，也就是 `D:\Developer\Py\django_weixinapp_tutorial\`。

> 请自行对应到你保存的目录，也就是小程序项目 `frontend/` 目录同一级。

进入此目录：

```bash
D:\> cd D:\Developer\Py\django_weixinapp_tutorial
D:\Developer\Py\django_weixinapp_tutorial>
```

> 为方便阅读，此根目录路径在后续的命令行中省略。

输入配置 venv 的命令，其中的`venv`为虚拟环境的目录：

```bash
> python -m venv venv  
```

创建完成后，输入`venv\Scripts\activate.bat`，即可进入虚拟环境：

```bash
> venv\Scripts\activate.bat
(venv) >
```

**盘符前有`(venv)`标识说明进入venv成功。**

> 若上述方法不成功，则可以通过 `virtualenv` 库创建虚拟环境。

## 安装Django

**在虚拟环境下**，输入命令 `pip install django==4.0.1`：

```bash
(venv) > pip install django==4.0.1

Collecting django==4.0.1
Successfully installed django-4.0.1
```

系统打印出以上文字表示 Django 安装成功了。（提示符以 `(venv)` 开头）

> 由于国内复杂的网络环境， Pip 的下载可能非常缓慢甚至失败。国内用户请更换国内的镜像下载源。

## 创建Django项目

还是在**虚拟环境**下，创建一个叫 `backend` 的Django项目：

```bash
(venv) > django-admin startproject backend
```

好了。当前的目录结构应该是这样：

```python
django_weixinapp_tutorial/
  -- frontend/  # 微信小程序前端项目
  -- backend/   # django后端项目
```

`backend` 目录里就是我们刚创建出来的项目了。

## 运行Django服务器

Django 自带一个轻量的 Web 开发服务器，被叫做 runserver。

开发服务器是为了让你快速开发Web程序，通过它可以避开配置生产环境的服务器的繁琐环节。

开发服务器会自动的检测代码的改变，并且自动加载它，因此在修改代码后不需要手动去重启服务器。

要运行这个服务器，首先要进入`backend`文件夹，即含有`manage.py`文件的那个：

```
(venv) > cd backend
(venv) backend>
```

输入命令`python manage.py runserver`：

```
(venv) backend> python manage.py runserver
...
Django version 4.0.1, using settings 'backend.settings'
Starting development server at http://127.0.0.1:8000/
Quit the server with CTRL-BREAK.
```

系统打印出这些信息，说明服务器启动成功了。

打开 Chrome 浏览器，输入http://127.0.0.1:8000/ ，网页中看到一个绿色的小火箭，恭喜你，项目已经正常运行了。

![dwt-60-1](https://blog.dusaiphoto.com/img/dwt-60-1.jpg)

## 代码编辑器

django 运行起来后，我们还需要一款**代码编辑器**或者**集成开发环境（IDE）**来编辑 Python 文件。

新手推荐 [Pycharm](https://www.jetbrains.com/pycharm/)，虽然第一次用时需要熟悉软件的使用方法，但是它提供的各项强大的功能，比如代码提示、拼写提示等，可以帮助你避免很多基本的错误（比如打错字）。

> Pycharm 专业版是收费的。

如果你想要一个文本编辑器，那么可以用 **Sublime Text 3** 或者 **VS Code**。它两是免费的，所以你不需要掏腰包。

## 浏览器

推荐 [Chrome](https://www.google.com/chrome/)。火狐或者 Edge 也可以。

## 安装DRF库

小程序和 Django 之间的通讯需要用到 JSON 这种文件格式，这又涉及到两个重要的概念：**前后端分离**和**序列化**。Django 有一个非常优秀的库 django-restframework（即 **DRF**）。它可以帮我们封装好序列化的底层实现，让开发者专注于业务本身。

将命令行回到 `backend/` 目录（按 ctrl + c 即可退出 runserver），安装 DRF 及其依赖：

```bash
pip install djangorestframework
pip install markdown
pip install django-filter
```

然后修改 `backend/settings.py` 文件，将 DRF 库注册到 django 中：

```python
# backend/settings.py

INSTALLED_APPS = [
    ...

    'rest_framework',
]
```

接着还需要在 `backend/urls.py` 文件中添加 DRF 的登录视图，以便 DRF 自动为你的可视化接口页面生成一个用户登录的入口：

```python
# backend/urls.py

...
from django.urls import include

urlpatterns = [
    ...
    path('api-auth/', include('rest_framework.urls')),
]

```

最后记得数据迁移：

```bash
(venv) > python manage.py makemigrations
(venv) > python manage.py migrate
```

这个时候再次在浏览器中进入 `http://127.0.0.1:8000/` 地址，会看到一个 404 报错页面。这是正常的，因为我们还没写页面代码。

![dwt-60-2](https://blog.dusaiphoto.com/img/dwt-60-2.jpg)

## 总结

经过以上一番折腾，总算是把准备工作做完了。

准备好迎接正式的挑战吧。

> 点赞 or 吐槽？来[博客](https://www.dusaiphoto.com/)或[GitHub](https://github.com/stacklens)评论区！