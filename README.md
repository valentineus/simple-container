# Simple Container
[![NPM](https://img.shields.io/npm/v/simple-container.svg)](https://www.npmjs.com/package/simple-container)
[![Build Status](https://travis-ci.org/valentineus/simple-container.svg?branch=master)](https://travis-ci.org/valentineus/simple-container)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/286921416577421c98e5f77ce400926c)](https://www.codacy.com/app/valentineus/simple-container)
[![Codacy Coverage Badge](https://api.codacy.com/project/badge/Coverage/286921416577421c98e5f77ce400926c)](https://www.codacy.com/app/valentineus/simple-container/files)
[![Gitter Badge](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/valentineus/simple-container)

Simple and fast work with the Docker container.
Works great in
[Travis CI](https://travis-ci.org/)
for testing

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

containers.create('hello-world:latest').then(container => {
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

#### Third-party repository

An additional example of obtaining a private image:
```JavaScript
var auth = {
    serveraddress: 'https://index.docker.io/v1',
    email: 'email@example.org',
    username: 'username',
    password: 'password',
    auth: ''
};

containers.create({
    Image: 'project:latest',
    authconfig: auth
});
```

Details in
[the documentation](https://github.com/apocas/dockerode#pull-from-private-repos).

## API
<dl>
    <dt>
        <a href="#create">create(options)</a> ⇒ <code>Promise</code>
    </dt>
    <dd>
        <p>Creates a container by options or name, returning the management interface.</p>
    </dd>
    <dt>
        <a href="#get">get([id])</a> ⇒ <code>Promise</code>
    </dt>
    <dd>
        <p>Returns the container management interface.</p>
    </dd>
    <dt>
        <a href="#info">info([id])</a> ⇒ <code>Promise</code>
    </dt>
    <dd>
        <p>Searches in existing containers.</p>
    </dd>
</dl>

<a name="create"></a>

### create(options) ⇒ <code>Promise</code>
Creates a container by options or name, returning the management interface.

| Param | Type | Description |
| --- | --- | --- |
| options | <code>String</code> \ <code>Object</code> | The name of the image or options |

<a name="get"></a>

### get([id]) ⇒ <code>Promise</code>
Returns the container management interface.

| Param | Type | Description |
| --- | --- | --- |
| [id] | <code>String</code> | Container ID |

#### Examples:
```JavaScript
containers.get().then(containers => {
    /* containers - All containers in the system */
});

containers.get('5520e855dd2c301b23a718cf392f9619d1edc3dc0fa294559b725d7588ca807f').then(container => {
    /* container - The specified container */
});
```

<a name="info"></a>

### info([id]) ⇒ <code>Promise</code>
Searches in existing containers.

| Param | Type | Description |
| --- | --- | --- |
| [id] | <code>String</code> | Container ID |

#### Examples:
```JavaScript
containers.info().then(containers => {
    /* containers - All containers in the system */
});

containers.info('21ae4a54be582d13fffd796341b3561a8c8e0c59dd6c6c3239529188e2b3321d').then(container => {
    /* container - The specified container */
});
```

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