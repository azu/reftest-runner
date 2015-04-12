// LICENSE : MIT
"use strict";
var createServer, findOpenPort, isAvailable, portscanner;

createServer = require('net').createServer;

portscanner = require('portscanner');

isAvailable = function (port, callback) {
    return portscanner.checkPortStatus(port, '127.0.0.1', function (error, status) {
        if (error != null) {
            return callback(error);
        }
        return callback(null, status === 'closed');
    });
};

findOpenPort = function (callback) {
    var server;
    server = createServer();
    server.on('error', callback);
    return server.listen(0, function () {
        var port;
        port = this.address().port;
        server.on('close', function () {
            return callback(null, port);
        });
        return server.close();
    });
};

module.exports = {
    isAvailable: isAvailable,
    findOpenPort: findOpenPort
};