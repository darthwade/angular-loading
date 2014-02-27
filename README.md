# Angular Loading

Angular directive that lets you to prevent user interaction with part of the page and display loading/busy indicator (spinner based on spin.js)

**Demo:** http://embed.plnkr.co/XLL3li/preview

## 1. Getting Started

Install with bower `bower install angular-loading --save` or clone the repo `git clone git://github.com/darthwade/angular-loading.git` or [download the latest release](https://github.com/darthwade/angular-loading/zipball/master).

Add `angular-loading.min.js` and `angular-loading.css` to your HTML. Also add [spin.js](https://github.com/fgnass/spin.js) library.
``` html
<script src="//ajax.googleapis.com/ajax/libs/angularjs/1.2.13/angular.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/spin.js/1.2.7/spin.min.js"></script>
<script src="//rawgithub.com/darthwade/angular-loading/master/angular-loading.min.js"></script>

<link rel="stylesheet" type="text/css" href="//rawgithub.com/darthwade/angular-loading/master/angular-loading.css"/>
```

Add `darthwade.dwLoading` as a module dependency for your module.
``` javascript
angular.module('myApp', ['darthwade.dwLoading']);
```

## 2. Usage
Add `dw-loading` directive to that block which you want to lock during loading.
``` html
<div dw-loading="key" dw-loading-options="options"></div>
```
## 3. Sample
``` html
<div dw-loading="users" dw-loading-options="{text: 'Loading users...'}" class="users-list">
  <p ng-repeat="user in users">{{user.name}}</p>
</div>
```
``` javascript
function SampleCtrl($scope, $loading) {
  $scope.loadUsers = function() {
    // Lock UI and show spinner
    $loading.start('users');
  
    $http({method: 'GET', url: '/someUrl'})
        .success(function(data, status, headers, config) {
          $scope.users = data;
          
          // Unlock UI and hide spinner
          $loading.finish('users');
        });
  };
  
  $scope.loadUsers();
}
```

## 4. Options
``` javascript
{
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
}
```

## 5. API
This module provide service `dwLoading` (`$loading` just a shortcut).

`dwLoading.setDefaultOptions(options)` - Overrides default options.

`dwLoading.start(key)` - Activates loading state by key.

`dwLoading.finish(key)` - Deactivates loading state by key.

## 6. Events
`$dwLoadingStart` - Fired once the loading is started. The '$rootScope' emits the event.
``` javascript
$scope.$on('$dwLoadingStart', function(event, key){ ... });
```

`$dwLoadingFinish` - Fired once the loading is finished. The '$rootScope' emits the event.
``` javascript
$scope.$on('$dwLoadingFinish', function(event, key){ ... });
```

## 7. Styling
``` html
<div dw-loading="key" dw-loading-options="{className: 'custom-loading', spinnerOptions: {className: 'custom-spinner'}}" class="my-block">
  <p>Content</p>
</div>
```
Will generate:
``` html
<div dw-loading="key" dw-loading-options="{active: true, text: 'Please Wait...', className: 'custom-loading', spinnerOptions: {className: 'custom-spinner'}}" class="my-block">
  <p>Content</p>
  <div class="dw-loading dw-loading-overlay dw-loading-active custom-loading">
    <div class="dw-loading-body">
      <div class="dw-loading-spinner">
        <div class="custom-spinner"></div>
      </div>
      <div class="dw-loading-text">Please Wait...</div>
    </div>
  </div>
</div>
```
