'use strict';

const Service = require('egg').Service;
const key = '38cf418a7730747b1301ef684115ffcb';
const serverUrl = 'https://restapi.amap.com/v3/place/text?key=' + key;
class MapServiceService extends Service {
  constructor(ctx) {
    super(ctx);
    this.session = ctx.session;
    this.TokenModel = ctx.model.TokenModel;
    this.ResponseCode = ctx.response.ResponseCode;
    this.ServerResponse = ctx.response.ServerResponse;
  }
  async search(keywords, city = '') {
    const { data } = await this.ctx.curl(encodeURI(`${serverUrl}&keywords=${keywords}&city=${city}`), {
      dataType: 'json',
    });
    if (data.info !== 'OK') return this.ServerResponse.createByErrorMsg('地理位置搜索失败');
    const { pois } = data;
    const poiResults = pois.map(poi => {
      const { name, address, location, pname, cityname } = poi;
      return {
        name,
        address,
        location,
        pname,
        cityname,
      };
    });
    return this.ServerResponse.createBySuccessMsgAndData('搜索成功', poiResults);
  }
}

module.exports = MapServiceService;
