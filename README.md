Angular Loading
===============

Angular directive that lets you to prevent user interaction with part of the page and display loading/busy indicator (spinner based on spin.js)

Demo: http://embed.plnkr.co/XLL3li/preview

## 1. Usage

1.1. Install the required libraries.
Install with bower `bower install angular-loading --save` or clone the repo, `git clone git://github.com/darthwade/angular-loading.git` or [download the latest release](https://github.com/darthwade/angular-loading/zipball/master).

1.2. Include them to HTML
``` html
<script src="//ajax.googleapis.com/ajax/libs/angularjs/1.2.13/angular.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/spin.js/1.2.7/spin.min.js"></script>
<script src="//rawgithub.com/darthwade/angular-loading/master/angular-loading.min.js"></script>

<link rel="stylesheet" type="text/css" href="//rawgithub.com/darthwade/angular-loading/master/angular-loading.css"/>
```

1.3 Inject the `darthwade.dwLoading` module into your app.
``` javascript
angular.module('myApp', ['darthwade.dwLoading']);
```



