Component({
  // 页面持有的数据
  data: {
    // todo-list数据
    items: [],
    // 输入框当前内容
    inputedValue: "",
  },

  lifetimes: {
    // 生命周期函数
    // 在组件实例进入页面节点树时执行
    attached() {
      // 从缓存中读取items
      wx.getStorage({
        key: 'items',
        success: res => {
          this.setData({
            items: res.data.filter(v => v.checked === false)
          })
        },
      })


      wx.request({
        url: 'http://127.0.0.1:8000/api/weixin/login/',
        success(res) {
          console.log(res.data)
        }
      })
    },
  },

  methods: {
    // 监听键盘输入事件
    // 并更新数据
    keyInput(e) {
      this.setData({
        inputedValue: e.detail.value
      })
    },
    // 监听提交按钮
    inputSubmit() {
      let items = this.data.items

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

      // 将items本地存储
      wx.setStorage({
        key: "items",
        data: items,
      })
    },
    // 监听多选框的状态改变事件
    checkboxChange(e) {
      // 页面持有的数据
      // 注意获取本地数据的写法为 this.data.xxx
      const items = this.data.items
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
        items
      })

      // 将items本地存储
      wx.setStorage({
        key: "items",
        data: items,
      })
    }
  },
})