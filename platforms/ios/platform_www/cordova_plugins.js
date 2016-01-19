cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/cordova-plugin-zeroconf/www/zeroconf.js",
        "id": "cordova-plugin-zeroconf.ZeroConf",
        "pluginId": "cordova-plugin-zeroconf",
        "clobbers": [
            "cordova.plugins.zeroconf"
        ]
    },
    {
<<<<<<< HEAD
        "file": "plugins/cordova-plugin-device/www/device.js",
        "id": "cordova-plugin-device.device",
        "pluginId": "cordova-plugin-device",
        "clobbers": [
            "device"
        ]
    },
    {
=======
>>>>>>> 9ac0af8d1e24dcc2a3075857f5561c3fb307a102
        "file": "plugins/cordova-plugin-websocket-server/www/wsserver.js",
        "id": "cordova-plugin-websocket-server.WebSocketServer",
        "pluginId": "cordova-plugin-websocket-server",
        "clobbers": [
            "cordova.plugins.wsserver"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-whitelist": "1.2.0",
    "cordova-plugin-zeroconf": "1.0.1",
<<<<<<< HEAD
    "cordova-plugin-device": "1.1.0",
=======
>>>>>>> 9ac0af8d1e24dcc2a3075857f5561c3fb307a102
    "cordova-plugin-websocket-server": "1.0.3"
}
// BOTTOM OF METADATA
});