
import ISerializer from '../../ISerializer'

export default class Channels implements ISerializer {
  static readonly TYPE_EMAIL    = 'email'
  static readonly TYPE_SMS      = 'sms'
  static readonly TYPE_PUSH     = 'push'
  static readonly TYPE_CALLBACK = 'callback'
  static readonly TYPE_CHAT     = 'chat'

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
