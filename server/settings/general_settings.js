'use strict';

module.exports = {
  paths  : [ 'redeemCodeHint' ],
  values: {
    redeemCodeHint: {
      maxLength: 512
    }
  },
  errors : {
    redeemCodeHint: {
      maxLength: 'Redeem code hint is too long (max. 512 characters)'
    }
  }
};
