import React, { Component, PropTypes } from 'react'

class Html extends Component {
  /* TODO react static proptype checking not work?
  static propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    style: PropTypes.string,
    script: PropTypes.string,
    children: PropTypes.string,
  }
  */
  render() {
    const { title, description, style, script, children } = this.props
    return (
      <html>
        <head>
          <title>{title}</title>
          <meta charSet="utf-8"/>
          <meta name="description" content={description}/>
          {style && <style type="text/css" id="css" dangerouslySetInnerHTML={{ __html: style }} />}
        </head>
        <body>
          <div id="app" dangerouslySetInnerHTML={{ __html: children }} />
          {script && <script type="text/javascript" async src={script} />}
        </body>
      </html>
    )
  }
}

export default Html
