# 基于<Django/微信小程序>的Todo-List入门教程

本教程是一个用**微信小程序**和 **Django** ，开发待办清单（Todo-List）的入门教程。

版本基于 Django 4.0 和 小程序基础库 2.21.2。

> 于 Win 10 系统开发。用 Mac 或 Linux 也 OK。

## 什么是微信小程序

相信只要你是个中国人，就不需要我介绍了，足以见得**微信小程序**强大的知名度。由于微信在国内恐怖的垄断地位（以及强社交属性），小程序出生就具有巨大的流量池。同样因为小程序的底层由微信维护，因此天然就具有了跨平台的基因。

学习开发小程序，在当下绝对是个非常明智的决定。

## 什么是Django

**Django** 是一个由 **Python** 写成的开源 Web 后端框架，你可以用它以更高的效率、更少的代码，搭建高性能的网站。换句话说，如果你的目的是以最小的学习成本、最快的速度开发一个功能齐全的 Web 服务后端，那么 Django 是个绝佳的选择。

## 本教程特点

- 全中文、全免费
- 代码全开源

你可以根据自己的喜好，选择以下阅读途径：

- [Github版](https://github.com/stacklens/django-weixinapp-tutorial/tree/master/md)
- [博客版](https://www.dusaiphoto.com/article/167/)
- [微信公众号版](https://github.com/stacklens/django-weixinapp-tutorial/blob/master/resources/QRwexin.jpg)

内容是相同的。

## 开发环境

教程用到的环境如下：

- 后端：**Django 4.0** 、 **Python 3.10**
- 前端：**小程序基础库 2.21.2**、**开发工具1.05**
- 系统：**Win 10**

读者学习时保持对应工具的**大版本号**相同就没太大问题。

## 面向人群

请回答以下问题：

- 什么是前后端分离开发模式？
- MVVM 与 MVC 的区别是什么？
- 是否看过一些前端框架 Vue 或者 React 的入门知识？
- Django 中的视图和模型分别起什么作用？
- 什么是 Json Web Token ？

上面5个问题如果你一个都答不上来，那么阅读本教程可能会比较痛苦。人嘛，总是在痛苦中成长起来的。

总之，**本教程是完全面向新手的**，但最好有一点点的基础：

- 一点点 Django 开发基础知识
- 一点点 Javascript 语法基础知识
- 最好对前后端分离基础开发有一点了解

## 资源列表

本教程的代码托管在 Github：[django-weixinapp-tutorial](https://github.com/stacklens/django-weixinapp-tutorial)

代码包含两个分支，默认的 master 分支为<Django+小程序>Web版，local 分支为<小程序>本地版。

读者可将代码克隆到本地作为学习过程的参照，也感谢你顺手给一个 Star。

在起步阶段，微信小程序和 Vue 非常的相似。鉴于 Vue 的文档写得通俗易懂，因此非常推荐通过 [Vue官方文档](https://cn.vuejs.org/index.html) 来学习小程序开发。（曲线救国）

笔者写过几个广受好评（划掉）的 Django 教程，比如 [Django搭建博客](https://www.dusaiphoto.com/article/2/) 和 [Django-Vue搭建博客](https://www.dusaiphoto.com/article/103/)，可供读者朋友参考。

除此之外，可能会经常查阅的资料还有：

- [Django 文档](https://www.djangoproject.com/)
- [DRF 文档](https://www.django-rest-framework.org/)
- [小程序文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)

## 加入社区

一个人的学习是孤单的。欢迎扫码 Django 交流QQ群、公众号、TG群组，和大家一起进步吧。

![img](https://blog.dusaiphoto.com/QR-0608.jpg)

## 开始你的表演

说了这么多，相信你已经迫不及待了。让我们赶紧开始旅程！

> 以下是许可协议，读者请直接前往下一章吧。

## 许可协议

本教程（包括且不限于文章、代码、图片等内容）遵守 **署名-非商业性使用 4.0 国际 (CC BY-NC 4.0) 协议**。协议内容如下。

**您可以自由地：**

- **共享** — 在任何媒介以任何形式复制、发行本作品。
- **演绎** — 修改、转换或以本作品为基础进行创作。

只要你遵守许可协议条款，许可人就无法收回你的这些权利。

**惟须遵守下列条件：**

- **署名** — 您必须给出**适当的署名**，提供指向本许可协议的链接，同时标明是否（对原始作品）作了修改。您可以用任何合理的方式来署名，但是不得以任何方式暗示许可人为您或您的使用背书。
- **非商业性使用** — 您不得将本作品用于**商业目的**。
- **没有附加限制** — 您不得适用法律术语或者技术措施从而限制其他人做许可协议允许的事情。

> 适当的署名：您必须提供创作者和署名者的姓名或名称、版权标识、许可协议标识、免责标识和作品链接。
>
> 商业目的：主要目的为获得商业优势或金钱回报。

