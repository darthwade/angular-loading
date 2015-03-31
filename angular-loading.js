/**
 * Angular Loading
 * @homepage https://github.com/darthwade/angular-loading
 * @author Vadym Petrychenko https://github.com/darthwade
 * @license The MIT License (http://www.opensource.org/licenses/mit-license.php)
 * @copyright 2014 Vadym Petrychenko
 */
(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD
    define(['angular', 'spinjs'], factory);
  } else if (typeof exports === 'object') {
    // CommonJS
    factory(require('angular'), require('spinjs'));
  } else {
    // Browser globals
    factory(window.angular, window.Spinner)
  }
}(function (angular, Spinner) {
  'use strict';

  angular.module('darthwade.loading', [])

    .value('loadingOptions', {
      active: false, // Defines current loading state
      text: 'Loading...', // Display text
      className: '', // Custom class, added to directive
      overlay: true, // Display overlay
      spinner: true, // Display spinner
      spinnerOptions: {
        lines: 12, // The number of lines to draw
        length: 7, // The length of each line
        width: 4, // The line thickness
        radius: 10, // The radius of the inner circle
        rotate: 0, // Rotation offset
        corners: 1, // Roundness (0..1)
        color: '#000', // #rgb or #rrggbb
        direction: 1, // 1: clockwise, -1: counterclockwise
        speed: 2, // Rounds per second
        trail: 100, // Afterglow percentage
        opacity: 1 / 4, // Opacity of the lines
        fps: 20, // Frames per second when using setTimeout()
        zIndex: 2e9, // Use a high z-index by default
        className: 'dw-spinner', // CSS class to assign to the element
        top: 'auto', // Center vertically
        left: 'auto', // Center horizontally
        position: 'relative' // Element position
      }
    })

    .service('$loading', ['$timeout', '$rootScope', 'loadingOptions', function ($timeout, $rootScope, loadingOptions) {
      var self = this;

      /**
       * Overrides default options
       * @param {object} options
       */
      self.setDefaultOptions = function (options) {
        extend(true, loadingOptions, options);
      };

      /**
       * Activates loading state by key
       * @param {string} key
       */
      self.start = function (key) {
        $timeout(function() {
          $rootScope.$broadcast('$loadingStart', key);
        });
      };
      
      /**
       * Update loading state by key with loadingOptions object
       * @param {string} key
       * @param {object} options
       */
      self.update = function (key, options) {
        $timeout(function() {
          $rootScope.$broadcast('$loadingUpdate', key, options);
        });
      };

      /**
       * Deactivates loading state by key
       * @param {string} key
       */
      self.finish = function (key) {
        $timeout(function() {
          $rootScope.$broadcast('$loadingFinish', key);
        });
      };
    }])

    .directive('dwLoading', ['$rootScope', 'loadingOptions', function ($rootScope, loadingOptions) {
      return {
        link: function (scope, element, attrs) {
          var spinner = null,
            key = attrs.dwLoading || false,
            options,
            container,
            body,
            spinnerContainer,
            text;

          /**
           * Starts spinner
           */
          var start = function () {
            if (container) {
              container.addClass('dw-loading-active');
            }
            if (spinner) {
              spinner.spin(spinnerContainer[0]);
            }
          };
          
          /**
           * Update spinner, use force to update when loader is already started
           */
          var update = function (newOptions, force) {
                finish();
              
                options = extend(true, {}, loadingOptions, newOptions);

                // Build template
                body = angular.element('<div></div>')
                  .addClass('dw-loading-body');
                container = angular.element('<div></div>')
                  .addClass('dw-loading')
                  .append(body);

                if (options.overlay) {
                  container.addClass('dw-loading-overlay');
                }
                if (options.className) {
                  container.addClass(options.className);
                }
                if (options.spinner) {
                  spinnerContainer = angular.element('<div></div>')
                    .addClass('dw-loading-spinner');
                  body.append(spinnerContainer);
                  spinner = new Spinner(options.spinnerOptions);
                }
                if (options.text) {
                  text = angular.element('<div></div>')
                    .addClass('dw-loading-text')
                    .text(options.text);
                  body.append(text);
                }
                
                element.append(container);
                
                if ( options.active || !key || force) {
                    start();
                }
          };          

          /**
           * Stops spinner
           */
          var finish = function () {
            if (container) {
              container.removeClass('dw-loading-active');
            }
            if (spinner) {
              spinner.stop();
            }
          };

          scope.$watch(attrs.dwLoadingOptions, function (newOptions) {
            update(newOptions);
          }, true);

          $rootScope.$on('$loadingStart', function (event, loadKey) {
            if (loadKey === key) {
              start();
            }
          });
          
          $rootScope.$on('$loadingUpdate', function (event, loadKey, options) {
            if (loadKey === key) {
              update(options, true);
            }
          });

          $rootScope.$on('$loadingFinish', function (event, loadKey) {
            if (loadKey === key) {
              finish();
            }
          });

          scope.$on('$destroy', function () {
            finish();
            spinner = null;
          });
        }
      };
    }]);

  /**
   * Extends the destination object `dst` by copying all of the properties from the `src` object(s)
   * to `dst`. You can specify multiple `src` objects.
   *
   * @param   {Boolean} deep If true, the merge becomes recursive (optional)
   * @param   {Object}  dst  Destination object.
   * @param   {Object}  src  Source object(s).
   * @returns {Object}       Reference to `dst`.
   */
  function extend(dst) {
    var deep = false,
      i = 1;

    if (typeof dst === 'boolean') {
      deep = dst;
      dst = arguments[1] || {};
      i++;
    }

    angular.forEach([].slice.call(arguments, i), function (obj) {
      var array, clone, copy, key, src;

      for (key in obj) {
        src = dst[key];
        copy = obj[key];

        if (dst === copy) {
          continue;
        }

        if (deep && copy && (angular.isObject(copy) ||
          (array = angular.isArray(copy)))) {

          if (array) {
            clone = (src && angular.isArray(src)) ? src : [];
          } else {
            clone = (src && angular.isObject(src)) ? src : {};
          }

          dst[key] = extend(deep, clone, copy);
        }
        else if (copy !== undefined) {
          dst[key] = copy;
        }
      }
    });

    return dst;
  }

}));