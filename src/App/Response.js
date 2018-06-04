
export default class Response {
  static get OK() { return 'OK'}
  static get ERROR() { return 'ERROR'}

  constructor() {
    this.status = Response.OK
  }
}
