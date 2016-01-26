'use strict';

angular.module('dynoforceApp')
	.constant('gameState', Object.freeze({
		ERROR: -1,
		IDLE: 0,
		HOSTING: 1,
		FINDING: 2,
		JOINING: 3
	}))
	.run(function($rootScope, gameState) {
		$rootScope.gameState = gameState;
	})
	.controller('GameController', ['$scope', 'gameState', 'nameGen',
		function($scope, gameState, nameGen) {

			$scope.gameData = {
				state: gameState.IDLE,
				hostAddr: undefined,
				hostPort: undefined,
				hostName: nameGen.getMechName(),
				playerName: nameGen.getPilotName(),
				foundHosts: {},
				foundPlayers: {},
				webSocket: undefined
			};

			$scope.setGameState = function(state) {
				$scope.gameData.state = state;
				if ($scope.$root.$$phase !== '$apply' &&
					$scope.$root.$$phase !== '$digest') {
					$scope.$apply();
				}
			};
		}
	]);