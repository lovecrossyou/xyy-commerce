const moment = require('moment');

const Rad = d => {
  return d * Math.PI / 180.0;// 经纬度转换成三角函数中度分表形式。
};


exports.relativeTime = time => moment(new Date(time * 1000)).fromNow();

// 经纬度 距离计算
exports.getDistance = (lat1, lng1, lat2, lng2) => {
  const radLat1 = Rad(lat1);
  const radLat2 = Rad(lat2);
  const a = radLat1 - radLat2;
  const b = Rad(lng1) - Rad(lng2);
  let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
  Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
  s = s * 6378.137;// EARTH_RADIUS;
  s = Math.round(s * 10000) / 10000 / 2; // 输出为里
  s = s.toFixed(4);
  return s;
};

// 生成四位随机数字
const rand = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

exports.rand4 = () => rand(1000, 9999);

