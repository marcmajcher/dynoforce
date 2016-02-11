'use strict';

/* Coordinates messages between host and players via websockets */

angular.module('dynoforceApp')
  .factory('heartService', ['websocketServer', function(websocketServer) {

    return {

      startHost: function() {

      },
      stopHost: function() {

      },
      subscribePlayer: function() {

      },
      unsubscribePlayer: function() {

      },
      sendToHost: function(message) {
var a = websocketServer;
a = message;
      },
      sentToPlayer: function(uuid, message) {
var a = uuid;
a = message;
      },
      broadcastToPlayers: function(message) {
var a = message; a = null;
      }

  };
}]);
