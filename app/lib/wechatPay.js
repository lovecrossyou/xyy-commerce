/*
* @Descrition : wechat 微信支付功能
*/

const url = require('url');
const queryString = require('querystring');
const crypto = require('crypto');
const request = require('request');
const xml2jsparseString = require('xml2js').parseString;

// wechat 支付类 (使用 es6 的语法)
class WechatPay {
  /*
      构造函数
     */
  constructor(config) {
    this.config = config;
  }


  // 获取微信的 AccessToken   openid

  getAccessToken(code) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line no-useless-concat
      const getAccessTokenUrl = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + this.config.appid + '&secret=' + this.config.wxappsecret + '&js_code=' + code + '&scope=snsapi_userinfo' + '&grant_type=authorization_code';
      request.post({ url: getAccessTokenUrl }, function(error, response, body) {
        if (!error && response.statusCode === 200) {
          if (body.errcode === 40029) {
            reject(body);
          } else {
            body = JSON.parse(body);
            resolve(body);
          }
        } else {
          reject(body);
        }
      });
    });
  }
}

module.exports = WechatPay;
