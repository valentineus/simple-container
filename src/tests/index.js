import { assert } from 'chai';

import Containers from '../lib/index';

describe('simple-container:', () => {
    var container = null;

    before((done) => {
        var containers = new Containers();
        var image = 'hello-world:latest';

        containers.create(image).then(item => {
            container = item;
            done();
        });
    });

    after((done) => {
        container.stop(() => {
            container.remove(() => {
                done();
            });
        });
    });

    it('simple', () => {
        assert.isString(container.id);
    });
});