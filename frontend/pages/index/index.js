Component({
  data: {
    items: [{
        id: 3,
        content: '和丢丢去超市买白菜'
      },
      {
        id: 2,
        content: '周二和老王吃烧烤'
      },
      {
        id: 1,
        content: '凌晨给老板汇报工作'
      }
    ]
  },

  methods: {
    checkboxChange(e) {
      // 页面持有的数据
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
  
      // 打印的内容会展现在调试器中
      console.log(this.data.items)
    }
  },
})