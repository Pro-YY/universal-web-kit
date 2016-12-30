import React, { Component, PropTypes } from 'react'

class Html extends Component {
  render() {
    const { childrenMountId, children, head, serialized } = this.props
    return (
      <html>
        <head>
          { head.title.toComponent() }
          { head.meta.toComponent() }
          { head.style.toComponent() }
          { head.script.toComponent() }
        </head>
        <body>
          <div id={childrenMountId} dangerouslySetInnerHTML={{ __html: children }} />
          <script type="text/javascript" id="server-rendered-serialized" dangerouslySetInnerHTML={{ __html: serialized }} />
        </body>
      </html>
    )
  }
}

export default Html
