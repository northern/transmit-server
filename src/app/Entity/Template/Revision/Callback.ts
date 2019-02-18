
import Serializable from '../../Serializable'

export default class Callback implements Serializable {
  public title: string | null
  public from: string | null
  public body: string | null

  constructor(title: string | null = null, from: string | null = null, body: string | null = null) {
    this.title = title
    this.from = from
    this.body = body
  }

  serialize(): object {
    return {
      title: this.title,
      from: this.from,
      body: this.body,
    }
  }

  unserialize(data: object | null): void {
    if (!data) {
      data = {}
    }

    const map: Map<string, any> = new Map(Object.entries(data))

    this.title = map.get('title') || null
    this.from = map.get('from') || null
    this.body = map.get('body') || null
  }
}
