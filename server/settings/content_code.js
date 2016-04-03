'use strict';

module.exports = {
  paths: [ '_id', 'code', 'name', 'imageUrl', 'description', 'content' ],
  sort: {
    name: 'asc'
  },
  values: {
    description: {
      maxLength: 255
    }
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
    description: {
      maxLength: 'ContentCode "description" is too long (max. 255 characters)'
    },
    imageUrl: {
      invalid: 'ContentCode "imageUrl" is not a valid URL'
    },
    content: {
      url: {
        required: 'ContentCode "content.url" cannot be empty',
        invalid: 'ContentCode "content.url" is not a valid URL'
      }
    }
  }
};
