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
  }
}

const register: IRegister = (server, pOptions, next: () => {}) => {
  const origRoute = server.root.route
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

  server.root.route = (options: Object) => {
    if (Array.isArray(options)) {
      return options.map(option => innerRoute(option))
    }
    return innerRoute(options)
  }
  Object.keys(origRoute).forEach((k) => {
    server.root.route[k] = origRoute[k]
  })

  next()
}

register.attributes = {
  name: 'hapi-es7-async-handler',
  version: '1.0.0',
}

export {
  register,
}
