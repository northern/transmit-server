
export default class Push {
  constructor() {
    this.title = null
    this.from = null
    this.body = null
  }

  serialize() {
    return Object.assign({}, this)
  }

  unserialize(data) {
    this.title = data.title || this.title
    this.from = data.from || this.from
    this.body = data.body || this.body

    return this
  }
}
