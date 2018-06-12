
export default class Sms {
  constuctor() {
    this.from = null
    this.body = null
  }

  serialize() {
    return Object.assign({}, this)
  }

  unserialize(data) {
    if (!data) {
      data = {}
    }

    this.from = data.from || null
    this.body = data.body || null
  }
}
