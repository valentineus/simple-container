import { Item } from 'ancient-funicular';
import createDebug from 'debug';
import Docker from 'dockerode';
import { statSync } from 'fs';

/**
 * @class Container
 */
export default class Container extends Item {
    /**
     * @constructs Container
     * @param {Object} options
     */
    constructor(options) {
        super();

        /**
         * @protected
         * @type {Object}
         * @description
         */
        this._docker = null;

        if (this._isObject(options)) {
            this._docker = new Docker(options);
        }
        else {
            var socket = process.env.DOCKER_SOCKET || '/var/run/docker.sock';
            var stats = statSync(socket);

            if (!stats.isSocket()) {
                throw new Error('');
            }

            this._docker = new Docker({
                socketPath: socket
            });
        }
    }

    /**
     * @protected
     * @param {Object|String} options
     * @description
     */
    create(options) {
        var self = this;
        var name = null;

        if (!self._isString(options) && !self._isObject(options)) {
            throw new Error('The variable \'options\' is not correct.');
        }

        if (self._isString(options)) {
            name = options;
            options = { Image: name };
        }

        if (self._isObject(options)) {
            name = options.Image;
        }

        self._pullImage(name, (error) => {
            self._handlerError(error);
            self._createContainer(options);
        });
    }

    /**
     * @protected
     * @description
     */
    destroy() {}

    /**
     * @protected
     * @param {String} name
     * @param {Function} callback
     * @description
     */
    _pullImage(name, callback) {
        var self = this;
        self._docker.pull(name).then(stream => {
            self._docker.modem.followProgress(stream, callback, self.debug);
        }).catch(error => self._handlerError(error));
    }

    /**
     * @protected
     * @param {Object} options
     * @description
     */
    _createContainer(options) {
        var self = this;
        self._docker.createContainer(options).then(container => {
            /* @todo Регистрация класса */
        }).catch(error => self._handlerError(error));
    }

    /**
     * @protected
     * @param {*} value - The variable to check
     * @returns {Boolean} Result of checking
     * @description Checks the type of the variable
     */
    _isString(value) {
        return typeof value === 'string';
    }

    /**
     * @protected
     * @param {*} value - The variable to check
     * @returns {Boolean} Result of checking
     * @description Checks the type of the variable
     */
    _isObject(value) {
        return typeof value === 'object';
    }

    /**
     * @protected
     * @param {*} error
     * @description
     */
    _handlerError(error) {
        if (!!error) {
            throw new Error(error);
        }
    }

    /**
     * @protected
     * @param {*}
     * @description
     */
    debug() {
        var args = Array.prototype.slice.call(arguments);
        var debug = createDebug('container');
        debug.apply(null, args);
    }
}