let fetch = null
if (DEFINE_BROWSER) {
  fetch = require('./fetch.client')
}
else {
  fetch = require('./fetch.server')
}

export default fetch.fetch
export const Request = fetch.Request
export const Headers = fetch.Headers
export const Response = fetch.Response
