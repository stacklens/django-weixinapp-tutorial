// app.js
App({
  onLaunch() {
    this.initcloud()
    this.globalData = {
      // 用于存储待办记录的集合名称
      collection: 'todo',
    }
  },
  // 初始化云开发环境
  initcloud() {
    wx.cloud.init({
      traceUser: true,
      env: "test-8gtd9aw9fdc83f55"
    })
    // 装载云函数操作对象返回方法
    this.cloud = () => {
      return wx.cloud // 直接返回 wx.cloud
    }
  },
  // 获取云数据库实例
  async database() {
    return (await this.cloud()).database()
  },
})