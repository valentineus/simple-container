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
     * @param {Object=} [options] - Service connection settings
     */
    constructor(options) {
        super();

        /**
         * @protected
         * @type {Object}
         * @description Docker class service management.
         * https://github.com/apocas/dockerode
         */
        this._docker = null;

        if (this._isObject(options)) {
            this._docker = new Docker(options);
        }
        else {
            var socket = process.env.DOCKER_SOCKET || '/var/run/docker.sock';
            var stats = statSync(socket);

            if (!stats.isSocket()) {
                throw new Error('Local service is not found.');
            }

            this._docker = new Docker({
                socketPath: socket
            });
        }
    }

    /**
     * @protected
     * @param {Object|String} options - Container parameters
     * @description Creates and registers a container in the system.
     */
    create(options) {
        var self = this;

        if (!self._isString(options) && !self._isObject(options)) {
            throw new Error('The variable \'options\' is not correct.');
        }

        if (self._isString(options)) {
            var Image = options;
            options = { Image };
        }

        self._pullImage(options.Image, (error) => {
            self._handlerError(error);
            self._createContainer(options);
        });
    }

    /**
     * @protected
     * @description Stops and destroys the container.
     */
    destroy() {}

    /**
     * @protected
     * @param {String} image - Name of the image
     * @param {Function} callback - Called function
     * @description Pulls out the image of the container.
     */
    _pullImage(image, callback) {
        var self = this;
        self._docker.pull(image).then(stream => {
            self._docker.modem.followProgress(stream, callback, self.debug);
        }).catch(error => self._handlerError(error));
    }

    /**
     * @protected
     * @param {Object} options - Container settings
     * @description Creating a container and registering management.
     */
    _createContainer(options) {
        var self = this;
        self._docker.createContainer(options).then(container => {
            /* @todo Class registration */
            self.debug(container);
        }).catch(error => self._handlerError(error));
    }

    /**
     * @protected
     * @param {*} value - The variable to check
     * @returns {Boolean} Result of checking
     * @description Checks the type of the variable.
     */
    _isString(value) {
        return typeof value === 'string';
    }

    /**
     * @protected
     * @param {*} value - The variable to check
     * @returns {Boolean} Result of checking
     * @description Checks the type of the variable.
     */
    _isObject(value) {
        return typeof value === 'object';
    }

    /**
     * @protected
     * @param {*} error - A string with an error
     * @description Handles the error if present.
     */
    _handlerError(error) {
        if (error) {
            throw new Error(error);
        }
    }

    /**
     * @param {*} Any variables
     * @description A simple debugger.
     */
    debug() {
        var args = Array.prototype.slice.call(arguments);
        var debug = createDebug('container');
        debug.apply(null, args);
    }
}