
import ISerializer from '../../ISerializer'

export default class Defaults implements ISerializer {
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
