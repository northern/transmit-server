
export default class Body {
  constructor() {
    this.text = null
    this.html = null
  }

  serialize() {
    return Object.assign({}, this)
  }

  unserialize(data) {
    if (!data) {
      data = {}
    }

    this.text = data.text || null
    this.html = data.html || null
  }
}
