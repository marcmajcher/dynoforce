'use strict';

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
}]);

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

  		$scope.data = {
  			hosts: []
  		};
  		$scope.state = {
  			hosting: false,
  			finding: false
		};
  		$scope.host = {
  			name: ''
  		};

  		/* Game hosting methods */

	  	$scope.hostGame = function() {
	  		webSocketServer.start($scope.onHostStart);
	  		zeroConf.register('host', function(service) {
	  			console.log('Hosting game: '+service.txtRecord.mech);
	  			console.log(service);
		  		$scope.host.name = service.txtRecord.mech;
		  		$scope.$apply();
	  		});
	  		$scope.state.hosting = true;
	  	};

	  	$scope.cancelHost = function() {
	  		webSocketServer.stop();
	  		zeroConf.stop();
	  		$scope.state.hosting = false;
	  		$scope.host = {};
	  	};

	  	$scope.onHostStart = function(addr, port) {
	  		$scope.host.addr = addr;
	  		$scope.host.port = port;
	  	};

	  	/* Game joining methods */

	  	$scope.findGames = function() {
	  		$scope.state.finding = true;

	  		zeroConf.register('player', function(service) {
	         	console.log('Player '+service.txtRecord.pilot+' adding:');
    		    console.log(service);

         		var addr = service.addresses[0];
	         	console.log('found host address: '+addr+' : '+service.txtRecord.mech);
	         	$scope.data.hosts.push({addr: addr, name: service.txtRecord.mech});
	         	$scope.$apply();
	  		});
	  	};

	  	$scope.joinHost = function(addr) {
	  		console.log('joining :');
	  		console.log(addr);
	  	};

	  	$scope.cancelFind = function () {
	  		zeroConf.stop();
	  		$scope.state.finding = false;
	  		$scope.data.hosts = [];
	  	};
  }]);

'use strict';
/* global cordova */
/* global device */

angular.module('dynoforceApp')
.value('socketPort', 1337)
.factory('webSocketServer', ['socketPort', function(socketPort) {

  var service = {
  };

  service.wsserver = cordova.plugins.wsserver;

  /* Start a websocket server to host a game on the default port */
  service.start = function(onStart) {
    console.log('starting server');
    // var self = this;

    /* host-facing methods */

    this.wsserver.start(socketPort, {
      'onStart': function(addr, port) {
        onStart(addr, port);
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
  };

  service.stop = function() {
    this.wsserver.stop();
  };

  service.sendToPlayer = function(uuid, message) {
    this.wsserver.send({
      'uuid': uuid
    }, message);
  };

  service.removePlayer = function(uuid) {
    this.wsserver.close({
      'uuid': uuid
    });
  };

  /* player-facing methods */

  service.joinHost = function(addr) {
    console.log('joinHost: ' + addr);
    var ws = new WebSocket('ws://' + addr + ':' + socketPort, ['json']);
    ws.onopen = function() {
      var message = JSON.stringify({
        'message': 'connect'
      });
      ws.send(message);
    };
  };

  return service;

    // conn: {
    // 'uuid' : '8e176b14-a1af-70a7-3e3d-8b341977a16e',
    // 'remoteAddr' : '192.168.1.10',
    // 'acceptedProtocol' : 'my-protocol-v1',
    // 'httpFields' : {...}
    // }

    //create a new WebSocket object.
    // websocket = new WebSocket('ws://localhost:9000/daemon.php'); 
    // websocket.onopen = function(evt) { /* do stuff */ }; //on open event
    // websocket.onclose = function(evt) { /* do stuff */ }; //on close event
    // websocket.onmessage = function(evt) { /* do stuff */ }; //on message event
    // websocket.onerror = function(evt) { /* do stuff */ }; //on error event
    // websocket.send(message); //send method
    // websocket.close(); //close method

  }])
.factory('zeroConf', ['nameGen', function(nameGen) {

  var service = {
    role: ''
  };

  service.zc = cordova.plugins.zeroconf;
  var self = this;

  service.register = function(role, watcher) {
    if (role !== 'host' && role !== 'player') {
      throw new Error('zeroConf - unknown role: ' + role);
    }
    self.role = role;

    service.zc.register('_http._tcp.local.', 'DynoForce-' + device.model + '-' + device.uuid, 80, {
      'id': 'DynoForce',
      'role': role,
      'mech': nameGen.getMechName(),
      'pilot': nameGen.getPilotName()
    });

    this.zc.watch('_http._tcp.local', function(result) {
      var action = result.action;
      var zcservice = result.service;

      if (action === 'added' &&
        zcservice.txtRecord.id === 'DynoForce' &&
        zcservice.txtRecord.role === 'host') {

        watcher(zcservice);
    } 
    else if (action === 'removed') {
      console.log('REMOVED: ');
      console.log(zcservice);
    }
  });
  };

  service.stop = function() {
    service.zc.stop();
  };

  return service;
}]);

'use strict';

angular.module('dynoforceApp')
.factory('nameGen', function() {
	return {
		firstname: [
		'Titan', 'Sequoia', 'Stampede', 'Fermi', 'Nebula',
		'Pleiades', 'Helios', 'Cielo', 'Hopper', 'Yellowstone', 'Roadrunner', 'Cherno',
		'Zin', 'Raptor', 'Avoca', 'Sakura', 'Himawari', 'Intrepid', 'Ranger', 'Discover',
		'Dawn', 'Endeavor', 'Pershing', 'Luna', 'Vulcan', 'Spirit', 'Pecos', 'Chama',
		'Kilrain', 'Zeus', 'Garnet', 'Blackthorn', 'Hercules', 'Triolith', 'Tachyonll',
		'Amazon', 'Moonlight', 'Jade', 'Zeus', 'Mustang', 'Ruby', 'Gyre', 'Tide', 'Vesta',
		'Sierra', 'Willow', 'Laurel', 'Cluster', 'Encanto', 'Juno', 'Jet', 'Hera', 'Emerald',
		'Aurora', 'Beacon', 'Hybrid', 'Lattice', 'Copper', 'Olympus', 'Edge', 'Palmetto',
		'Boomer', 'Fission', 'Typhoon', 'Nimbus', 'Midway', 'Mana', 'Oakley', 'Brawler',
		'Yukon', 'Coyote', 'Alpha', 'Tango', 'Horizon', 'Brave', 'Romeo', 'Blue', 'Tacit',
		'Ronin', 'Diablo', 'Intercept', 'Solar', 'Prophet', 'Puma', 'Real', 'Eden', 'Assassin',
		'Gipsy', 'Danger', 'Matador', 'Fury', 'Shaolin', 'Rogue', 'Specter', 'Chrome', 'Brutus',
		'Crimson', 'Striker', 'Eureka', 'Nova', 'Hyperion', 'Echo', 'Saber', 'Mammoth', 'Apostle',
		'Hydra', 'Corinthian', 'Lucky', 'Yankee', 'Renegade', 'Bombshell', 'Swift', 'Raging',
		'Bravo', 'Foxtrot', 'Tango', 'Victor', 'Whisky', 'Zulu', 'Atlas', 'Avenger', 'Banshee',
		'Boomerang', 'Brigand', 'Buccaneer', 'Buffalo', 'Comet', 'Coronado', 'Corsair', 'Defiant',
		'Devastator', 'Dominator', 'Dragon', 'Eagle', 'Electra', 'Envoy', 'Express', 'Falcon',
		'Fireball', 'Firebrand', 'Firefly', 'Fox', 'Gauntlet', 'Gladiator', 'Grizzly', 'Havoc',
		'Hawk', 'Helldiver', 'Hotspur', 'Hurricane', 'Invader', 'Lancer', 'Liberator', 'Lightning',
		'MAriner', 'Mars', 'Master', 'Mentor', 'Meteor', 'Nomad', 'Orion', 'Phantom', 'Proctor',
		'Rapid', 'Reliant', 'Scimitar', 'Sentinel', 'Shrike', 'Spitfire', 'Stirling', 'Tempest',
		'Thunderbolt', 'Tornado', 'Valiant', 'Vanguard', 'Vega', 'Vengeance', 'Vindicator',
		'Voyager', 'Whirlwind', 'Wildcat', 'Zero', 'Brawler', 'Coyote', 'Horizon', 'Romeo', 'Juliet',
		'Tacit', 'Cherno', 'Tango', 'Diablo', 'Solar', 'Puma', 'Eden', 'Gipsy', 'Matador',
		'Shaolin', 'Vulcan', 'Chrome', 'Crimson', 'Hydra', 'Nova', 'Echo', 'Mammoth', 'Striker', 'Lucky'
		],

		lastname: [
		'Titan', 'Sequoia', 'Mira', 'Stampede', 'Fermi', 'Nebula',
		'Pleiades', 'Helios', 'Cielo', 'Hopper', 'Yellowstone', 'Roadrunner', 'Cherno',
		'Zin', 'Raptor', 'Avoca', 'Sakura', 'Himawari', 'Intrepid', 'Ranger', 'Discover',
		'Dawn', 'Endeavor', 'Pershing', 'Luna', 'Vulcan', 'Spirit', 'Pecos', 'Chama',
		'Kilrain', 'Zeus', 'Garnet', 'Blackthorn', 'Hercules', 'Triolith', 'Tachyonll',
		'Amazon', 'Moonlight', 'Jade', 'Zeus', 'Mustang', 'Ruby', 'Gyre', 'Tide', 'Vesta',
		'Sierra', 'Willow', 'Laurel', 'Cluster', 'Encanto', 'Juno', 'Jet', 'Hera', 'Emerald',
		'Aurora', 'Beacon', 'Hybrid', 'Lattice', 'Copper', 'Olympus', 'Edge', 'Palmetto',
		'Boomer', 'Fission', 'Typhoon', 'Nimbus', 'Midway', 'Mana', 'Oakley', 'Brawler',
		'Yukon', 'Coyote', 'Alpha', 'Tango', 'Horizon', 'Brave', 'Romeo', 'Blue',
		'Ronin', 'Diablo', 'Intercept', 'Solar', 'Prophet', 'Puma', 'Real', 'Eden', 'Assassin',
		'Gipsy', 'Danger', 'Matador', 'Fury', 'Shaolin', 'Rogue', 'Specter', 'Chrome', 'Brutus',
		'Crimson', 'Striker', 'Eureka', 'Nova', 'Hyperion', 'Echo', 'Saber', 'Mammoth', 'Apostle',
		'Hydra', 'Corinthian', 'Lucky', 'Yankee', 'Beta', 'Omega', 'Gamma', 'Delta', 'Epsilon',
		'Theta', 'Omicron', 'Pi',
		'Sigma', 'Renegade', 'Bombshell', 'Swift', 'Raging',
		'Bravo', 'Foxtrot', 'Tango', 'Victor', 'Whisky', 'Zulu', 'Atlas', 'Avenger', 'Banshee',
		'Boomerang', 'Brigand', 'Buccaneer', 'Buffalo', 'Comet', 'Coronado', 'Corsair', 'Defiant',
		'Devastator', 'Dominator', 'Dragon', 'Eagle', 'Electra', 'Envoy', 'Express', 'Falcon',
		'Fireball', 'Firebrand', 'Firefly', 'Fox', 'Gauntlet', 'Gladiator', 'Grizzly', 'Havoc',
		'Hawk', 'Helldiver', 'Hotspur', 'Hurricane', 'Invader', 'Lancer', 'Liberator', 'Lightning',
		'Mariner', 'Mars', 'Master', 'Mentor', 'Meteor', 'Nomad', 'Orion', 'Phantom',
		'Rapid', 'Reliant', 'Scimitar', 'Sentinel', 'Shrike', 'Spitfire', 'Stirling', 'Tempest',
		'Thunderbolt', 'Tornado', 'Valiant', 'Vanguard', 'Vega', 'Vengeance', 'Vindicator',
		'Voyager', 'Whirlwind', 'Wildcat', 'Zero', 'Yukon', 'Tango', 'Brave', 'Blue', 'Ronin', 'Alpha',
		'Tasmania', 'Intercept', 'Prophet', 'Real', 'Assassin', 'Danger', 'Fury', 'Rogue',
		'Specter', 'Brutus', 'Typhoon', 'Corinthian', 'Hyperion', 'Saber', 'Apostle', 'Eureka', 'Seven'
		],
		getMechName: function() {
			var first = this.firstname[Math.floor(Math.random()*this.firstname.length)];
			var last = first;
			while (last === first) {
				last = this.lastname[Math.floor(Math.random()*this.lastname.length)];
			}
			return first + ' ' + last;
		},
		getPilotName: function() {
			return this.pilots[Math.floor(Math.random()*this.pilots.length)];
		},
		pilots: [
		'Lightning',
		'Enzo',
		'Savernake',
		'Koko',
		'Hershey',
		'Cholo',
		'Elvis',
		'Machen',
		'Adonis',
		'Savernake',
		'Beefeater',
		'Sauce',
		'Bolero',
		'Titian',
		'Morocco',
		'Smores',
		'Caboodle',
		'Taro',
		'Chief',
		'Grunge',
		'Sweetheart',
		'Rover',
		'Sneezy',
		'Sweeney',
		'Squid',
		'Santini',
		'Solo',
		'Moochy',
		'Fido',
		'Nickleby',
		'Cromwell',
		'Oink',
		'Fizz',
		'Pupa',
		'Chiquita',
		'Haley',
		'Knaidel',
		'Sugar',
		'Boone',
		'Ares',
		'Queeny',
		'Amy',
		'Inca',
		'Napa',
		'Geezer',
		'Periwinkle',
		'Hog',
		'Patsy',
		'Mee-Krob',
		'Flora',
		'Mulan',
		'Napa',
		'Hobbit',
		'Wilhelmina',
		'Peppermint',
		'Cuddles',
		'Nelly',
		'Panama',
		'Remington',
		'Drambuie',
		'Zippi',
		'Dudette',
		'Bologna',
		'Calico',
		'Boz',
		'Wink',
		'Goomba',
		'Cypress',
		'Pokerface',
		'MoJo',
		'Snoopy',
		'Mariachi',
		'Rhodes',
		'Lunatic',
		'Saber',
		'Mutant',
		'Hershey',
		'Pickles',
		'Football',
		'Babbit',
		'Bumba',
		'Baby',
		'Zephyr',
		'Gator',
		'Munchkin',
		'Dusty',
		'Cheetah',
		'Cognac',
		'Andalusia',
		'Stellar',
		'Rotten',
		'Howler',
		'Bones',
		'Mutt',
		'Pachyderm',
		'Satin',
		'Prodigy',
		'Count',
		'Trouble',
		'Vanilla',
		'Angstrom',
		'Ira',
		'Sugarplum',
		'Daisy',
		'Harpo',
		'Holly',
		'Buffy',
		'Joppa',
		'Salamander',
		'Sashimi',
		'Gulliver',
		'Cha-Cha',
		'Mozart',
		'Bonsai',
		'Bullion',
		'Ragmop',
		'Sorbet',
		'Lady',
		'Maduro',
		'Fletch',
		'Gorilla',
		'Crusader',
		'Jai Alai',
		'Kelly',
		'Yukon',
		'Viva',
		'Pugnose',
		]
	};
});

angular.module('dynoforceApp').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('views/main.html',
    "<div class=\"main-buttons\" ng-if=\"!state.hosting && !state.finding\"> <button class=\"btn btn-lg\" ng-click=\"hostGame()\">Start New Game</button> <button class=\"btn btn-lg\" ng-click=\"findGames()\">Find a Game</button> </div> <div class=\"main-hosting\" ng-if=\"state.hosting\"> Hosting game {{host.name}}. Waiting for players... <div class=\"player-list\"> ... </div> <div> <button class=\"btn btn-lg\" ng-click=\"cancelHost()\">Cancel</button> </div> </div> <div class=\"main-finding\" ng-if=\"state.finding\"> Looking for a game... <h2>Available Teams:</h2> <div> <ul> <li ng-repeat=\"host in data.hosts\"> <button class=\"btn btn-lg\" ng-click=\"joinHost(host.addr)\"> Join Host: {{host.name}} at {{host.addr}} </button> </li> </ul> </div> <div> <button class=\"btn btn-lg\" ng-click=\"cancelFind()\">Cancel</button> </div> </div>"
  );


  $templateCache.put('views/splash.html',
    "<div class=\"jumbotron\"> <h1>Dyno-Force!</h1> <a ng-href=\"#/main\"> <img src=\"images/df-splash.png\" class=\"image-splash\" alt=\"DYNO-FORCE\"> </a> <div> <a type=\"button\" class=\"btn btn-lg btn-success\" ng-href=\"#/main\"> <span class=\"glyphicon glyphicon-exclamation-sign\"></span> GO <span class=\"glyphicon glyphicon-exclamation-sign\"></span> </a> <div> </div></div></div>"
  );

}]);
