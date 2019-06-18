//Import Store.
console.log('========== Booting Up Project Vidura ==========');

import { actions, store } from './redux/store';
//TODO - Load Store in the WebWorker and then communicate using POST Message API. no local stuff.
class BLLayer {
    constructor() {
        store.subscribe(() => {
            this.broadcastCurrentState();
        });
        //TODO UnSubscribe
        setTimeout(() => {
            this.broadcastCurrentState();
        }, 0);
    }
    broadcastCurrentState() {
        const state = store.getState();
        console.log('New State', state);
        var data = {
            state
        };
        if (typeof this.callback === 'function') {
            this.callback(data);
        }
    }
    send(messageData) {
        const [Reducer, method] = messageData.action.split('-');
        console.log('received from client: %s', messageData);
        actions[Reducer][method](messageData.data);
    }
    subscribe(callback) {
        console.log('BL LAyer subscribe function called');
        this.callback = callback;
    }
}
window.BLLayer = BLLayer;
export { store, actions };
export default BLLayer;
