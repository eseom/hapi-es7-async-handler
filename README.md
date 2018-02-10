# NOTE

Note: This library is no longer needed since hapi17. This feature has been included as standard since hapi 17. You can use this plugin up to version 16 hapijs.

See the link below.
  
https://github.com/hapijs/hapi/issues/3429

# hapi-es7-async-handler

> async handler support for hapijs apps

[![npm version][npm-badge]][npm-url]


You can use this plugin to add async handler function to your hapi projects.

# requiements
You need es7 supported javascript development environment or use Typescript


# Usage

Example:
```js
const server = new Hapi.server()

const plugins = [
  ...
  {
    register: require('hapi-es7-async-handler'),
  },
  ...
];

server.register(plugins, (err) => {
  ...
})
server.route({
  path: '/',
  method: 'get',
  handler: async (request, reply) => {
    ...
    const result = await yourAsyncJob(); // the async job might be returning Promise object
    reply(result);
  }
});
```

[npm-url]: https://www.npmjs.com/package/hapi-es7-async-handler
[npm-badge]: https://img.shields.io/npm/v/hapi-es7-async-handler.svg
