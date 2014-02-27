'use strict';

// Make sure code styles are up to par and there are no obvious mistakes
module.exports = {
  options: {
    jshintrc: '.jshintrc',
    reporter: require('jshint-stylish')
  },
  src: [
    'Gruntfile.js',
    'tasks/**/*.js',
    'angular-block-spinner.js'
  ],
  ci: {
    options: {
      reporter: 'checkstyle',
      reporterOutput: '<%= settings.outputPath %>/jshint.xml'
    },
    src: [
      'Gruntfile.js',
      'tasks/**/*.js',
      '<%= settings.appPath %>/*.js',
      '<%= settings.appPath %>/<%= settings.packagesPath %>/**/*.js'
    ]
  },
  tests: {
    options: {
      jshintrc: '<%= settings.testsPath %>/.jshintrc'
    },
    src: ['<%= settings.testsPath %>/**/*.js']
  }
};