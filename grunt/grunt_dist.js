'use strict';

var webpack          = require('webpack');
var ngAnnotatePlugin = require('ng-annotate-webpack-plugin');

module.exports = function(grunt){

  grunt.config('express.dist', {
    options: {
      script : '<%= paths.dist.server %>/bin/web.js',
      debug  : true
    }
  });

  grunt.config('webpack.dist', {
    output: {
      path: '<%= paths.dist.assets %>'
    },
    plugins: [
      // new webpack.optimize.UglifyJsPlugin(),
      // new webpack.optimize.OccurenceOrderPlugin(),
      // new webpack.optimize.DedupePlugin(),
      new ngAnnotatePlugin()
    ]
  });

  grunt.config('clean.dist', {
    files: [{
      dot: true,
      src: [ '.tmp', '<%= paths.dist.root %>' ]
    }]
  });

  grunt.config('copy.dist', {
    files: [{
      expand : true,
      dest   : '<%= paths.dist.root %>',
      src    : [
        'Procfile',
        'package.json',
        'server/**/*',
        '!<%= paths.server.src %>/config/ssl/**/*'
      ]
    }]
  });

  grunt.registerTask('build:dist', [
    'clean:dist',
    'copy:dist',
    'webpack:dist'
  ]);

  grunt.registerTask('serve:dist', [ 'env:prod', 'build:dist', 'express:dist', 'wait', 'express-keepalive' ]);

};
