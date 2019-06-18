import './bl-layer';

import React, { Component } from 'react';

import JSONViewer from 'react-json-viewer';
import WSConnection from './WSConnection';

function asyncSetTimeout(callback, delay) {
    return new Promise(function(resolve) {
        window.setTimeout(function() {
            callback();
            resolve();
        }, delay);
    });
}
async function Simulate() {
    await asyncSetTimeout(function(params) {
        window.connection.send({
            action: 'Todos-addTodo',
            data: 'Learn WebSocket'
        });
    }, 1000);
    await asyncSetTimeout(function(params) {
        window.connection.send({ action: 'Todos-addTodo', data: 'Write Book' });
    }, 1000);
    await asyncSetTimeout(function(params) {
        window.connection.send({
            action: 'Todos-addTodo',
            data: 'Visit Shenzhen'
        });
    }, 1000);
    await asyncSetTimeout(function(params) {
        window.connection.send({ action: 'Todos-completeTodo', data: 0 });
    }, 1000);
}

Simulate();
const BLLayer = window.BLLayer;
//var mode = 'production';
var mode = 'dev';

export default class App extends Component {
    state = { data: {} };
    componentDidMount() {
        var self = this;
        if (mode === 'production') {
            this.conn = new BLLayer();
        } else {
            this.conn = new WSConnection({
                url: 'ws://localhost:3211'
            });
        }
        window.connection = this.conn;
        this.conn.subscribe(function(message) {
            console.log('Received Message:', message);
            self.setState({ data: message.state });
        });
    }
    render() {
        return (
            <div className="App">
                <h1>State Tree will be auto-updated using WebSocket</h1>
                <JSONViewer json={this.state.data} />
            </div>
        );
    }
}
