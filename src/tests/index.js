import { assert } from 'chai';

import Containers from '../lib/index';

describe('simple-container:', () => {
    it('simple', (done) => {
        var containers = new Containers();
        var image = 'hello-world:latest';

        containers.create(image).then(container => {
            if (container) {
                done();
            }
        });
    });
});