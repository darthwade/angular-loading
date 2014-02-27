'use strict';

// Watches files for changes and runs tasks based on the changed files
module.exports = {
  js: {
    files: [
      'Gruntfile.js',
      'tasks/**/*.js',
      'angular-block-spinner.js'
    ],
    tasks: ['newer:jshint:src']
  },
  tests: {
    files: ['tests/**/*.js'],
    tasks: ['newer:jshint:tests', 'karma:local', 'protractor:local']
  }
};