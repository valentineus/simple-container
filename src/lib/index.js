import createDebug from 'debug';
import Docker from 'dockerode';
import { statSync } from 'fs';

/**
 * @class Container
 */
export default class Containers {
    /**
     * @constructs Container
     * @param {Object=} [options] - Service connection settings
     */
    constructor(options) {
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
            var socket = this._getSocket();
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
     * @param {String|Object} options - The name of the image or options
     * @returns {Promise} Returns the container object
     * @description Creates a container by options or name, returning the management interface.
     */
    create(options) {
        var self = this;

        if (!self._isString(options) && !self._isObject(options)) {
            throw new Error('');
        }

        if (self._isString(options)) {
            var Image = options;
            options = { Image };
        }

        return new Promise((resolve, reject) => {
            self._getImage(options.Image, (error) => {
                if (error) {
                    reject(error);
                }

                self._createContainer(options, (error, container) => {
                    if (error) {
                        reject(error);
                    }

                    resolve(container);
                });
            });
        });
    }

    /**
     * @protected
     * @param {String=} [id] - Container ID
     * @returns {Promise} Returns the container or container object
     * @description Returns the container management interface.
     */
    get(id) {
        var self = this;

        if (id && !self._isString(id)) {
            throw new Error('');
        }

        return new Promise((resolve, reject) => {
            self._getContainers((error, list) => {
                if (error) {
                    reject(error);
                }

                if (self._isString(id)) {
                    self._findContainer(list, id, (result) => {
                        resolve(self._getContainer(result.Id));
                    });
                }
                else {
                    self._createListContainers(list, (result) => {
                        resolve(result);
                    });
                }
            });
        });
    }

    /**
     * @protected
     * @param {String=} [id] - Container ID
     * @returns {Promise} Returns the container or container object
     * @description Searches in existing containers.
     */
    info(id) {
        var self = this;

        if (id && !self._isString(id)) {
            throw new Error('');
        }

        return new Promise((resolve, reject) => {
            self._getContainers((error, list) => {
                if (error) {
                    reject(error);
                }

                if (self._isString(id)) {
                    self._findContainer(list, id, (result) => {
                        resolve(result);
                    });
                }
                else {
                    self._createInformationList(list, (result) => {
                        resolve(result);
                    });
                }
            });
        });
    }

    /**
     * @protected
     * @param {Object} options - Settings created by the container
     * @param {Function} callback - Callback after creation
     * @description Creates a container and returns its interface.
     */
    _createContainer(options, callback) {
        this._docker.createContainer(options, (error, container) => {
            callback(error, container);
        });
    }

    /**
     * @protected
     * @param {Array} list - List of containers
     * @param {Function} callback - Callback after building the list
     * @description Creates a list of containers for the user.
     */
    _createInformationList(list, callback) {
        callback(list.reduce((result, item) => {
            result[item.Id] = item;
            return result;
        }, {}));
    }

    /**
     * @protected
     * @param {Array} list - List of containers
     * @param {Function} callback - Callback after building the list
     * @description Creates a list of container interfaces.
     */
    _createListContainers(list, callback) {
        var self = this;

        callback(list.reduce((result, item) => {
            result[item.Id] = self._getContainer(item.Id);
            return result;
        }, {}));
    }

    /**
     * @protected
     * @returns {String} Socket
     * @description Getting the system socket.
     */
    _getSocket() {
        return process.env.DOCKER_SOCKET || '/var/run/docker.sock';
    }

    /**
     * @protected
     * @param {Function} callback - Callback after receiving the list
     * @description Getting a list of all available containers in the system.
     */
    _getContainers(callback) {
        this._docker.listContainers({ all: true }, (error, list) => {
            callback(error, list);
        });
    }

    /**
     * @protected
     * @param {String} id - Container ID
     * @returns {Object} Container interface
     * @description Getting the interface of the container.
     */
    _getContainer(id) {
        return this._docker.getContainer(id);
    }

    /**
     * @protected
     * @param {String} image - The name of the image
     * @param {Function} callback - Callback after download
     * @description Load the image needed for the container.
     */
    _getImage(image, callback) {
        var self = this;

        self._docker.pull(image, (error, stream) => {
            if (error) {
                callback(error);
            }

            self._docker.modem.followProgress(stream, callback, self.debug);
        });
    }

    /**
     * @protected
     * @param {Array} list - List of containers
     * @param {String} id - Container ID
     * @param {Function} callback - Callback with the search result
     * @description Search for a specific container from the general list of containers.
     */
    _findContainer(list, id, callback) {
        list.find(item => {
            if (item.Id == id) {
                callback(item);
            }
        });
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
     * @param {*} Any variables
     * @description A simple debugger.
     */
    debug() {
        var args = Array.prototype.slice.call(arguments);
        var debug = createDebug('containers');
        debug.apply(null, args);
    }
}