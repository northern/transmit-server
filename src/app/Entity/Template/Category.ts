
export default class Category {
  name: string | null
  title: string | null

  constructor(name: string | null = null, title: string | null = null) {
    this.name = name
    this.title = title
  }

  serialize() {
    return Object.assign({}, this)
  }

  unserialize(data: object | null): void {
    if (!data) {
      data = {}
    }

    const map: Map<string, string> = new Map(Object.entries(data))

    this.name = map.get('name') || null
    this.title = map.get('title') || null
  }
}
