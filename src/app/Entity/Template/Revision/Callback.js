
export default class Callback {
  constructor() {
    this.title = null
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

    this.title = data.title || null
    this.from = data.from || null
    this.body = data.body || null
  }
}
