'use strict';

module.exports = function(grunt) {
  grunt.registerTask('build', [
    'jshint:src',
    'uglify'
  ]);
};