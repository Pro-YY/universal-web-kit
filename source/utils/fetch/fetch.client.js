import 'whatwg-fetch'

export const fetch = self.fetch.bind(self)
export const Headers = self.Headers
export const Request = self.Request
export const Response = self.Response
