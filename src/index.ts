import * as Boom from 'boom'
import * as Hapi from 'hapi'

export interface IRegister {
  (plugin: any, options: any, next: any): void
  attributes?: any
}

export interface Options {
  handler?: any
}

declare module 'hapi' {
  export interface Server {
    origRoute: any
    __proto__: any
  }
}

const register: IRegister = (plugin, pOptions, next: () => {}) => {
  const server = pOptions.server
  const origRoute = server.route
  const innerRoute = (options: Options) => {
    if (options.handler) {
      if (options.handler instanceof Function) {
        const t = options.handler
        options.handler = (request, reply) => {
          const p = t(request, reply)
          if (p && p.catch) {
            p.catch((e) => {
              console.error(e.stack)
              console.error(e.toString())
              reply(Boom.badGateway('server error'))
            })
          }
        }
      }
    }
    return origRoute.apply(server, [options])
  }

  server.route = (options: Object) => {
    if (Array.isArray(options)) {
      return options.map(option => innerRoute(option))
    }
    return innerRoute(options)
  }
  next()
}

register.attributes = {
  name: 'hapi-es7-async-handler',
  version: '1.0.0',
}

export {
  register,
}
