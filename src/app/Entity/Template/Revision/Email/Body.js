
export default class Body {
  constructor() {
    this.text = null
    this.html = null
  }

  serialize() {
    return Object.assign({}, this)
  }

  unserialize(data) {
    this.text = data.text || this.text
    this.html = data.html || this.html

    return this
  }
}
