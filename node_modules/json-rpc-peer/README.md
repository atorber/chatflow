# json-rpc-peer [![Build Status](https://travis-ci.org/JsCommunity/json-rpc-peer.png?branch=master)](https://travis-ci.org/JsCommunity/json-rpc-peer)

> JSON-RPC 2 transport-agnostic library

## Install

Installation of the [npm package](https://npmjs.org/package/json-rpc-peer):

```
> npm install --save json-rpc-peer
```

## Usage

This library provides a high-level peer implementation which should
be flexible enough to use in any environments.

```javascript
// ES5
var Peer = require("json-rpc-peer")["default"];

// ES6
import Peer from "json-rpc-peer";
```

### Construction

```javascript
var peer = new Peer(function onMessage(message) {
  // Here is the main handler where every incoming
  // notification/request message goes.
  //
  // For a request, this function just has to throw an exception or
  // return a value to send the related response.
  //
  // If the response is asynchronous, just return a promise.
});
```

> The `onMessage` parameter is optional, it can be omitted if this
> peer does not handle notifications and requests.

> Note: For security concerns, only exceptions which are instance of
> `JsonRpcError` will be transmitted to the remote peer, all others
> will be substituted by an instance of `UnknownError`.

### Connection

> The peer is now almost ready, but before being usable, it has to be
> connected to the transport layer.

The simplest interface, the `exec()` method, has some limitations (no
notifications support) but is often good enough.

It is often used with non-connected protocols such as HTTP:

```javascript
var readAllStream = require("read-all-stream");

// For this example we create an HTTP server:
require("http").createServer(
  {
    port: 8081,
  },
  function onRequest(req, res) {
    // Read the whole request body.
    readAllStream(req, function(err, message) {
      // Error handling would be better.
      if (err) return;

      // Here `peer` is not used as a stream, it can therefore be used
      // to handle all the connections.
      peer.exec(message).then(function(response) {
        res.end(response);
      });
    });
  }
);
```

If you have a connected transport, such as WebSocket, you may want to
use the stream interface: the peer is a duplex stream and can
therefore be connected to other streams via the `pipe()` method:

```javascript
// For this example, we create a WebSocket server:
require("websocket-stream").createServer(
  {
    port: 8080,
  },
  function onConnection(stream) {
    // Because a stream can only be used once, it is necessary to create
    // a dedicated peer per connection.
    stream.pipe(new Peer(onMessage)).pipe(stream);
  }
);
```

### Notification

```javascript
peer.notify("foo", ["bar"]);
```

### Request

The `request()` method returns a promise which will be resolved or
rejected when the response will be received.

```javascript
peer
  .request("add", [1, 2])
  .then(function(result) {
    console.log(result);
  })
  .catch(function(error) {
    console.error(error.message);
  });
```

### Failure

Sometimes it is known that current pending requests will not get
answered (e.g. connection lost), it is therefore necessary to fail
them manually.

```javascript
peer.request("add", [1, 2]).catch(function(reason) {
  console.error(reason);
  // → connection lost
});

peer.failPendingRequests("connection lost");
```

### Low level interface

> `json-rpc-peer` also exports everything from [`json-rpc-protocol`](https://www.npmjs.com/package/json-rpc-protocol).

```js
// ES5
var peer = require("json-rpc-peer");

var format = peer.format;
var parse = peer.parse;
var JsonRpcError = peer.JsonRpcError;
var InvalidJson = peer.InvalidJson;
var InvalidRequest = peer.InvalidRequest;
var MethodNotFound = peer.MethodNotFound;
var InvalidParameters = peer.InvalidParameters;

// ES2015 (formerly known as ES6)
import {
  format,
  parse,
  JsonRpcError,
  InvalidJson,
  InvalidRequest,
  MethodNotFound,
  InvalidParameters,
} from "json-rpc-peer";
```

## Development

```
# Install dependencies
> yarn

# Run the tests
> yarn test

# Continuously compile
> yarn dev

# Continuously run the tests
> yarn dev-test

# Build for production
> yarn build
```

## Contributions

Contributions are _very_ welcomed, either on the documentation or on
the code.

You may:

- report any [issue](https://github.com/JsCommunity/json-rpc-peer/issues)
  you've encountered;
- fork and create a pull request.

## License

ISC © [Julien Fontanet](https://julien.isonoe.net)
