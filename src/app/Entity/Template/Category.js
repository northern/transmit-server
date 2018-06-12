
export default class Category {
  constructor(name = null, title = "None") {
    this.name = name
    this.title = title
  }

  serialize() {
    return Object.assign({}, this)
  }

  unserialize(data) {
    if (!data) {
      data = {}
    }

    this.name = data.name || null
    this.title = data.title || "None"
  }
}
