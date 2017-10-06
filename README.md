# Simple Container
[![NPM](https://img.shields.io/npm/v/simple-container.svg)](https://www.npmjs.com/package/simple-container)
[![Build Status](https://travis-ci.org/valentineus/simple-container.svg?branch=master)](https://travis-ci.org/valentineus/simple-container)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/286921416577421c98e5f77ce400926c)](https://www.codacy.com/app/valentineus/simple-container)
[![Codacy Coverage Badge](https://api.codacy.com/project/badge/Coverage/286921416577421c98e5f77ce400926c)](https://www.codacy.com/app/valentineus/simple-container/files)
[![Gitter Badge](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/valentineus/simple-container)

Simple and fast work with the Docker container.

It uses the library
[dockerode](https://github.com/apocas/dockerode).

## Installation
```bash
npm install --save simple-container
```

## Using
A simple example that creates and starts a container:
```JavaScript
import Containers from 'simple-container';

var containers = new Containers();

containers.create('postgres:alpine').then(container => {
    console.info(`The ${container.id} container was created.`);
    start(container);
});

/* Run the created container */
function start(container) {
    container.start().then(() => {
        console.info(`The ${container.id} container is running.`);
    });
}
```

### Remote connection
By default, the local service is used.

For example, if you want to use connection settings:
```JavaScript
var containers = new Containers({
    host: '127.0.0.1',
    port: 3000
});
```

Examples and details in
[the documentation](https://github.com/apocas/dockerode#getting-started).

### Creating a container
You can create a container in two ways.

A simple way - to specify the name of the image:
```JavaScript
containers.create('hello-world:latest');
```

Another way - to provide an object with parameters:
```JavaScript
containers.create({
    Image: 'postgres:alpine',
    Env: ['POSTGRES_PASSWORD = password'],
    Ports: [{
        IP: '0.0.0.0',
        PrivatePort: 5432,
        PublicPort: 5432,
        Type: 'tcp'
    }]
});
```

Examples and details in
[the documentation](https://github.com/apocas/dockerode#manipulating-a-container).

An additional example of obtaining a private image:
```JavaScript
var auth = {
    username: 'username',
    password: 'password',
    email: 'email@example.org',
    serveraddress: 'https://index.docker.io/v1'
};

containers.create({
    Image: 'project:latest',
    authconfig: auth
});
```

Details in
[the documentation](https://github.com/apocas/dockerode#pull-from-private-repos).

## Debugging
Use the `DEBUG` variable with the `containers` option.

Result of output:
```bash
$ DEBUG="containers" node ./example.js
  container { status: 'Pulling from library/postgres', id: 'alpine' } +0ms
  container { status: 'Already exists',
  container   progressDetail: {},
  container   id: '019300c8a437' } +0ms
  container { status: 'Pulling fs layer',
  container   progressDetail: {},
  container   id: '885fa9f8b950' } +0ms
...
```

Or redefine the function to your own:
```JavaScript
containers.debug = function() {
    var args = Array.prototype.slice.call(arguments);
    /* Debugger code */
}
```

## License
[![JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/eslint/eslint)

[MIT](LICENSE.md).
Copyright (c)
[Valentin Popov](mailto:info@valentineus.link).