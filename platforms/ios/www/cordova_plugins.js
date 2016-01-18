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
        "file": "plugins/cordova-plugin-device/www/device.js",
        "id": "cordova-plugin-device.device",
        "pluginId": "cordova-plugin-device",
        "clobbers": [
            "device"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-whitelist": "1.2.0",
    "cordova-plugin-zeroconf": "1.0.1",
    "cordova-plugin-device": "1.1.0"
}
// BOTTOM OF METADATA
});