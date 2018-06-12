
export default class Defaults {
  constructor() {
    this.title = null
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
    this.body = data.body || null
  }
}
