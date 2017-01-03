import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import FastClick from 'fastclick'   // TODO verify working?
import { resolve } from 'universal-router'
import queryString from 'query-string'

import config from '../config'
import history from '../utils/history'
import { updateHead } from './head'
import App from '../shared/components/App'

// Global (context) variables that can be easily accessed from any React component
// https://facebook.github.io/react/docs/context.html
const context = {
  // Enables critical path CSS rendering
  // https://github.com/kriasoft/isomorphic-style-loader
  insertCss: (...styles) => {
    // eslint-disable-next-line no-underscore-dangle
    const removeCss = styles.map(x => x._insertCss())
    return () => { removeCss.forEach(f => f()) }
  },
}

// Switch off the native scroll restoration behavior and handle it manually
// https://developers.google.com/web/updates/2015/09/history-api-scroll-restoration
const scrollPositionsHistory = {}
if (window.history && 'scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual'
}

/*
 * ReactDOM.render callback
 * change page head and scroll that ReactDOM.render cannot treat
 * 1. init: remove server-side-rendered css (in head)
 * 2. update head
 * 3. update scroll
 */
let onRenderComplete = function initialRenderComplete() {
  // after first ssr, remove originl server-rendered css, because later client.js will load bundled css module
  // first render complete, clean server rendered stuff
  firstRender = false
  const cssElem = document.getElementById('server-rendered-css')
  if (cssElem) cssElem.parentNode.removeChild(cssElem)
  const serilizedElem = document.getElementById('server-rendered-serialized')
  if (serilizedElem) serilizedElem.parentNode.removeChild(serilizedElem)

  onRenderComplete = function renderComplete(route, location) {
    updateHead(
      route.head,
      document.getElementById("delta-head"),
      //(newState) => console.log(newState),
      //() => { console.log('html head rerendered')},
    )

    let scrollX = 0
    let scrollY = 0
    const pos = scrollPositionsHistory[location.key]
    if (pos) {
      scrollX = pos.scrollX
      scrollY = pos.scrollY
    }
    else {
      const targetHash = location.hash.substr(1)
      if (targetHash) {
        const target = document.getElementById(targetHash)
        if (target) {
          scrollY = window.pageYOffset + target.getBoundingClientRect().top
        }
      }
    }

    // Restore the scroll position if it was saved into the state
    // or scroll to the given #hash anchor
    // or scroll to top of the page
    window.scrollTo(scrollX, scrollY)
  }
}

// Make taps on links and buttons work fast on mobiles
FastClick.attach(document.body)

let appInstance
let currentLocation = history.location
let routes = require('../shared/routes').default

let firstRender = true

// Re-render the app when window.location changes
async function onLocationChange(location) {
  // Remember the latest scroll position for the previous location
  scrollPositionsHistory[currentLocation.key] = {
    scrollX: window.pageXOffset,
    scrollY: window.pageYOffset,
  }
  // Delete stored scroll position for next page if any
  if (history.action === 'PUSH') {
    delete scrollPositionsHistory[location.key]
  }
  currentLocation = location

  try {
    // Traverses the list of routes in the order they are defined until
    // it finds the first route that matches provided URL path string
    // and whose action method returns anything other than `undefined`.
    let needFetch = true
    if (firstRender
        && typeof(__serializedObject__) !== 'undefined'
        && __serializedObject__.fetched) {
      needFetch = false
    }

    const route = await resolve(routes, {
      path: location.pathname,
      query: queryString.parse(location.search),
      fetch: needFetch,
    })

    // Prevent multiple page renders during the routing process
    if (currentLocation.key !== location.key) {
      console.log('route processing... ignored')
      return
    }

    if (route.redirect) {
      history.replace(route.redirect)
      return
    }

    let routeElement = null
    if (needFetch) {
      routeElement = <route.element.component {...route.element.props}/>
    }
    else {
      let routeElementProps = {
        ...route.element.props,
        fetched: __serializedObject__.fetched,
      }
      routeElement = <route.element.component {...routeElementProps}/>
    }
    appInstance = ReactDOM.render(
      <App context={context}>
        <div id="app-container">
          <div id="delta-head"></div>
          <div id="route-component">{routeElement}</div>
        </div>
      </App>,
      document.getElementById(config.WEBAPP_MOUNT_DOCROOT_ID),
      () => onRenderComplete(route, location),
    )
  } catch (error) {
    console.error(error) // eslint-disable-line no-console

    // Current url has been changed during navigation process, do nothing
    if (currentLocation.key !== location.key) {
      return
    }

    // Display the error in full-screen for development mode
    /* TODO
    if (process.env.NODE_ENV !== 'production') {
      appInstance = null
      document.title = `Error: ${error.message}`
      ReactDOM.render(<ErrorReporter error={error} />, container)
      return
    }
    */

    // Avoid broken navigation in production mode by a full page reload on error
    //window.location.reload()
  }
}

// Handle client-side navigation by using HTML5 History API
// For more information visit https://github.com/mjackson/history#readme
history.listen(onLocationChange)
onLocationChange(currentLocation)
