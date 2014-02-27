(function(root, factory) {
  /* AMD module */
  if (typeof define == 'function' && define.amd) define(['angular', 'spinjs'], factory)

  /* Browser global */
  else factory(window.angular, window.Spinner)
}(this, function(angular, Spinner) {
  'use strict';

  angular.module('darthwade.dwLoading', [])

    .value('dwLoadingOptions', {
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

    .service('dwLoading', ['$timeout', '$rootScope', 'dwLoadingOptions', function ($timeout, $rootScope, dwLoadingOptions) {
      var self = this;

      /**
       * Overrides default options
       * @param {object} options
       */
      self.setDefaultOptions = function (options) {
        extend(true, dwLoadingOptions, options);
      };

      /**
       * Activates loading state by key
       * @param {string} key
       */
      self.start = function (key) {
        $timeout(function() {
          $rootScope.$broadcast('$dwLoadingStart', key);
        });
      };

      /**
       * Deactivates loading state by key
       * @param {string} key
       */
      self.finish = function (key) {
        $timeout(function() {
          $rootScope.$broadcast('$dwLoadingFinish', key);
        });
      };
    }])

    // Shortcut
    .factory('$loading', ['dwLoading', function (dwLoading) {
      return dwLoading;
    }])

    .directive('dwLoading', ['$rootScope', 'dwLoadingOptions', function ($rootScope, dwLoadingOptions) {
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
            finish();

            options = extend(true, {}, dwLoadingOptions, newOptions);

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
//            $compile(container)(scope);

            if (options.active || !key) {
              start();
            }
          }, true);

          $rootScope.$on('$dwLoadingStart', function (event, loadKey) {
            if (loadKey === key) {
              start();
            }
          });

          $rootScope.$on('$dwLoadingFinish', function (event, loadKey) {
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