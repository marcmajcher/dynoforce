
function init() {
    $('#btnserver').hide();

    var zc;
    $('#btnadd').click(function(){

        zc = cordova.plugins.zeroconf;
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

    // $('#btnremove').click(function() {
    //     zc.stop();
    //     console.log("unregistered")
    // });
}

$(document).ready(init);
