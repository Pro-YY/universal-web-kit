import 'babel-polyfill'
import path from 'path'
import http from 'http'
import express from 'express'
import logger from 'morgan'
import React from 'react'
import ReactDOM from 'react-dom/server'
import { resolve } from 'universal-router'
import serialize from 'serialize-javascript'

import assets from './assets' // only exists after build
import config from '../config'
import Html from './Html'
import { initHead } from './head'
import App from '../shared/components/App'
import routes from '../shared/routes'

import demoMockApiRouter from './demo-mock-api-router'

const app = express()
app.use(logger('dev'))

// mock api for demo item, feel free to remove
app.use('/demo-mock-api', demoMockApiRouter)

// static assets path for client.js
// use / for public is the most convenient approach for nginx serve static
app.use('/', express.static(path.join(__dirname, 'public')))
// webapp server pages
app.use(`/${config.WEBAPP_PREFIX}`, async (req, res, next) => {
  try {
    if (config.DISABLE_SERVER_RENDER) {
      // client render app only
      const html = `<html><head>` +
        `<script type="text/javascript" async src="${assets.main.js}"></script>` +
        `</head><body>` +
        `<div id="${config.WEBAPP_MOUNT_DOCROOT_ID}"></div>` +
        `</body></html>`
      return res.status(200).send(`<!doctype html>${html}`)
    }
    // router result
    const route = await resolve(routes, {
      path: req.baseUrl + req.path,
      query: req.query,
      fetch: true,
    })
    if (route.redirect) return res.redirect(route.status || 302, route.redirect)

    // set style into context, for defered css inject
    const css = new Set()
    const context = {
      insertCss: (...styles) => { styles.forEach(style => css.add(style._getCss())) },
    }

    const routeElement = <route.element.component {...route.element.props}/>
    const children = ReactDOM.renderToString(
      <App context={context}>
        <div id="app-container">
          <div id="delta-head"></div>
          <div id="route-component">{routeElement}</div>
        </div>
      </App>
    )

    const head = initHead({
      title: route.head.title || 'server init title',
      description: route.head.description || 'server init description',
      style: [...css].join(''),
      script: config.DISABLE_CLIENT_RENDER ? '' : assets.main.js,
    })

    const serialized = serialize({
      fetched: route.element.props.fetched
    }, {isJSON: true})
    const serializedJsString = `var __serializedObject__ = ${serialized};`

    const data = {
      head: head, children: children,
      childrenMountId: config.WEBAPP_MOUNT_DOCROOT_ID,
      serialized: serializedJsString,
    }
    const html = ReactDOM.renderToStaticMarkup(<Html {...data}/>)
    return res.status(200).send(`<!doctype html>${html}`)
  }
  catch (err) { next(err) }
})

app.use((req, res, next) => {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

app.use((err, req, res, next) => {
  console.log(err)
  res.status(err.status || 500).send(`${err.message}`)
})

const server = http.createServer(app)
const port = config.PORT
server.listen(port, () => {
  console.log(`server listening on port: ${port}`)
})
