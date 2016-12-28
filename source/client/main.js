import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import FastClick from 'fastclick'   // TODO verify working?
import { resolve } from 'universal-router'
import queryString from 'query-string'

import history from '../shared/core/history'
import App from '../shared/components/App'


console.log('history in browser: ' + process.env.BROWSER)
console.log(history)

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

function updateTag(tagName, keyName, keyValue, attrName, attrValue) {
  const node = document.head.querySelector(`${tagName}[${keyName}="${keyValue}"]`);
  if (node && node.getAttribute(attrName) === attrValue) return;

  // Remove and create a new tag in order to make it work with bookmarks in Safari
  if (node) {
    node.parentNode.removeChild(node);
  }
  if (typeof attrValue === 'string') {
    const nextNode = document.createElement(tagName);
    nextNode.setAttribute(keyName, keyValue);
    nextNode.setAttribute(attrName, attrValue);
    document.head.appendChild(nextNode);
  }
}
function updateMeta(name, content) {
  updateTag('meta', 'name', name, 'content', content);
}
function updateCustomMeta(property, content) { // eslint-disable-line no-unused-vars
  updateTag('meta', 'property', property, 'content', content);
}
function updateLink(rel, href) { // eslint-disable-line no-unused-vars
  updateTag('link', 'rel', rel, 'href', href);
}

// TODO how the scroll work?

// Switch off the native scroll restoration behavior and handle it manually
// https://developers.google.com/web/updates/2015/09/history-api-scroll-restoration
const scrollPositionsHistory = {};
if (window.history && 'scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

let onRenderComplete = function initialRenderComplete() {
  console.log('initial render complete')
  const elem = document.getElementById('css')
  if (elem) elem.parentNode.removeChild(elem)
  onRenderComplete = function renderComplete(route, location) {
    console.log('on render complete')
    document.title = route.title;

    updateMeta('description', route.description);
    // Update necessary tags in <head> at runtime here, ie:
    // updateMeta('keywords', route.keywords);
    // updateCustomMeta('og:url', route.canonicalUrl);
    // updateCustomMeta('og:image', route.imageUrl);
    // updateLink('canonical', route.canonicalUrl);
    // etc.

    let scrollX = 0;
    let scrollY = 0;
    const pos = scrollPositionsHistory[location.key];
    if (pos) {
      scrollX = pos.scrollX;
      scrollY = pos.scrollY;
    } else {
      const targetHash = location.hash.substr(1);
      if (targetHash) {
        const target = document.getElementById(targetHash);
        if (target) {
          scrollY = window.pageYOffset + target.getBoundingClientRect().top;
        }
      }
    }

    // Restore the scroll position if it was saved into the state
    // or scroll to the given #hash anchor
    // or scroll to top of the page
    window.scrollTo(scrollX, scrollY);

  }
}

// Make taps on links and buttons work fast on mobiles
FastClick.attach(document.body)

const container = document.getElementById('app')
let appInstance
let currentLocation = history.location
let routes = require('../shared/routes').default

// Re-render the app when window.location changes
async function onLocationChange(location) {
  console.log('location changed: ')
  console.log(location)
  // Remember the latest scroll position for the previous location
  scrollPositionsHistory[currentLocation.key] = {
    scrollX: window.pageXOffset,
    scrollY: window.pageYOffset,
  };
  // Delete stored scroll position for next page if any
  if (history.action === 'PUSH') {
    delete scrollPositionsHistory[location.key];
  }
  currentLocation = location

  try {
    // Traverses the list of routes in the order they are defined until
    // it finds the first route that matches provided URL path string
    // and whose action method returns anything other than `undefined`.
    console.log('client route path: ' + location.pathname)
    const route = await resolve(routes, {
      path: location.pathname,
      query: queryString.parse(location.search),
    })
    console.log(route)

    // Prevent multiple page renders during the routing process
    if (currentLocation.key !== location.key) {
      console.log('route processing... ignored')
      return
    }

    if (route.redirect) {
      history.replace(route.redirect)
      return
    }

    console.log('client render')
    appInstance = ReactDOM.render(
      <App context={context}>{route.component}</App>,
      container,
      () => onRenderComplete(route, location),
    )
  } catch (error) {
    console.error(error) // eslint-disable-line no-console

    // Current url has been changed during navigation process, do nothing
    if (currentLocation.key !== location.key) {
      return;
    }

    // Display the error in full-screen for development mode
    /* TODO
    if (process.env.NODE_ENV !== 'production') {
      appInstance = null;
      document.title = `Error: ${error.message}`;
      ReactDOM.render(<ErrorReporter error={error} />, container);
      return;
    }
    */

    // Avoid broken navigation in production mode by a full page reload on error
    window.location.reload()
  }
}

// Handle client-side navigation by using HTML5 History API
// For more information visit https://github.com/mjackson/history#readme
history.listen(onLocationChange)
onLocationChange(currentLocation)
