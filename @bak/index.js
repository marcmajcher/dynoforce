document.addEventListener("deviceready", function() {
    'use strict';
    console.log("device ready");
    $(document).ready(init);
}, false);

/* NEXT STEPS */
/* 1) Start server on Host Game button
   2) When server is started, register zc service and watch
   3) Add Join Game button
   4) On Join Game, register zc service and watch
      Then find hosted game and display as Join This Game button
   5) On Join This Game button, try to send a message to the server
   6) The server on the Host should receive the message and alert

   UI tasks:
   1) Add splash screen
   2) Add GO button to splash screen when device is ready
   3) Update Host Game / Join Game buttons
   4) Add div for displaying found hosted games

   Arch tasks:
   1) Once network is demonstrated to work, move to angularjs framework

*/

/* initialize button handlers and networking */
var wss;

function init() {
    'use strict';
    /* display splash screen on device ready and document initialized */
    $('div.screen-splash').show();

    /* splash screen button */
    $('#btn-splash').click(function() {
        $('div.screen-splash').hide();
        $('div.screen-main').show();
    });

    $('#btn-host-game').click(function() {
        wss = startWebSocketServer();
        registerZeroConf('host');
    });

    $('#btn-join-game').click(function() {
        registerZeroConf('player');
    });

    $('#btn-test').click(function() {
        alert("TEST");
        console.log("TEST");
    });

    console.log('initialized');
}

function startWebSocketServer() {

    console.log('starting server');
    var wsserver = cordova.plugins.wsserver;

    wsserver.start(1337, {
        'onStart': function(addr, port) {
            console.log('Listening on %s:%d', addr, port);
            $('div.screen-main').hide();
            $('#hosts').hide();
            $('div.screen-game').show();
        },
        'onStop': function(addr, port) {
            console.log('Stopped listening on %s:%d', addr, port);
        },
        'onOpen': function(conn) {
            console.log('A user connected from %s', conn.remoteAddr);
        },
        'onMessage': function(conn, msg) {
            console.log(conn, msg);
            console.log("MSG");
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
    return wsserver;
}

// conn: {
// 'uuid' : '8e176b14-a1af-70a7-3e3d-8b341977a16e',
// 'remoteAddr' : '192.168.1.10',
// 'acceptedProtocol' : 'my-protocol-v1',
// 'httpFields' : {...}
// }

function registerZeroConf(role) {

    var zc = cordova.plugins.zeroconf;
    zc.register('_http._tcp.local.', 'DynoForce-' + device.model + '-' + device.uuid, 80, {
        'id': 'DynoForce',
        'role': role
    });
    zc.watch('_http._tcp.local', function(result) {
            var action = result.action;
            var service = result.service;
            if (action === 'added' && service.txtRecord.id === 'DynoForce' && service.txtRecord.role === 'host') {
                console.log("ADDED:");
                console.log(service);

                if (role === 'player') {
                    var ip = service.addresses[0];
                    console.log('found host address: '+ip);
                    var btn = $('<button>Join '+ip+'</button>').click((function(ip) {
                            return function() {
                                console.log(ip);
                                ws = new WebSocket('ws://'+ip+':1337', ['json']);
                                ws.onopen = function() {
                                    message = JSON.stringify({'message': 'xyzzy 1234'});
                                    ws.send(message);
                                }
                            };
                        })(ip));
                    $('#hosts').append(btn);
                }
            } 
            else if (action === 'removed') {
                console.log("REMOVED: ");
                console.log(service);
            }
        });
    }