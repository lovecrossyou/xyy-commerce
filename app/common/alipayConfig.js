module.exports = {

  /* 应用AppID */
  appid: 2019032663710242,

  /* 通知URL */
  notifyUrl: 'http://127.0.0.1:8004/order/alipaycallback',

  /* 应用RSA私钥 请勿忘记 -----BEGIN RSA PRIVATE KEY----- 与 -----END RSA PRIVATE KEY-----  */
  merchantPrivateKey: '-----BEGIN RSA PRIVATE KEY-----\nMIIEpAIBAAKCAQEAv0EJ9rpBCFFFeiXeOt3bg1ibOfvhk6ISlXZiZt7PYMD6+ueQvkN1WVH/SdSYufm+fxr6kYqxFUgBX4dl3/A2QpgFlXlkfY3ife1Up8s04uQjXfN+/AH9lz0T/aCG7zQByB7UjbtX9X2G+xSUSFLnd8KxfCi9HvhHSbsJW+qCxDdQoX2j8gVryGOygZGQasN/Mvb/CYE1p3w1gVGQzcOxUv6trGF9te0WlpJDlaKJG0IHVO5BDx2x3+m70Uh/XjD7pPLCMfAcAUZhnK/zTdS0foRZo81YQVg3ZezkMwaS33l2njrUMmItrJ7/jYYgfzkFFED8iLjYAxKQIJQJMW8/bQIDAQABAoIBAFa11R+gqDVuK3LK0mucBJcTSCVM1qQJmiVbbBe5swnp1KCG9m/cw8qAS58cnTXMThrwj2QHHmxInh7Ck2SpUuB0biurwuzNtD9lp7j/f3XS+1nwOMVm3aOBFJwr+KFg0eH6YGH161Yo2FbjqKr1s23vvmpNShlNdXyvKPocY7czlo3pEBlx4xnoOkTJW+JNaGqAvQqyedZJGxX0e/+VqKn2Qhfy1nmNkonGOA0p/WspUvQMSGyQh/qU6cU5xi5pU+Qy79LjBMFpPJ+QU6F7D1t0WByd/x+JUzCGW5ZtsQUJAhi29yyvv2X54jFvQq8bo8Qv4EKd691GHu5eKm4jTt0CgYEA/RE/aOlhc6jUuFEwCPmy17mR+2pu0eJiUaiERKNJjCubrJhksHDt0ZHKl4in/jmbxRivIFpk2MPhjl6xBtR+wO9/ancgbRley88mP4wwv3SwXwpGC9uHiMFhzg5nVLECAzMRBDE9aU1Cij/3ayiDqjbsGKOgueOZPNrxMR0bre8CgYEAwXhqSp+3yhUa0XHoMjnjIYaZ6QMdEZPhOseDidZAn8s3TfsFBrdNT3MJtGnN83DjfWwhhRtPbfruXswoCi1SgXK/tDZ5foiHPB+I1I7p3ejFnsPDE6iKVApttK72faXEzU8nKOnY55QwyJJOqpmtCH/ajRzcyREGgorfGrpwxGMCgYBq7V24i1vEzeJLmupL8I1zfxJCg98dSaU3UZfJlKDf3BEj5SQuNRkXQp2yV2h8D4VUyzA74FXaDTIBwNrVwvVnugpBRuJplp2qSfWkRizWyIw5LBMasYBb9THJKebZLw1loq8e8Vs8YguqdIqrOWwggKJTatffk15NC0l78gue+wKBgQCK8UmUkiPR01pRNHbHK199AkeiWgQUTZmhNwu2f9IlcDIlpLK1Ygr5lepQUPQBcv9NYcyo5TYkC+QI3KGcvXPVV21ppP2X68EDYrpHvOMj5TmXjYuZoJ7HQD4NVuHa1qQBtmivL1IA7iIiyUAJsRfdVMTGNwYwuDNuqQEVFvRJdQKBgQCuTtc8pj2xIvPPwdNrdqhNvLoHquCYym0OJ9U/BPjzWKeRWLsIvqpzPQShyM1sKdzyl1X+FseRKr15eUoiddBwMoNlAUiaEiN/fN9GVKf+o5Y/VMcBMsakECIiTJasZ+7RbVaP5qt8UXVH25sD0hqI3DHv2knzFzquynEYNbNeIg==\n-----END RSA PRIVATE KEY-----',

  /* 支付宝公钥 如果为空会使用默认值 请勿忘记 -----BEGIN PUBLIC KEY----- 与 -----END PUBLIC KEY----- */
  alipayPublicKey: '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAhUwQL2rfVHuM01ps0iitqkIKyvH+sxGc2lY8b6pcHhGZ+YOXBd2smmBA2JGfWLH/QDSOlIgFNdO8rsugUTwMmDuwy88CYJ54QmEEn8rpkS5wDrzqdJ/AbYwnhxPCmvPFUQNbGJkP4SRvaX0IB2OVQ8GLCaag8tfu4pO6qTzr/600IInwnwxSEjZTIrO9/j3BhS3w9lROguQYVBk45cBSpBgSB7Jo93C4O/2KrnhBYNwKKYeignL19bLrF1NOpVjcCIeCn9oDF0Qa5fbNeHSbcz6ec2AuTZr2z8rtvQoc7S1qgMAl7vNl54JaTO941a9VkxhCTOKk7/UpCFjVjKmbUQIDAQAB\n-----END PUBLIC KEY-----',

  /* 支付宝支付网关 如果为空会使用沙盒网关 https://openapi.alipaydev.com/gateway.do https://openapi.alipay.com/gateway.do */ 
  gatewayUrl: 'https://openapi.alipay.com/gateway.do',
  // gatewayUrl: 'https://openapi.alipaydev.com/gateway.do',

};
