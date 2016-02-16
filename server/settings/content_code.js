'use strict';

module.exports = {
  paths: [ '_id', 'name', 'code', 'content' ],
  sort: {
    name: 'asc'
  },
  errors: {
    name: {
      required: 'ContentCode "name" cannot be empty'
    },
    active: {
      required: 'ContentCode "active" cannot be empty'
    },
    code: {
      required: 'ContentCode "code" cannot be empty'
    },
    content: {
      url: {
        required: 'ContentCode "content.url" cannot be empty',
        invalid: 'ContentCode "content.url" is not a valid URL'
      }
    }
  }
};
