# User defined server support

reftest-runner support user defined server.

It's mean that you implement own server under the rule and reftest-runner can treat it as local server.

## Rules

You should implement `emitter.on("close", fn);` and call `emitter.emit("connection");`

```js
emitter.on("close", function(){
   server.close()
});
```

```js
"use strict";
var staticServer = require('node-static');
var assert = require("assert");
/**
 * @param {EventEmitter} emitter
 * @param {IReftestOption} options
 */
module.exports = function (emitter, options) {
    assert(options && options.server && options.server.port != null, "require options.server.port");
    var fileServer = new staticServer.Server(options.rootDir);
    var server = require('http').createServer(function (request, response) {
        request.addListener('end', function () {
            fileServer.serve(request, response, function (err, result) {
                if (err) { // There was an error serving the file
                    sys.error("Error serving " + request.url + " - " + err.message);

                    // Respond to the client
                    response.writeHead(err.status, err.headers);
                    response.end();
                }
            });
        }).resume();
    }).listen(options.server.port);
    // when reftest-runner emit "close", then sever should be closed.
    emitter.on("close", function(){
       server.close()
    });
    // finish setup callback
    emitter.emit("connection");
};
```