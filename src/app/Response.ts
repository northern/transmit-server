
export default class Response {
  static get OK() { return 'ok'}
  static get ERROR() { return 'error'}
  static get INVALID() { return 'invalid' }

  status: string

  constructor(status: string = Response.OK) {
    this.status = status
  }
}
