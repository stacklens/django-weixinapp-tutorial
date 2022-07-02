// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
// 获取云数据库对象
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const openID = cloud.getWXContext().OPENID
  try {
    return await db.collection('todo').where({
      id: event.id,
      _openid: openID
    })
    .update({
      data: {
        checked: event.checked
      },
    })
  } catch(e) {
    console.error(e)
  }
}