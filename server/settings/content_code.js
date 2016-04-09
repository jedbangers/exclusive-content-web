'use strict';

module.exports = {
  paths: [ '_id', 'code', 'name', 'content' ],
  sort: {
    name: 'asc'
  },
  values: {
    name: { maxLength: 50 }
  },
  errors: {
    name: {
      required: 'ContentCode "name" cannot be empty',
      maxLength: 'ContentCode "name" is too long (max. 50 characters)'
    },
    active: {
      required: 'ContentCode "active" cannot be empty'
    },
    code: {
      required: 'ContentCode "code" cannot be empty'
    }
  }
};
