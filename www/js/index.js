
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


function init() {
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
    });

    $('#btnremove').click(function() {
        zc.unregister('_http._tcp.local.', 'DynoForce');
        // zc.stop();
        console.log("unregistered")
    });
    $('#btnlist').click(function() {
        console.log(zc)
    });

    $('#btnstart').click(function() {
        console.log("START")
    });
}
$(document).ready(init);
