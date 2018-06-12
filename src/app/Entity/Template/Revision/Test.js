
export default class Test {
  constructor() {
    this.vars = null
  }

  serialize() {
    return Object.assign({}, this)
  }

  unserialize(data) {
    this.vars = data.vars || this.vars

    return this
  }
}
