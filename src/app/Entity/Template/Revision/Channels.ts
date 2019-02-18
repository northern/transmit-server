
import Serializable from '../../Serializable'

export default class Channels implements Serializable {
  static get TYPE_EMAIL() {
    return 'email'
  }

  static get TYPE_SMS() {
    return 'sms'
  }

  static get TYPE_PUSH() {
    return 'push'
  }

  static get TYPE_CALLBACK() {
    return 'callback'
  }

  static get TYPE_CHAT() {
    return 'chat'
  }

  public preferred: string[]
  public required: string[]

  constructor(preferred: string[] = [], required: string[] = []) {
    this.preferred = preferred
    this.required = required
  }

  serialize() {
    return {
      preferred: this.preferred,
      required: this.required,
    }
  }

  unserialize(data: object | null): void {
    if (!data) {
      data = {}
    }

    const map: Map<string, any> = new Map(Object.entries(data))

    this.preferred = map.get('preferred') || []
    this.required = map.get('required') || []
  }

  static getTypes() {
    return [
      Channels.TYPE_EMAIL,
      Channels.TYPE_SMS,
      Channels.TYPE_PUSH,
      Channels.TYPE_CALLBACK,
      Channels.TYPE_CHAT,
    ]
  }  
}
