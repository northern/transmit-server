
export default class Category {
  constructor(name = null, title = "None") {
    this.name = name
    this.title = title
  }

  serialize() {
    return Object.assign({}, this)
  }

  unserialize(data) {
    this.name = data.name || this.name
    this.title = data.title || this.title
    
    return this
  }
}
