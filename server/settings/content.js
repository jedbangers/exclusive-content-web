'use strict';

module.exports = {
  paths: [ '_id', 'title', 'description', 'imageUrl', 'url' ],
  sort: {
    title: 'asc'
  },
  values: {
    title       : { maxLength: 50 },
    description : { maxLength: 1024 }
  },
  errors: {
    title: {
      required: 'Content "title" cannot be empty',
      maxLength: 'Content "title" is too long (max. 50 characters)'
    },
    description: {
      maxLength: 'Content "description" is too long (max. 1024 characters)'
    },
    imageUrl: {
      invalid: 'Content "imageUrl" is not a valid URL'
    },
    url: {
      invalid: 'Content "url" is not a valid URL'
    }
  }
};
