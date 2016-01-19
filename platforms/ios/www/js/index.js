document.addEventListener("deviceready", function() {
    'use strict';
    console.log("device ready");
    $(document).ready(init);
}, false);

<<<<<<< HEAD
/* NEXT STEPS */
/* 1) Start server on Host Game button
   2) When server is started, register zc service and watch
   3) Add Join Game button
   4) On Join Game, register zc service and watch
      Then find hosted game and display as Join This Game button
   5) On Join This Game button, try to send a message to the server
   6) The server on the Host should receive the message and alert
=======
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        StatusBar.overlaysWebView(false);
        StatusBar.hide();
        console.log("deviceready");
    }
};
>>>>>>> 9ac0af8d1e24dcc2a3075857f5561c3fb307a102

   UI tasks:
   1) Add splash screen
   2) Add GO button to splash screen when device is ready
   3) Update Host Game / Join Game buttons
   4) Add div for displaying found hosted games

   Arch tasks:
   1) Once network is demonstrated to work, move to angularjs framework

*/

/* initialize button handlers and networking */
function init() {
<<<<<<< HEAD
    'use strict';
    /* display splash screen on device ready and document initialized */
    $('div.screen-splash').show();

    /* splash screen button */
    $('#btn-splash').click(function() {
        $('div.screen-splash').hide();
        $('div.screen-main').show();
    });

    $('#btn-host-game').click(function() {
        var wss = startWebSocketServer();
        console.log(wss);
        registerZeroConf();
=======
    var zc;
    $('#btnadd').click(function(){
        zc = cordova.plugins.zeroconf;
        zc.register('_http._tcp.local.', 'DynoForce', 80, { 'foo': 'bar'});
        zc.watch('_http._tcp.local', function(result) {
            var action = result.action;
            var service = result.service;
            if (action === 'added' && service.name === 'DynoForce') {
                // alert("ADDED: "+service);
                console.log("ADDED:")
                console.log(service)
            }
            else if (action === 'removed' && service.name === 'DynoForce') {
                // alert("REMOVED: "+service);
                console.log("REMOVED: ")
                console.log(service)
            }
        });
>>>>>>> 9ac0af8d1e24dcc2a3075857f5561c3fb307a102
    });

    $('#btn-join-game').click(function() {
        registerZeroConf();
    });

    /* test button */

    $('#btn-test').click(function() {
        console.log('click');
        alert('test');
    });

    console.log('initialized');
}

function startWebSocketServer() {

    console.log('starting server');
    var wsserver = cordova.plugins.wsserver;

    wsserver.start(1337, {
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
        },
        'onClose': function(conn) {
            console.log('A user disconnected from %s', conn.remoteAddr);
        },
        'origins': ['file://'],
        'protocols': ['my-protocol-v1', 'my-protocol-v2']
    });

<<<<<<< HEAD
    console.log('server ok');
    return wsserver;
}

// conn: {
// 'uuid' : '8e176b14-a1af-70a7-3e3d-8b341977a16e',
// 'remoteAddr' : '192.168.1.10',
// 'acceptedProtocol' : 'my-protocol-v1',
// 'httpFields' : {...}
// }

function registerZeroConf() {

    var zc = cordova.plugins.zeroconf;
    zc.register('_http._tcp.local.', 'DynoForce-' + device.model + '-' + device.uuid, 80, {
        'id': 'DynoForce'
    });
    zc.watch('_http._tcp.local', function(result) {
        var action = result.action;
        var service = result.service;
        if (action === 'added' && service.txtRecord.id === 'DynoForce') {
            console.log("ADDED:");
            console.log(service);
        } 
        else if (action === 'removed') {
            console.log("REMOVED: ");
            console.log(service);
        }
=======
    $('#btnstart').click(function() {
        console.log("START")
>>>>>>> 9ac0af8d1e24dcc2a3075857f5561c3fb307a102
    });
}

