import { assert } from 'chai';

import Containers from '../lib/index';

describe('simple-container:', () => {
    var image = 'alpine:latest';
    var containers = null;
    var container = null;

    before(() => {
        containers = new Containers();
    });

    after((done) => {
        /* Removing the container after testing */
        container.remove().then(() => {
            done();
        });
    });

    it('create(image)', (done) => {
        containers.create(image).then((item) => {
            assert.isObject(item);
            container = item;
            done();
        });
    });

    it('info(id)', (done) => {
        containers.info(container.id).then((item) => {
            assert.equal(item.Id, container.id);
            assert.equal(item.Image, image);
            assert.isObject(item);
            done();
        });
    });

    it('info()', (done) => {
        containers.info().then((list) => {
            var item = list[container.id];
            assert.equal(item.Id, container.id);
            assert.equal(item.Image, image);
            assert.isObject(item);
            done();
        });
    });

    it('get(id)', (done) => {
        containers.get(container.id).then((item) => {
            assert.deepEqual(container, item);
            done();
        });
    });

    it('get()', (done) => {
        containers.get().then((list) => {
            assert.deepEqual(container, list[container.id]);
            done();
        });
    });
});