angular.module('dynoforceApp').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('views/main.html',
    "<div class=\"main-buttons\" ng-if=\"!hosting && !finding\"> <button class=\"btn btn-lg\" ng-click=\"hostGame()\">Start New Game</button> <button class=\"btn btn-lg\" ng-click=\"findGames()\">Find a Game</button> </div>  Hosting game at {{host.addr}}:{{host.port}}. Waiting for players... <div class=\"player-list\"> ... </div> <div> <button class=\"btn btn-lg\" ng-click=\"cancelHost()\">Cancel</button> </div>  <div class=\"main-finding\" ng-if=\"!hosting && finding\"> Looking for a game... </div>"
  );


  $templateCache.put('views/splash.html',
    "<div class=\"jumbotron\"> <h1>Dyno-Force!</h1> <a ng-href=\"#/main\"> <img src=\"images/df-splash.png\" class=\"image-splash\" alt=\"DYNO-FORCE\"> </a> <div> <a type=\"button\" class=\"btn btn-lg btn-success\" ng-href=\"#/main\"> <span class=\"glyphicon glyphicon-exclamation-sign\"></span> GO <span class=\"glyphicon glyphicon-exclamation-sign\"></span> </a> <div> </div></div></div>"
  );

}]);
