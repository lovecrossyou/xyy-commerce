'use strict';


const Service = require('egg').Service;

/**
 * 个推 推送服务
 */
class PushService extends Service {

  constructor(ctx) {
    super(ctx);
    this.PushMessageModel = ctx.model.PushMessageModel;
    this.CategoryModel = ctx.model.CategoryModel;
    this.ResponseCode = ctx.response.ResponseCode;
    this.ServerResponse = ctx.response.ServerResponse;
  }

  // 1. 对单个用户推送消息
  async pushMessage(clientId) {
    const { id: userId } = this.session.currentUser;
    const message = {
      title: '推送标题',
      text: '推送正文',
      url: 'http://www.baidu.com',
      uidList: [ clientId ],
    };
    this.app.getui.pushMessage(message, 'transmission', 'pushMessageToApp');
  }

  // 2. 对指定列表用户推送消息
  // 3. 对指定应用群推消息
  // 4. Wi-Fi推送
  // 5. 定速推送
  // 6. 任务组名推送
}

module.exports = PushService;
