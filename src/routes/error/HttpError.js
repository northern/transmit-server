
export default class HttpError extends Error {
  constructor(response, code) {
    super(response.message)

    this.response = response
    this.code = code
  }
}
