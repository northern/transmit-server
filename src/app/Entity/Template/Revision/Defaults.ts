
import Serializable from '../../Serializable'

export default class Defaults implements Serializable {
  public title: string
  public body: string

  constructor(title: string = '', body: string = '') {
    this.title = title
    this.body = body
  }

  serialize(): object {
    return {
      title: this.title,
      body: this.body,
    }
  }

  unserialize(data: object | null): void {
    if (!data) {
      data = {}
    }

    const map: Map<string, any> = new Map(Object.entries(data))

    this.title = map.get('title') || ''
    this.body = map.get('body') || ''
  }
}
