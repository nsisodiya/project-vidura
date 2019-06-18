console.log('WebSocket client script will run here');
export default class WSConnection {
    constructor({ url }) {
        // Establish a WebSocket connection to the echo server
        this.ready = false;
        this._initialMessageQueue = [];
        this.ws = new WebSocket(url);
        this._callbacks = [];
        // Add a listener that will be triggered when the WebSocket is ready to use
        this.ws.addEventListener('open', () => {
            this.ready = true;
            this._initialMessageQueue.forEach(message => {
                this.send(message);
            });
            this._initialMessageQueue = [];
        });
        // Add a listener in order to process WebSocket messages received from the server
        this.ws.addEventListener('message', event => {
            // The `event` object is a typical DOM event object, and the message data sent
            // by the server is stored in the `data` property
            var message = JSON.parse(event.data);
            //console.log('Received:', message);
            this._spreadMessage(message);
        });
    }
    send(message) {
        //TODO - if connection is still not made, just put in queue
        if (this.ready) {
            console.log('Sending:', message);
            // Send the message to the WebSocket server
            this.ws.send(JSON.stringify(message));
        } else {
            this._initialMessageQueue.push(message);
        }
    }
    subscribe(callback) {
        this._callbacks.push(callback);
    }
    _spreadMessage(message) {
        this._callbacks.forEach(callback => {
            if (typeof callback === 'function') {
                callback(message);
            }
        });
    }
}
