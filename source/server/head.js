import React from 'react'
import ReactDOM from 'react-dom/server'
import Helmet from 'react-helmet'

export function initHead(args) {
  const { title, description, style, script } = args
  // NOTE: server rendered css will be removed and changed by client after ssr, see client.js
  let helmet = ReactDOM.renderToString(
    <Helmet
      title={title}
      meta={[
        {name: 'charset', content: 'utf-8'},
        {name: 'description', content: description},
      ]}
      style={[
        {type: 'text/css', id: 'server-rendered-css', cssText: style},
      ]}
      script={[
        {type: 'text/javascript', async: true, src: script},
      ]}
    />
  )
  helmet = Helmet.rewind()   // or will memory leak
  return helmet
}
