'use strict';
var path = require('path');

var absPath = function(dir) {
  return path.join(process.cwd(), dir);
};

module.exports = function (grunt) {
  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt, {
    pattern: ['grunt-*']
  });

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Load grunt configs automatically
  require('load-grunt-config')(grunt, {
    configPath: absPath('tasks/options'),
    init: true
  });

  grunt.loadTasks('tasks');
};
