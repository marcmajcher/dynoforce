'use strict';

/**
 * @ngdoc function
 * @name dynoforceApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the dynoforceApp
 */
angular.module('dynoforceApp')
  .controller('MainController', ['$scope', 'webSocketServer', function ($scope, webSocketServer) {
  	this.testJunk = 'foo';

  	$scope.doTheThing = function() {
  		webSocketServer.start();
  	};
  }]);
