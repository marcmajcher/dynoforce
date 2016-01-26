'use strict';

angular.module('dynoforceApp')
  .controller('MainController', ['$scope', 'webSocketServer', 'zeroConf', 
  	function ($scope, webSocketServer, zeroConf) {

  		$scope.data = {
  			hosts: []
  		};
  		$scope.state = {
  			hosting: false,
  			finding: false
		};
  		$scope.host = {
  			name: '..'
  		};

  		/* Game hosting methods */

	  	$scope.hostGame = function() {
	  		webSocketServer.start($scope.onHostStart);
	  		zeroConf.register('host', function(service) {
	  			console.log('Hosting game: '+service.txtRecord.mech);
	  			console.log(service);
		  		$scope.host.name = service.txtRecord.mech;
		  		$scope.$apply();
	  		});
	  		$scope.state.hosting = true;
	  	};

	  	$scope.cancelHost = function() {
	  		webSocketServer.stop();
	  		zeroConf.stop();
	  		$scope.state.hosting = false;
	  		$scope.host = {};
	  	};

	  	$scope.onHostStart = function(addr, port) {
	  		$scope.host.addr = addr;
	  		$scope.host.port = port;
	  	};

	  	/* Game joining methods */

	  	$scope.findGames = function() {
	  		$scope.state.finding = true;

	  		zeroConf.register('player', function(service) {
	         	console.log('Player '+service.txtRecord.pilot+' adding:');
    		    console.log(service);

         		var addr = service.addresses[0];
	         	console.log('found host address: '+addr+' : '+service.txtRecord.mech);
	         	$scope.data.hosts.push({addr: addr, name: service.txtRecord.mech});
	         	$scope.$apply();
	  		});
	  	};

	  	$scope.joinHost = function(addr) {
	  		console.log('joining: '+addr);
	  		webSocketServer.joinHost(addr);
	  	};

	  	$scope.cancelFind = function () {
	  		zeroConf.stop();
	  		$scope.state.finding = false;
	  		$scope.data.hosts = [];
	  	};
  }]);
