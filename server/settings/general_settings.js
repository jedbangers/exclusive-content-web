'use strict';

module.exports = {
  paths  : [ 'redeemCodeHint' ],
  values: {
    redeemCodeHint: {
      maxLength: 1024
    }
  },
  errors : {
    redeemCodeHint: {
      maxLength: 'Redeem code hint is too long (max. 1024 characters)'
    }
  }
};
