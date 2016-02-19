'use strict';

angular.module('dynoforceApp')
.controller('MainController', ['$scope', 'heartService', 'zeroConf', 'gameState', 'nameGen',
	function($scope, heartService, zeroConf, gameState, nameGen) {

		var gd = $scope.gameData;

		/* Game hosting methods */

		$scope.hostGame = function() {

			heartService.startHost().then(function(){}, function(){}, 
				function(notice) {
					alert('NOTIFY: '+notice);
				});

			zeroConf.registerHost(gd.hostName,
				function(service) {
					/* watcher */
					console.log('ZC Hosting game: ' + service.txtRecord.mech);
					console.log(service);
					if (service.txtRecord.mech === gd.hostName) {
						$scope.setGameState(gameState.HOSTING);
					}
				},
				function() {});
		};

		$scope.stopHost = function() {
				// webSocketServer.stop();
				// zeroConf.stop();
				// $scope.setGameState(gameState.IDLE);
				// gd.foundPlayers = {};
			};

			/* Game joining methods */

			$scope.findGames = function() {
				$scope.setGameState(gameState.FINDING);
				gd.foundHosts = {};

				zeroConf.registerPlayer(gd.playerName,
					function(service) {
						/* watcher */
						var hostAddr = service.addresses[0];
						console.log('Player ' + gd.playerName + ' adding ' + hostAddr + ' : ' + service.txtRecord.mech);

						gd.foundHosts[service.name] = {
							addr: hostAddr,
							name: service.txtRecord.mech,
							id: service.name
						};
						$scope.$apply();
					},
					function(service) {
						/* stopper */
						console.log('zeroConf stopper');
						console.log(service);
						delete gd.foundHosts[service.name];
						$scope.$apply();
					}
					);
			};

			$scope.joinHost = function(/*addr*/) {
				// webSocketServer.joinHost(addr, gd.pilotName, function(ws) {
				// 	gd.webSocket = ws;
				// 	$scope.setGameState(gameState.JOINING);
				// });
};

			// websocket.onclose = function(evt) { /* do stuff */ }; //on close event
			// websocket.onmessage = function(evt) { /* do stuff */ }; //on message event
			// websocket.onerror = function(evt) { /* do stuff */ }; //on error event

			$scope.unjoinHost = function() {
				if (gd.webSocket !== undefined) {
					gd.webSocket.close();
				}
				gd.webSocket = undefined;
				$scope.setGameState(gameState.FINDING);
			};

			$scope.cancelFind = function() {
				$scope.unjoinHost();
				zeroConf.stop();
				$scope.setGameState(gameState.IDLE);
				gd.foundHosts = {};
			};

			$scope.refreshKaiju = function() {
				gd.kaijuName = nameGen.getKaijuName();
			};
		}
		]);