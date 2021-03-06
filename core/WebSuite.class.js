'use strict';

const Logger = require('./logger/Logger.class');

const WebSocketHandler = require('./websocket/WebSocketHandler.class');
const WebServer  = require('./webserver/WebServer.class');

const Database = require('./database/Database.class');
const Mail = require('./mail/Mail.class');

const User = require('./user/User.class');

/**
 * Class of core-module
 * */
class WebSuite {

    constructor(callback) {
        this.getLogger().info(`Starting worker ${process.pid}`);
        this._database = new Database(databaseConnected => {
            if(!databaseConnected) {
                callback(false);
                return;
            }

            this._mail = new Mail(mailConnected => {
                if(!mailConnected) {
                    callback(false);
                    return;
                }

                callback(true);

                // TODO: Remove test when tests ready
                this.getUser(1);
            })
        });
    }

    /**
     * Get WebSocketHandler to register new Socket-Events
     *
     * @returns WebSocketHandler-class
     * */
    getWebSocketHandler() {
        return WebSocketHandler;
    }

    /**
     * Get the web-server to let him listen, when system is started
     *
     * @returns WebServer-class
     *
     * @private
     * */
    _getWebServer() {
        return WebServer;
    }

    /**
     * Get the Logger to log information, errors, warnings and debug
     *
     * @returns Logger Logger-class
     * */
    getLogger() {
        return Logger;
    }

    /**
     * Get Database-Class to send database-queries
     *
     * @returns Database-class
     * */
    getDatabase() {
        return this._database;
    }

    /**
     * Get Mail-Class to send emails
     *
     * @returns Mail-class
     * */
    getMail() {
        return this._mail;
    }

    /**
     * Get User-Class to work with the User
     *
     * @param userID userID of the User
     *
     * @returns User
     * */
    getUser(userID) {
        return new User(userID);
    }

}

module.exports = WebSuite;