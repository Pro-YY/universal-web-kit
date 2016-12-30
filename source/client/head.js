import React from 'react'
import ReactDOM from 'react-dom'
import Helmet from 'react-helmet'

export function updateHead(args, container, onChange, callback) {
  const { title, description } = args
  ReactDOM.render(
    <Helmet
      title={title}
      meta={[
        {name: 'description', content: description},
      ]}
      onChangeClientState={onChange}
    />,
    container,
    callback,
  )
}
