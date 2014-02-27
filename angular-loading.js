(function (window, angular, undefined) {
  'use strict';

  angular.module('darthwade.dwLoading', [])

    .value('dwLoadingOptions', {
      active: false,
      text: 'Loading...',
      className: '',
      overlay: true,
      spinner: true,
      spinnerOptions: {
        lines: 12,            // The number of lines to draw
        length: 7,            // The length of each line
        width: 4,             // The line thickness
        radius: 10,           // The radius of the inner circle
        rotate: 0,            // Rotation offset
        corners: 1,           // Roundness (0..1)
        color: '#000',        // #rgb or #rrggbb
        direction: 1,         // 1: clockwise, -1: counterclockwise
        speed: 2,             // Rounds per second
        trail: 100,           // Afterglow percentage
        opacity: 1/4,         // Opacity of the lines
        fps: 20,              // Frames per second when using setTimeout()
        zIndex: 2e9,          // Use a high z-index by default
        className: 'dw-spinner', // CSS class to assign to the element
        top: 'auto',          // center vertically
        left: 'auto',         // center horizontally
        position: 'relative'  // element position
      }
    })

    .service('dwLoading', ['$rootScope', 'dwLoadingOptions', function ($rootScope, dwLoadingOptions) {
      var self = this;

      /**
       * Sets default options (@see `dwLoadingOptions`)
       * @param {object} options
       */
      self.setDefaultOptions = function (options) {
        extend(true, dwLoadingOptions, options);
      };

      /**
       * Activates spinner by key
       * @param {string} key
       */
      self.start = function (key) {
        $rootScope.$broadcast('$dwLoadingStart', key);
      };

      /**
       * Deactivates spinner by key
       * @param {string} key
       */
      self.finish = function (key) {
        $rootScope.$broadcast('$dwLoadingFinish', key);
      };
    }])

    // Shortcut
    .factory('$loading', ['dwLoading', function(dwLoading) {
      return dwLoading;
    }])

    .directive('dwLoading', ['$window', '$compile', 'dwLoadingOptions', function ($window, $compile, dwLoadingOptions) {
      return {
        scope: true,
        link: function (scope, element, attrs) {
          scope.spinner = null;
          scope.key = attrs.dwLoading || false;

          /**
           * Starts spinner
           */
          scope.start = function () {
            if (scope.container) {
              scope.container.addClass('dw-loading-active');
            }
            if (scope.spinner) {
              scope.spinner.spin(scope.spinnerContainer[0]);
            }
          };

          /**
           * Stops spinner
           */
          scope.finish = function () {
            if (scope.container) {
              scope.container.removeClass('dw-loading-active');
            }
            if (scope.spinner) {
              scope.spinner.stop();
            }
          };
          
          scope.$watch(attrs.dwLoadingOptions, function (options) {
            scope.finish();

            scope.options = extend(true, {}, dwLoadingOptions, options);

            // Build template
            var body = angular.element('<div></div>')
              .addClass('dw-loading-body');
            scope.container = angular.element('<div></div>')
              .addClass('dw-loading')
              .append(body);

            if (scope.options.overlay) {
              scope.container.addClass('dw-loading-overlay');
            }
            if (scope.options.className) {
              scope.container.addClass(scope.options.className);
            }
            if (scope.options.spinner) {
              scope.spinnerContainer = angular.element('<div></div>')
                .addClass('dw-loading-spinner');
              body.append(scope.spinnerContainer);
              scope.spinner = new $window.Spinner(scope.options.spinnerOptions);
            }
            if (scope.options.text) {
              var text = angular.element('<div></div>')
                .addClass('dw-loading-text')
                .text(scope.options.text);
              body.append(text);
            }

            element.append(scope.container);
//            $compile(container)(scope);

            if (scope.options.active || !scope.key) {
              scope.start();
            }
          }, true);

          scope.$on('$dwLoadingStart', function (event, key) {
            if (key === scope.key) {
              scope.start();
            }
          });

          scope.$on('$dwLoadingFinish', function (event, key) {
            if (key === scope.key) {
              scope.finish();
            }
          });

          scope.$on('$destroy', function () {
            scope.finish();
            scope.spinner = null;
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

})(window, window.angular);