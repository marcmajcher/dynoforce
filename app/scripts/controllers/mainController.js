'use strict';

angular.module('dynoforceApp')
.controller('MainController', ['$scope', 'webSocketServer', 'zeroConf', 'gameState', 
	function ($scope, webSocketServer, zeroConf, gameState) {

		/* Game hosting methods */

		$scope.hostGame = function() {
			$scope.gameData.foundPlayers = [];

			var serverCallbacks = {
				onStart: function(addr, port) {
					$scope.gameData.hostAddr = addr;
					$scope.gameData.hostPort = port;
					console.log('Game server started on %s:%d', addr, port);
				},
				onStop: function(addr, port) {
					console.log('Stopped listening on %s:%d', addr, port);
				},
				onOpen: function(conn) {
					console.log('A user connected from %s', conn.remoteAddr);
					alert('onOpen');
					alert(conn.remoteAddr);
				},
				onMessage: function(conn, msg) {
					var json = JSON.parse(msg);
					console.log('Message: ' + json.message);
					alert('Message: '+json.message);
				},
				onClose: function(conn) {
					console.log('A user disconnected from %s', conn.remoteAddr);
				}
			};

			webSocketServer.start(serverCallbacks);

			zeroConf.registerHost($scope.gameData.hostName, function(service) {
				console.log('Hosting game: ' + service.txtRecord.mech);
				console.log(service);
				$scope.gameData.state = gameState.HOSTING;
				$scope.$apply();
			});
		};

		$scope.cancelHost = function() {
			webSocketServer.stop();
			zeroConf.stop();
			$scope.gameData.state = gameState.IDLE;
			$scope.gameData.foundPlayers = [];
		};

		/* Game joining methods */

		$scope.findGames = function() {
			$scope.gameData.state = gameState.FINDING;
			$scope.gameData.foundHosts = [];

			zeroConf.registerPlayer($scope.gameData.playerName, function(service) {
				console.log('Player '+service.txtRecord.pilot+' adding:');
				console.log(service);

				var hostAddr = service.addresses[0];
				console.log('found host address: '+hostAddr+' : '+service.txtRecord.mech);
				$scope.gameData.foundHosts.push({addr: hostAddr, name: service.txtRecord.mech});
				$scope.$apply();
			});
		};

		$scope.joinHost = function(addr) {
			console.log('joining: '+addr);
			webSocketServer.joinHost(addr);
		};

		$scope.cancelFind = function () {
			zeroConf.stop();
			$scope.gameData.state = gameState.IDLE;
			$scope.gameData.foundHosts = [];
		};
	}]);
