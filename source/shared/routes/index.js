import { assert } from 'chai'

import config from '../config'

const topRoute = {
  path: config.WEBAPP_BASEURL,
  // Note: routes are evaluated in order
  children: [
    require('./home').default,
    require('./about').default,
    // wildcard routes, e.g. { path: '*', ... } (must go last)
    require('./not-found').default,
  ],
  async action({ next }) {
    const route = await next()
    assert(route.component || route.redirect)
    route.title = `${route.title || 'untitled page'}`
    route.description = `${route.description || 'undescribed page'}`
    return route
  },
}

export default topRoute
