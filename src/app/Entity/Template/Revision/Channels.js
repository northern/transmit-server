
export default class Channels {
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

  constructor() {
    this.preferred = []
    this.required = [Channels.TYPE_EMAIL]
  }

  serialize() {
    return Object.assign({}, this)
  }

  unserialize(data) {
    if (!data) {
      data = {}
    }

    this.preferred = data.preferred || []
    this.required = data.required || [Channels.TYPE_EMAIL]
  }
}
