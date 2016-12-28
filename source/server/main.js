import 'babel-polyfill'
import path from 'path'
import http from 'http'
import express from 'express'
import logger from 'morgan'
import React from 'react'
import ReactDOM from 'react-dom/server'
import { resolve } from 'universal-router'

import assets from './assets' // after build only
import Html from './Html'
import config from '../shared/config'
import App from '../shared/components/App'
import routes from '../shared/routes'

import HomePage from '../shared/components/containers/pages/Home'
import AboutPage from '../shared/components/containers/pages/About'

const app = express()
app.use(logger('dev'))

app.get('/hello', (req, res, next) => {
  res.end('hello, world!\n')
})

// static assets path for client.js
app.use('/static', express.static(path.join(__dirname, 'public')))
// mount webapp
app.use(config.WEBAPP_BASEURL, async (req, res, next) => {
  try {
    // router result
    console.log(`server route path: ${req.baseUrl + req.path}`)
    const route = await resolve(routes, {
      path: req.baseUrl + req.path,
      query: req.query,
    })
    if (route.redirect) return res.redirect(route.status || 302, route.redirect)

    const data = {...route}
    // set style into context, for defered css inject
    const css = new Set()
    // Global (context) variables that can be easily accessed from any React component
    // https://facebook.github.io/react/docs/context.html
    const context = {
      // Enables critical path CSS rendering
      // https://github.com/kriasoft/isomorphic-style-loader
      insertCss: (...styles) => { styles.forEach(style => css.add(style._getCss())) },
    }

    data.children = ReactDOM.renderToString(
      <App context={context}>
        {route.component}
      </App>
    )
    data.style = [...css].join('')
    data.script = assets.main.js
    const html = ReactDOM.renderToStaticMarkup(<Html {...data}/>)
    res.status(200).send(`<!doctype html>${html}`)
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
server.listen(3000, () => {
  console.log(`server listens on: 3000`)
})
