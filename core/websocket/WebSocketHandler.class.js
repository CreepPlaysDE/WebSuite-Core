'use strict';

// Create EventEmitter to proxy packets through the system
const Event = require('events');
class EventEmitter extends Event {}

/**
 * Class to work with packets in socket.io
 * */
class WebSocketHandler {

    constructor() {
        // Register Event-Emitter for CP-Events and Frontend-Events
        this._cpSocketEvents = new EventEmitter();
        this._socketEvents = new EventEmitter();

        // Listen for new messages from the master
        process.on('message', (message) => {
            // Parse Message to JSON-Object
            message = JSON.parse(message);

            // Check, if type of sent message from master is 'sioPacket'
            if(message.type === "sioPacket") {
                // Check, if packet-name starts with 'cp-'
                if(message.packet.data[0].startsWith('cp-')) {
                    if(message.packet.data[0] && message.clientID && message.packet.data[1]) {
                        this._cpSocketEvents.emit(message.packet.data[0], message.clientID, message.packet.data[1]);
                    } else {
                        // TODO: Error on undefined data
                    }
                } else {
                    if(message.packet.data[0] && message.clientID && message.packet.data[1]) {
                        this._socketEvents.emit(message.packet.data[0], message.clientID, message.packet.data[1]);
                    } else {
                        // TODO: Error on undefined data
                    }
                }
            }
        });
    }

    /**
     * Register a handler for a socket.io-packet sent from the control panel
     *
     * @param packetName name of the packet
     * @param handler(clientID, packet) Handler for the packet
     * */
    registerCpEvent(packetName, handler) {
        // TODO : Remove cp-prefix in packetName
        if(packetName && handler) {
            this._cpSocketEvents.on(packetName, handler);
        }
    }

    /**
     * Register a handler for a socket.io-packet sent from the frontend-page
     *
     * @param packetName name of the packet
     * @param handler(clientID, packet) Handler for the packet
     * */
    registerEvent(packetName, handler) {
        if(packetName && handler) {
            this._socketEvents.on(packetName, handler);
        }
    }
}

module.exports = new WebSocketHandler();