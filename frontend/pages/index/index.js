Component({
  // 页面持有的数据
  data: {
    // todo-list数据
    items: [],
    // 输入框当前内容
    inputedValue: "",
  },

  lifetimes: {
    // -----
    // 以下lifetimes为云开发后端版本的
    // -----
    attached() {
      getApp().cloud().callFunction({
        name: 'getList',
        complete: res => {
          this.setData({
            items: res.result.data
          })
        }
      })
    },

    // -----
    // 以下lifetimes为Django后端版本的
    // 去除方法尾部的 '__' 即可还原
    // -----
    attached__() {
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
    // -----
    // 以下methods为云开发后端版本
    // -----

    // 更新待办的完成状态
    checkboxChange(e) {
      let items = JSON.parse(JSON.stringify(this.data.items))
      // 遍历items状态，找到checked状态变化的元素
      for (const [index, item] of items.entries()) {
        if (item.checked !== e.detail.value.includes(item.id)) {
          // setData动态修改数据元素的一种方式
          const key = `items[${index}].checked`
          const checked = !item.checked
          this.setData({
            // 注意这里要加括号[] 
            [key]: checked
          })
          // 调用云函数，更新数据库
          getApp().cloud().callFunction({
            name: 'updateCheck',
            data: {
              id: item.id,
              checked: checked
            }
          })
          break
        }
      }
    },
    // 生成一个uuid
    getUUID(randomLength = 12) {
      return Math.random().toString().substr(2, randomLength) + Date.now().toString(36)
    },
    // 监听输入框按键
    keyInput(e) {
      this.setData({
        inputedValue: e.detail.value
      })
    },
    // 点击提交按钮
    inputSubmit() {
      // 设置新条目的id
      const newID = this.getUUID()
      const newItem = {
        id: newID,
        content: this.data.inputedValue,
        checked: false,
        pushed: false
      }
      // 将新条目更新到items中
      // 并将输入框的值清空
      let items = JSON.parse(JSON.stringify(this.data.items))
      items.unshift(newItem);
      this.setData({
        items: items,
        inputedValue: "",
      })
      // 将items提交到云数据库
      this.uploadData(newItem)
      // 订阅服务
      this.subscribe()
      // 发送邮件服务
      getApp().cloud().callFunction({
        name: 'sendEmail',
        data: {
          content: newItem.content
        },
      })
    },

    // 向用户申请推送服务
    subscribe() {
      // 填你的模板id
      const templateId = 'FHKU0ktB..xxx.._VEerY'
      // 仅展示了主流程
      // 正式环境中，需考虑到用户可能会点击‘拒绝’、‘永久拒绝’等情况
      // 并弹出对应的反馈，如弹窗等
      wx.requestSubscribeMessage({
        tmplIds: [templateId],
        success(res) {
          console.log('订阅成功 ', res)
        },
        fail(err) {
          console.log('订阅失败 ', err)
        }
      })
    },
    async uploadData(item) {
      const db = await getApp().database()
      db.collection('todo').add({
        data: item
      })
    },

    // -----
    // 以下methods为Django后端版本的
    // 去除方法尾部的 '__' 即可还原
    // -----
    login__(callback = (() => {})) {
      if (!this.isTokenAvailable()) {
        console.log('Get Token from dj.')
        this.getToken(callback)
      } else {
        console.log('Get Token from storage.')
        callback()
      }
    },
    getToken__(callback) {
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
                console.log(res)
                const access = res.data.access
                // 将token保存到缓存
                wx.setStorage({
                  key: "access",
                  data: access
                })
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
                    'Authorization': 'Bearer ' + access
                  },
                  success: res => {
                    console.log(res)
                    // 调用回调函数
                    callback()
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
    // 返回布尔值，检查token是否过期
    isTokenAvailable__() {
      const now = Date.parse(new Date());
      try {
        const accessTime = wx.getStorageSync('access_time')
        if ((accessTime !== '') && (now - accessTime < 5 * 60 * 1000)) {
          return true
        }
      } catch {
        // do something...
      }
      return false
    },
    // 监听键盘输入事件
    // 并更新数据
    keyInput__(e) {
      this.setData({
        inputedValue: e.detail.value
      })
    },
    // 将清单数据提交到django
    uploadData__(items) {
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
    // 先登录再提交
    inputSubmit__() {
      this.login(() => {
        this._inputSubmit()
      })
    },
    // 监听提交按钮
    _inputSubmit__() {
      let items = JSON.parse(JSON.stringify(this.data.items))

      // 设置新条目的id
      let newID = 1;
      if (items[0] !== undefined) {
        newID = items[0].id + 1;
      }

      // 将新条目更新到items中
      // 并将输入框的值清空
      items.unshift({
        id: newID,
        content: this.data.inputedValue,
        checked: false,
      });
      this.setData({
        items: items,
        inputedValue: "",
      })

      // 将items提交到django
      this.uploadData(items)
    },
    checkboxChange__(e) {
      this.login(() => {
        this._checkboxChange(e)
      })
    },
    // 监听多选框的状态改变事件
    _checkboxChange__(e) {
      // 页面持有的数据
      // 注意获取本地数据的写法为 this.data.xxx
      const items = JSON.parse(JSON.stringify(this.data.items))
      // checkbox持有的数据
      const values = e.detail.value
      // 将items和values进行对比
      // 根据values的值更新页面数据(即data.items)
      for (let i = 0, lenI = items.length; i < lenI; ++i) {
        items[i].checked = false
        for (let j = 0, lenJ = values.length; j < lenJ; ++j) {
          // values[j]是String
          // 将其转换为Int
          if (items[i].id === parseInt(values[j])) {
            items[i].checked = true
            break
          }
        }
      }

      // 更新数据
      this.setData({
        items: items
      })

      // 将items提交到django
      this.uploadData(items)
    }
  },
})