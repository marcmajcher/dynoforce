'use strict';
/* global cordova */
/* global device */

/**
 * @ngdoc overview
 * @name dynoforceApp
 * @description
 * # dynoforceApp
 *
 * Main module of the application.
 */
 angular.module('dynoforceApp')
 .value('socketPort', 1337)
 .factory('webSocketServer', ['socketPort', function(socketPort) {

  var service = {};
  service.hostIp = null;
  service.hostPort = null;
  service.wsserver = cordova.plugins.wsserver;

  /* Start a websocket server to host a game on the default port */
  service.start = function(onStart) {
    console.log('starting server');
    var self = this;

    this.wsserver.start(socketPort, {
      'onStart': function(addr, port) {
      	self.hostIp = addr;
      	self.hostPort = port;
      	onStart(addr, port);
        console.log('Listening on %s:%d', addr, port);
      },
      'onStop': function(addr, port) {
        console.log('Stopped listening on %s:%d', addr, port);
        self.hostIp = null;
        self.hostPort = null;
      },
      'onOpen': function(conn) {
        console.log('A user connected from %s', conn.remoteAddr);
      },
      'onMessage': function(conn, msg) {
        console.log(conn, msg);
        console.log('MSG');
        var json = JSON.parse(msg);
        console.log(json.message);
        alert(json.message);
      },
      'onClose': function(conn) {
        console.log('A user disconnected from %s', conn.remoteAddr);
      },
      'protocols': ['json']
    });
  };

  service.stop = function() {
  	this.wsserver.stop();
  };

  service.sendToPlayer = function(uuid, message) {
  	this.wsserver.send({'uuid':uuid}, message);
  };

  service.removePlayer = function(uuid) {
  	this.wsserver.close({'uuid':uuid});
  };

  service.connect = function(ip) {
  	console.log(ip);
  };

  return service;
// conn: {
// 'uuid' : '8e176b14-a1af-70a7-3e3d-8b341977a16e',
// 'remoteAddr' : '192.168.1.10',
// 'acceptedProtocol' : 'my-protocol-v1',
// 'httpFields' : {...}
// }

//create a new WebSocket object.
// websocket = new WebSocket("ws://localhost:9000/daemon.php"); 
// websocket.onopen = function(evt) { /* do stuff */ }; //on open event
// websocket.onclose = function(evt) { /* do stuff */ }; //on close event
// websocket.onmessage = function(evt) { /* do stuff */ }; //on message event
// websocket.onerror = function(evt) { /* do stuff */ }; //on error event
// websocket.send(message); //send method
// websocket.close(); //close method


}])
.factory('zeroConf', function() {

  var service = {};
  service.role = '';
  service.zc = cordova.plugins.zeroconf;

  service.register = function(role) {
    if (role !== 'host' && role !== 'player') {
      throw new Error('zeroConf - unknown role: '+role);
    }
    this.role = role;

    this.zc.register('_http._tcp.local.', 'DynoForce-' + device.model + '-' + device.uuid, 80, {
      'id': 'DynoForce',
      'role': role
    });

    this.zc.watch('_http._tcp.local', function(result) {
      var action = result.action;
      var service = result.service;
      if (action === 'added' && service.txtRecord.id === 'DynoForce' && service.txtRecord.role === 'host') {
        console.log('ADDED:');
        console.log(service);

        if (role === 'player') {
          var ip = service.addresses[0];
          console.log('found host address: '+ip);
          // var btn = $('<button>Join '+ip+'</button>').click((function(ip) {
          //   return function() {
          //     console.log(ip);
          //     ws = new WebSocket('ws://'+ip+':1337', ['json']);
          //     ws.onopen = function() {
          //       message = JSON.stringify({'message': 'xyzzy 1234'});
          //       ws.send(message);
          //     }
          //   };
          // })(ip));
          // $('#hosts').append(btn);
        }
      } 
      else if (action === 'removed') {
        console.log('REMOVED: ');
        console.log(service);
      }
    });
  };
});
