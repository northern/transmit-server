
import Serializable from '../../../Serializable'

export default class Body implements Serializable {
  public text: string | null
  public html: string | null

  constructor(text: string | null = null, html: string | null = null) {
    this.text = text
    this.html = html
  }

  serialize(): object {
    return {
      text: this.text,
      html: this.html,
    }
  }

  unserialize(data: object | null): void {
    if (!data) {
      data = {}
    }

    const map: Map<string, any> = new Map(Object.entries(data))

    this.text = map.get('text') || null
    this.html = map.get('html') || null
  }
}
