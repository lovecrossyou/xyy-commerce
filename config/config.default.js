'use strict';

module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_Yid';

  // add your config here
  config.middleware = [];

  config.sequelize = {
    dialect: 'mysql', // support: mysql, mariadb, postgres, mssql
    database: 'egg_commerce',
    host: 'localhost',
    port: '3306',
    username: 'root',
    password: '123456',
    timezone: '+08:00', // 东八时区
  };

  // config.redis = {
  //   client: {
  //     port: 6379, // Redis port
  //     host: '127.0.0.1', // Redis host
  //     password: '',
  //     db: 0,
  //   },
  //   agent: true,
  // };

  config.sessionRedis = {
    key: 'EGG_SESSION',
    maxAge: 24 * 3600 * 1000,
    httpOnly: true,
    encrypt: false,
  };

  config.security = {
    csrf: {
      enable: false,
      ignoreJSON: true,
    },
  };
  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  };


  config.qiniu = {
    // I ussually set the key into `~/.zshrc`, and I can get the value via `process.env.key`, It's very safe~
    ak: 'N6ir9cSEURlLH6tXwRs54NDcolso8zrF_ahvu81_',
    sk: '93NGXLoycjGYUhWANcAK87zPqnfH_qxCBeC5z5KA',
    bucket: 'yylift',
    baseUrl: 'http://static.kuaimayoupin.com/',
    zone: 'Zone_z1',
    app: true, // default value
    agent: false, // default value
  };

  // config.oss = {
  //   client: {
  //     accessKeyId: 'LTAItynAEvcPJHkE',
  //     accessKeySecret: '5cZb18s6ZeBxY6K9duVavWL6Aup7T5',
  //     bucket: 'egg-commerce',
  //     endpoint: 'oss-cn-hangzhou.aliyuncs.com',
  //     timeout: '60s',
  //   },
  // };
  exports.alinode = {
    appid: '78462',
    secret: '73fc4ebc7bdad892daa164de42bf24a547670df6',
  };

  config.multipart = {
    mode: 'file',
  };

  // 个推推送
  config.geTui = {
    HOST: 'http://sdk.open.api.igexin.com/apiex.htm',
    APPID: '',
    APPKEY: '',
    MASTERSECRET: '',
  };

  return config;
};
