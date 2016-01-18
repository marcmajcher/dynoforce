
function init() {
    $('#btnserver').hide();

    $('#btnadd').click(function(){

        var zc = cordova.plugins.zeroconf;
        zc.register('_http._tcp.local.', 'DynoForce-'+device.model+'-'+device.uuid, 80, { 'id': 'DynoForce'});
        zc.watch('_http._tcp.local', function(result) {
            var action = result.action;
            var service = result.service;
            if (action === 'added' && service.txtRecord.id === 'DynoForce') {
                // alert("ADDED: "+service);
                console.log("ADDED:")
                console.log(service)
            }
            else if (action === 'removed') {
                // alert("REMOVED: "+service);
                console.log("REMOVED: ")
                console.log(service)
            }
        });
        $('#btnadd').hide();
        $('#btnserver').show();
    });

    $('#btntest').click(function(){
        alert('test');
    });

    $('#btnserver').click(function() {
        alert('starting server')
        var wsserver = cordova.plugins.wsserver;


        wsserver.start(1337, {
            'onStart' : function(addr, port) {
                console.log('Listening on %s:%d', addr, port);
            },
            'onStop' : function(addr, port) {
                console.log('Stopped listening on %s:%d', addr, port);
            },
            'onOpen' : function(conn) {
                 // conn: {
                 // 'uuid' : '8e176b14-a1af-70a7-3e3d-8b341977a16e',
                 // 'remoteAddr' : '192.168.1.10',
                 // 'acceptedProtocol' : 'my-protocol-v1',
                 // 'httpFields' : {...}
                 // } 
                console.log('A user connected from %s', conn.remoteAddr);
            },
            'onMessage' : function(conn, msg) {
                console.log(conn, msg);
            },
            'onClose' : function(conn) {
                console.log('A user disconnected from %s', conn.remoteAddr);
            },
            'origins' : [ 'file://' ], // optional. validates the 'Origin' HTTP Header. 
            'protocols' : [ 'my-protocol-v1', 'my-protocol-v2' ] // optional. validates the 'Sec-WebSocket-Protocol' HTTP Header. 
        });

        alert('server ok')
    });


}

$(document).ready(init);
