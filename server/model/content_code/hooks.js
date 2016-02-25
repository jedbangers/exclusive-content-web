'use strict';

module.exports = function(schema) {

  // Ensure that any given code get discarded before proceeding
  // to avoid having non-autogenerated codes.
  schema.pre('save', function(next) {
    this.code = undefined;
    next();
  });

};