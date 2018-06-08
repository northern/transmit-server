
export default class Response {
  static get OK() { return 'ok'}
  static get ERROR() { return 'error'}
  static get INVALID() { return 'invalid' }

  constructor() {
    this.status = Response.OK
  }
}
