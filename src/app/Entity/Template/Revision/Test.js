
export default class Test {
  constructor() {
    this.vars = null
  }

  serialize() {
    return Object.assign({}, this)
  }

  unserialize(data) {
    if (!data) {
      data = {}
    }

    this.vars = data.vars || null
  }
}
