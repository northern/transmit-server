
export default class Sms {
  constuctor() {
    this.from = null
    this.body = null
  }

  serialize() {
    return Object.assign({}, this)
  }

  unserialize(data) {
    this.from = data.from || this.from
    this.body = data.body || this.body

    return this
  }
}
