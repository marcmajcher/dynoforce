'use strict';

angular.module('dynoforceApp')
	.controller('MainController', ['$scope', 'webSocketServer', 'zeroConf', 'gameState',
		function($scope, webSocketServer, zeroConf, gameState) {

			var gd = $scope.gameData;

			/* Game hosting methods */

			$scope.hostGame = function() {
				gd.foundPlayers = [];

				var serverCallbacks = {
					onStart: function(addr, port) {
						gd.hostAddr = addr;
						gd.hostPort = port;
						console.log('Game server *' + gd.hostName + '* started.');
					},
					onStop: function(addr, port) {
						console.log('Stopped listening on %s:%d', addr, port);
					},
					onOpen: function(conn) {
						console.log('A user connected from %s', conn.remoteAddr);
						console.log(conn);
					},
					onMessage: function(conn, msg) {
						var json = JSON.parse(msg);
						console.log('Message: ' + json.message);
						console.log(conn);
						console.log(msg);
						alert('Message: ' + json.message);
						if (json.message === 'connect') {
							gd.foundPlayers.push({
								uuid: conn.uuid,
								addr: conn.remoteAddr,
								name: json.args.pilot
							});
							$scope.$apply();
						}
					},
					onClose: function(conn) {
						console.log('A user disconnected from %s', conn.remoteAddr);
					}
				};

				webSocketServer.start(serverCallbacks);

				zeroConf.registerHost(gd.hostName, function(service) {
					console.log('ZC Hosting game: ' + service.txtRecord.mech);
					console.log(service);
					gd.state = gameState.HOSTING;
					$scope.$apply();
				});
			};

			$scope.cancelHost = function() {
				webSocketServer.stop();
				zeroConf.stop();
				gd.state = gameState.IDLE;
				gd.foundPlayers = [];
			};

			/* Game joining methods */

			$scope.findGames = function() {
				gd.state = gameState.FINDING;
				gd.foundHosts = [];

				zeroConf.registerPlayer(gd.playerName,
					function(service) {
						/* watcher */
						console.log('Player ' + service.txtRecord.pilot + ' adding:');
						console.log(service);

						var hostAddr = service.addresses[0];
						console.log('found host address: ' + hostAddr + ' : ' + service.txtRecord.mech);
						gd.foundHosts.push({
							addr: hostAddr,
							name: service.txtRecord.mech,
							id: service.name
						});
						$scope.$apply();
					},
					function(service) {
						/* stopper */
						var index = -1;
						for (var i = 0; i < gd.foundHosts.length; i++) {
							if (gd.foundHosts[i].name === service.name) {
								console.log('REMOVING');
								index = i;
								break;
							}
						}
						if (index > -1) {
							gd.foundHosts.splice(index, 1);
							$scope.$apply();
						}
					}
				);
			};

			$scope.joinHost = function(addr) {
				console.log('joining: ' + addr);
				webSocketServer.joinHost(addr, gd.playerName);
			};

			$scope.cancelFind = function() {
				zeroConf.stop();
				gd.state = gameState.IDLE;
				gd.foundHosts = [];
			};
		}
	]);