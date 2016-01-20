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
 angular
 .module('dynoforceApp', [
  'ngAnimate',
  'ngCookies',
  'ngResource',
  'ngRoute',
  'ngSanitize',
  'ngTouch'
  ])
 .config(["$routeProvider", function ($routeProvider) {
  $routeProvider
  .when('/', {
    templateUrl: 'views/splash.html',
    controller: 'SplashController',
    controllerAs: 'splash'
  })
  .when('/main', {
    templateUrl: 'views/main.html',
    controller: 'MainController',
    controllerAs: 'main'
  })
  .otherwise({
    redirectTo: '/'
  });
}])
 .value('socketPort', 1337)
 .factory('webSocketServer', ['socketPort', function(socketPort) {

  var service = {};
  service.wsserver = cordova.plugins.wsserver;
  service.start = function() {
    console.log('starting server');
    this.wsserver.start(socketPort, {
      'onStart': function(addr, port) {
        console.log('Listening on %s:%d', addr, port);
      },
      'onStop': function(addr, port) {
        console.log('Stopped listening on %s:%d', addr, port);
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
    console.log('server ok');
  };
  return service;
// conn: {
// 'uuid' : '8e176b14-a1af-70a7-3e3d-8b341977a16e',
// 'remoteAddr' : '192.168.1.10',
// 'acceptedProtocol' : 'my-protocol-v1',
// 'httpFields' : {...}
// }
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

    service.zc.watch('_http._tcp.local', function(result) {
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

'use strict';

/**
 * @ngdoc function
 * @name dynoforceApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the dynoforceApp
 */
angular.module('dynoforceApp')
  .controller('SplashController', function () {
  });

'use strict';

/**
 * @ngdoc function
 * @name dynoforceApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the dynoforceApp
 */
angular.module('dynoforceApp')
  .controller('MainController', ['$scope', 'webSocketServer', 'zeroConf', 
  	function ($scope, webSocketServer, zeroConf) {

	  	$scope.hostGame = function() {
	  		webSocketServer.start();
	  		zeroConf.register('host');
	  	};
  }]);

angular.module('dynoforceApp').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('views/main.html',
    "<button class=\"btn btn-lg\" ng-click=\"hostGame()\">Start New Game</button> <button class=\"btn btn-lg\">Find a Game</button>"
  );


  $templateCache.put('views/splash.html',
    "<div class=\"jumbotron\"> <h1>Dyno-Force!</h1> <a ng-href=\"#/main\"> <img src=\"images/df-splash.png\" class=\"image-splash\" alt=\"DYNO-FORCE\"> </a> <div> <a type=\"button\" class=\"btn btn-lg btn-success\" ng-href=\"#/main\"> <span class=\"glyphicon glyphicon-exclamation-sign\"></span> GO <span class=\"glyphicon glyphicon-exclamation-sign\"></span> </a> <div> </div></div></div>"
  );

}]);
