
export default class TransmissionTarget {
  public email: string | null
  public phone: string | null
  public push: object | null
  public callback: string | null
  public chat: object | null
  public vars: object | null

  constructor() {
    this.email = null
    this.phone = null
    this.push = null
    this.callback = null
    this.chat = null
    this.vars = null
  }
}
