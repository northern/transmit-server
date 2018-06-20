
export default class AwsProvider {
  constructor(config) {

  }

  getCapabilities() {
    return ['email', 'sms', 'push']
  }

  send(title, body, extra = {}) {

  }
}
