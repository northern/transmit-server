
import ISerializer from '../../ISerializer'

export default class Sms implements ISerializer {
  public from: string | null
  public body: string | null

  constructor(from: string | null = null, body: string | null = null) {
    this.from = from
    this.body = body
  }

  serialize(): object {
    return {
      from: this.from,
      body: this.body,
    }
  }

  unserialize(data: object | null): void {
    if (!data) {
      data = {}
    }

    const map: Map<string, any> = new Map(Object.entries(data))

    this.from = map.get('from') || null
    this.body = map.get('body') || null
  }
}
