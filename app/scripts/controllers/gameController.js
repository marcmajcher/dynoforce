'use strict';

/* This is the 'root level' controller for the Dyno-Force game.
   It will hold common 'global' information such as game state,
   networking connections and status, etc. */

angular.module('dynoforceApp')
.constant('gameState', Object.freeze({ IDLE: 0, HOSTING: 1, FINDING: 2 }))
.controller('MainController', ['$scope', 'gameState', 
	function ($scope, gameState) {
		$scope.data = {
			state: gameState.IDLE
		};


	}]);