'use strict';
/* global cordova */

/* Coordinates messages between host and players via websockets */

angular.module('dynoforceApp')
  .constant('socketPort', 1337)
  .factory('heartService', ['$q', 'socketPort', function($q, socketPort) {

    return {
      role: undefined,

      /* host-facing properties */
      wsserver: cordova.plugins.wsserver,
      players: undefined,
      hostAddr: undefined,
      hostPort: undefined,

      /* host-facing methods */

      /* Start a websocket server to host a game on the default port */

      startHost: function() {
        this.role = 'host';
        this.players = {};
        var deferred = $q.defer();

        this.wsserver.start(socketPort, {
          onStart: function(addr, port) {
            this.hostAddr = addr;
            this.hostPort = port;
            console.log('aaaa1111');
            // deferred.notify('Game server started');
            console.log('bbbbb2222');
            // deferred.notify(Object.keys(this.players).join(':'));
            // $scope.addPlayer(new Pilot(addr, gd.pilotName));
            //console.log('Game server *' + gd.hostName + '* started.');
          },
          onStop: function(addr, port) {
            console.log('Stopped listening on %s:%d', addr, port);
            // gd.state = gameState.IDLE;
          },
          onOpen: function(conn) {
            console.log('A user connected from %s', conn.remoteAddr);
          },
          onMessage: function(conn, msg) {
            var json = JSON.parse(msg);
            if (json.message === 'connect') {
              // $scope.addPlayer(new Pilot(conn.remoteAddr, json.args.pilot));
              // $scope.$apply();
            }
          },
          onClose: function(conn) {
            console.log('A user disconnected from %s', conn.remoteAddr);
            // $scope.removePlayer(conn.remoteAddr);
            // $scope.$apply();
          },
          protocols: ['json']
        });

        return deferred.promise;
      },

      stopHost: function() {
        this.wsserver.stop();
      },

      sendToPlayer: function(uuid, message) {
        this.wsserver.send({
          'uuid': uuid
        }, message);
      },

      removePlayer: function(uuid) {
        this.wsserver.close({
          'uuid': uuid
        });
      },

      /* player-facing methods */

      joinHost: function(addr, pilot, callback) {
        var ws = new WebSocket('ws://' + addr + ':' + socketPort, ['json']);
        ws.onopen = function() {
          var message = JSON.stringify({
            'message': 'connect',
            'args': {
              'pilot': pilot
            }
          });
          ws.send(message);
          callback(ws);
        };
      },

      subscribePlayer: function() {

      },
      unsubscribePlayer: function() {

      },
      sendToHost: function( /*message*/ ) {},
      sentToPlayer: function( /*uuid, message*/ ) {},
      broadcastToPlayers: function( /*message*/ ) {}

    };
  }]);