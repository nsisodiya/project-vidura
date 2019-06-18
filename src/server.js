const WebSocket = require("ws");
const wsport = 3211;
const wss = new WebSocket.Server({
  port: wsport,
  perMessageDeflate: {
    zlibDeflateOptions: {
      // See zlib defaults.
      chunkSize: 1024,
      memLevel: 7,
      level: 3
    },
    zlibInflateOptions: {
      chunkSize: 10 * 1024
    },
    // Other options settable:
    clientNoContextTakeover: true, // Defaults to negotiated value.
    serverNoContextTakeover: true, // Defaults to negotiated value.
    serverMaxWindowBits: 10, // Defaults to negotiated value.
    // Below options specified as default values.
    concurrencyLimit: 10, // Limits zlib concurrency for perf.
    threshold: 1024 // Size (in bytes) below which messages
    // should not be compressed.
  }
});

//Import Store.
console.log("========== Booting Up Project Vidura ==========");

import { actions, store } from "./redux/store";

function broadcastCurrentState() {
  const data = getCurrentState();
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
}

function getCurrentState() {
  return JSON.stringify({
    sender: "__REDUX_STORE_IN_NODE_SERVER",
    state: store.getState()
  });
}
store.subscribe(function() {
  broadcastCurrentState();
});
wss.on("connection", function connection(ws) {
  //Client is connected, first step - send him current state.
  ws.send(getCurrentState());

  ws.on("message", function incoming(message) {
    const messageData = JSON.parse(message);
    const [Reducer, method] = messageData.action.split("-");
    console.log("received from client: %s", messageData);
    actions[Reducer][method](messageData.data);
    //Sending it back,
  });
});
