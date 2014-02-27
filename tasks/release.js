'use strict';

module.exports = function(grunt) {
  grunt.registerTask('release', function (target) {
    target = target || 'patch';

    grunt.task.run([
      'bump-only:' + target,
      'build',
      'bump-commit'
    ]);
  });
};