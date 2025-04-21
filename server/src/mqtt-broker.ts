import * as Aedes from 'aedes';
import { createServer } from 'net';
import { createServer as createAedesServer } from 'aedes-server-factory';

const portMqtt = 11883;
const aedes = Aedes.createBroker();
const mqttServerMqtt = createServer(aedes.handle);

mqttServerMqtt.on('connection', function () {
  console.log('client connected');
});

mqttServerMqtt.on('close', function () {
  console.log('client disconnected');
});

mqttServerMqtt.on('error', function (err) {
  console.log('mqttServerMqtt error:', err);
});

mqttServerMqtt.listen(portMqtt, function () {
  console.log('server started and listening on port ', portMqtt);
});

const mqttServerWs = createAedesServer(aedes, { ws: true });
const portWs = 18888;

mqttServerWs.on('connectionError', function (client) {
  console.log('client connection error', client);
});

mqttServerWs.on('client', function (client) {
  console.log('client connected', client);
});

mqttServerWs.on('clientDisconnect', function (client) {
  console.log('client disconnected', client);
});

mqttServerWs.on('close', function () {
  console.log('server closed');
});

mqttServerWs.listen(portWs, function () {
  console.log('websocket server listening on port ', portWs);
});

export { mqttServerMqtt, mqttServerWs };
