'use strict';

angular.module('dynoforceApp')
.constant('gameState', Object.freeze({ ERROR: -1, IDLE: 0, HOSTING: 1, FINDING: 2 }))
.run(function($rootScope, gameState) { $rootScope.gameState = gameState; })
.controller('GameController', ['$scope', 'gameState', 'nameGen',
	function ($scope, gameState, nameGen) {

		$scope.gameData = {
			state: gameState.IDLE,
			hostAddr: null,
			hostPort: null,
			hostName: nameGen.getMechName(),
			playerName: nameGen.getPilotName(),
			foundHosts: [],
			foundPlayers: []
		};
	}]);