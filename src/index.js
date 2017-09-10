"use strict";
exports.__esModule = true;
var Boom = require("boom");
var register = function (server, pOptions, next) {
    var origRoute = server.root.route;
    var innerRoute = function (options) {
        if (options.handler) {
            if (options.handler instanceof Function) {
                var t_1 = options.handler;
                options.handler = function (request, reply) {
                    var p = t_1(request, reply);
                    if (p && p["catch"]) {
                        p["catch"](function (e) {
                            console.error(e.stack);
                            console.error(e.toString());
                            reply(Boom.badGateway('server error'));
                        });
                    }
                };
            }
        }
        return origRoute.apply(server.root, [options]);
    };
    server.root.route = function (options) {
        if (Array.isArray(options)) {
            return options.map(function (option) { return innerRoute(option); });
        }
        return innerRoute(options);
    };
    Object.keys(origRoute).forEach(function (k) {
        server.root.route[k] = origRoute[k];
    });
    next();
};
exports.register = register;
register.attributes = {
    name: 'hapi-es7-async-handler',
    version: '1.0.0'
};
