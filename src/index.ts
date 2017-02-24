import Boom from 'boom'
import * as Hapi from 'hapi'

export interface IRegister {
  (server: Hapi.Server, options: any, next: any): void
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

const register: IRegister = (server: Hapi.Server, pOptions, next: () => {}) => {
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
    return server.origRoute.apply(server, [options])
  }

  server.__proto__.origRoute = server.__proto__.route
  server.__proto__.route = (options: Object) => {
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
