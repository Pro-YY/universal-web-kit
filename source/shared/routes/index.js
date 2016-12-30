import config from '../../config'

const topRoute = {
  path: '/' + config.WEBAPP_PREFIX,
  // Note: routes are evaluated in order
  children: [
    require('./home').default,
    require('./about').default,
    require('./demo-item').default,   // demo-items, feel free to remove
    // wildcard routes, e.g. { path: '*', ... } (must go last)
    require('./not-found').default,
  ],
  async action({ next }) {
    const route = await next()
    if (!(route.element || route.redirect)) {
      const error = new Error('route format error')
      throw error
    }
    return route
  },
}

export default topRoute
