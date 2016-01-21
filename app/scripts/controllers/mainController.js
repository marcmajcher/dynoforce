'use strict';

/**
 * @ngdoc function
 * @name dynoforceApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the dynoforceApp
 */
angular.module('dynoforceApp')
  .controller('MainController', ['$scope', 'webSocketServer', 'zeroConf', 
  	function ($scope, webSocketServer, zeroConf) {

  		$scope.hosts = [];
  		$scope.state = {
  			hosting: false,
  			finding: false
		};
  		$scope.host = {};

  		/* Game hosting methods */
	  	$scope.hostGame = function() {
	  		webSocketServer.start($scope.onHostStart);
	  		zeroConf.register('host');
	  		// add visual indication
	  		$scope.state.hosting = true;

	  	};

	  	$scope.cancelHost = function() {
	  		webSocketServer.stop();
	  		$scope.state.hosting = false;
	  		$scope.host = {};
	  	};

	  	$scope.onHostStart = function(addr, port) {
	  		$scope.host.addr = addr;
	  		$scope.host.port = port;
	  	};

	  	$scope.findGames = function() {
	  		$scope.state.finding = true;
	  	};

	  	$scope.cancelFind = function () {
	  		$scope.state.finding = false;
	  	};
  }]);
