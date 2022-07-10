const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
// 引入nodemailer
const nodemailer = require('nodemailer')
// 创建一个SMTP客户端配置
const config = {
  host: 'smtp.qq.com', // 邮箱smtp服务，不同厂家地址不一样
  port: 465, // 邮箱端口，不同厂家可能不一样
  auth: {
    user: '填你的邮箱', // 邮箱账号
    pass: '填你的授权码' // 邮箱授权码
  }
};
// 创建一个SMTP客户端对象
var transporter = nodemailer.createTransport(config);

// 云函数入口函数
exports.main = async (event, context) => {
  // 创建一个邮件对象
  var mail = {
    // 发件人
    // 填你的邮箱
    from: '来自杜赛 <xxx@xxx.com>',
    // 主题
    subject: 'Weapp [待办清单] 用户反馈',
    // 收件人
    to: '填收件人邮箱',
    // 邮件内容，text或者html格式
    text: event.content
  };

  let res = await transporter.sendMail(mail);
  return res;
}