
export default class Template {
  static get CHANNEL_TYPE_EMAIL() {
    return 'email'
  }

  static get CHANNEL_TYPE_SMS() {
    return 'sms'
  }

  static get CHANNEL_TYPE_PUSH() {
    return 'push'
  }

  static get CHANNEL_TYPE_CALLBACK() {
    return 'callback'
  }

  static getChannelTypes()
  {
    return [
      Template.CHANNEL_TYPE_EMAIL,
      Template.CHANNEL_TYPE_SMS,
      Template.CHANNEL_TYPE_PUSH,
      Template.CHANNEL_TYPE_CALLBACK,
    ];
  }
}
