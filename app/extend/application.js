'use strict';

const GeTui = require('getui2');

module.exports = {
  get geTui() {
    const getui = GeTui.GeTuiDecorator(this.config.geTui);
    return {
      pushMessageToApp: getui.pushMessageToApp,
      pushMessageToSingle: getui.pushMessageToSingle,
    };
  },
};
