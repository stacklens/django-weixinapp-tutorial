Component({
  // 页面持有的数据
  data: {
    // todo-list数据
    items: [],
    // 输入框当前内容
    inputedValue: "",
  },

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
    login(callback = (() => {})) {
      if (!this.isTokenAvailable()) {
        console.log('Get Token from dj.')
        this.getToken(callback)
      } else {
        console.log('Get Token from storage.')
        callback()
      }
    },
    getToken(callback) {
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
    isTokenAvailable() {
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
    keyInput(e) {
      this.setData({
        inputedValue: e.detail.value
      })
    },
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
    // 先登录再提交
    inputSubmit() {
      this.login(() => {
        this._inputSubmit()
      })
    },
    // 监听提交按钮
    _inputSubmit() {
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
    checkboxChange(e) {
      this.login(() => {
        this._checkboxChange(e)
      })
    },
    // 监听多选框的状态改变事件
    _checkboxChange(e) {
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