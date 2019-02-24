
import Serializable from '../Serializable'

export default class Category implements Serializable {
  public name: string | null
  public title: string | null

  constructor(name: string | null = null, title: string | null = null) {
    this.name = name
    this.title = title
  }

  serialize(): object {
    return {
      name: this.name,
      title: this.title,
    }
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
