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
  .config(function ($routeProvider) {
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
  });
