'use strict';
/* global cordova */
/* global device */

angular.module('dynoforceApp')
  .factory('zeroConf', [function() {

    return {
      zc: cordova.plugins.zeroconf,
      stopper: undefined,

      /* Register a game server host on the local network. */
      registerHost: function(mechName, watcher, stopper) {
        this.stopper = stopper;
        this._register({
          id: 'DynoForce',
          role: 'host',
          mech: mechName
        }, watcher);
      },

      /* Register as a potential player on the local network. */
      registerPlayer: function(pilotName, watcher, stopper) {
        this.stopper = stopper;
        this._register({
          id: 'DynoForce',
          role: 'player',
          pilot: pilotName
        }, watcher);
      },

      _register: function(data, watcher) {
        this.zc.register('_http._tcp.local.', 'DynoForce-' + device.model + '-' + device.uuid, 80, data);
        var self = this;

        this.zc.watch('_http._tcp.local', function(result) {
          var action = result.action;
          var text = result.service.txtRecord;

          if (action === 'added' && text.id === 'DynoForce' && text.role === 'host') {
            watcher(result.service);
          }
          else if (action === 'removed') {
            self.stopper(result.service);
          }
        });
      },

      stop: function() {
        this.zc.unwatch('_http._tcp.local.');
        this.zc.stop();
        this.zc = cordova.plugins.zeroconf;
      }
    };
  }]);