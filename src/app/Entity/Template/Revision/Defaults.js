
export default class Defaults {
  constructor() {
    this.title = null
    this.body = null
  }

  serialize() {
    return Object.assign({}, this)
  }

  unserialize(data) {
    this.title = data.title || this.title
    this.body = data.body || this.body

    return this
  }
}
