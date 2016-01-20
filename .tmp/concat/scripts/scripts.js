'use strict';

/**
 * @ngdoc overview
 * @name dynoforceApp
 * @description
 * # dynoforceApp
 *
 * Main module of the application.
 */
angular
  .module('dynoforceApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(["$routeProvider", function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/splash.html',
        controller: 'SplashController',
        controllerAs: 'splash'
      })
      .when('/main', {
        templateUrl: 'views/main.html',
        controller: 'MainController',
        controllerAs: 'main'
      })
      .otherwise({
        redirectTo: '/'
      });
  }]);

'use strict';

/**
 * @ngdoc function
 * @name dynoforceApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the dynoforceApp
 */
angular.module('dynoforceApp')
  .controller('SplashController', function () {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });

'use strict';

/**
 * @ngdoc function
 * @name dynoforceApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the dynoforceApp
 */
angular.module('dynoforceApp')
  .controller('MainController', function () {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });

angular.module('dynoforceApp').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('views/main.html',
    "<p>This is the main view.</p> <div class=\"screen screen-main\"> <button class=\"big-button\" id=\"btn-host-game\">Start New Game</button> <button class=\"big-button\" id=\"btn-join-game\">Find a Game</button> </div> <div class=\"screen screen-game\"> Game Started! </div> <hr> <div id=\"hosts\"> </div>"
  );


  $templateCache.put('views/splash.html',
    "<div class=\"jumbotron\"> <h1>Dyno-Force!</h1> <a ng-href=\"#/main\"> <img src=\"images/df-splash.png\" class=\"image-splash\" alt=\"DYNO-FORCE\"> </a> <div> <a type=\"button\" class=\"btn btn-lg btn-success\" ng-href=\"#/main\"> <span class=\"glyphicon glyphicon-exclamation-sign\"></span> GO <span class=\"glyphicon glyphicon-exclamation-sign\"></span> </a> <div> </div></div></div>"
  );

}]);
