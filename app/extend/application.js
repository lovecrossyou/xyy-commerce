'use strict';

const GeTui = require('getui2');

module.exports = {
  get geTui() {
    return GeTui.GeTuiDecorator(this.config.geTui);
  },
};
