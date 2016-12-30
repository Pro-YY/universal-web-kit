import React, { PropTypes } from 'react'

import history from '../../../utils/history'
import config from '../../../config'

function isLeftClickEvent(event) {
  return event.button === 0
}

function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)
}

class Link extends React.Component {
  static propTypes = {
    to: PropTypes.string.isRequired,
    children: PropTypes.node,
    onClick: PropTypes.func,
  }

  handleClick = (event) => {
    if (this.props.onClick) {
      this.props.onClick(event)
    }

    if (isModifiedEvent(event) || !isLeftClickEvent(event)) {
      return
    }

    if (event.defaultPrevented === true) {
      return
    }

    event.preventDefault()

    const dest = this.props.to
    const curr = history.location.pathname
    if (dest === curr) {
      history.replace(dest)
      return
    }

    const origin = config.EXTERNAL_URL || null // web external endpoint url like: https://example.com

    if (dest.startsWith(origin)) {
      const localDest = dest.replace(origin, '')
      if (localDest === curr) history.replace(localDest)
      else history.push(localDest)
    }
    else {
      history.push(dest)
    }
  }

  render() {
    const { to, children, ...props } = this.props
    return <a href={to} {...props} onClick={this.handleClick}>{children}</a>
  }
}

export default Link
