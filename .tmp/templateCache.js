angular.module('dynoforceApp').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('views/main.html',
    "<div class=\"main-buttons\" ng-if=\"!state.hosting && !state.finding\"> <button class=\"btn btn-lg\" ng-click=\"hostGame()\">Start New Game</button> <button class=\"btn btn-lg\" ng-click=\"findGames()\">Find a Game</button> </div> <div class=\"main-hosting\" ng-if=\"state.hosting\"> Hosting game {{host.name}}. Waiting for players... <div class=\"player-list\"> ... </div> <div> <button class=\"btn btn-lg\" ng-click=\"cancelHost()\">Cancel</button> </div> </div> <div class=\"main-finding\" ng-if=\"state.finding\"> Looking for a game... <h2>Available Teams:</h2> <div> <ul> <li ng-repeat=\"host in data.hosts\"> <button class=\"btn btn-lg\" ng-click=\"joinHost(host.addr)\"> Join Host: {{host.name}} at {{host.addr}} </button> </li> </ul> </div> <div> <button class=\"btn btn-lg\" ng-click=\"cancelFind()\">Cancel</button> </div> </div>"
  );


  $templateCache.put('views/splash.html',
    "<div class=\"jumbotron\"> <h1>Dyno-Force!</h1> <a ng-href=\"#/main\"> <img src=\"images/df-splash.png\" class=\"image-splash\" alt=\"DYNO-FORCE\"> </a> <div> <a type=\"button\" class=\"btn btn-lg btn-success\" ng-href=\"#/main\"> <span class=\"glyphicon glyphicon-exclamation-sign\"></span> GO <span class=\"glyphicon glyphicon-exclamation-sign\"></span> </a> <div> </div></div></div>"
  );

}]);
