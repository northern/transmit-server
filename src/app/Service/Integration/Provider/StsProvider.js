
export default class StsProvider {
  constructor(config) {

  }

  getCapabilities() {
    return ['email', 'sms', 'push']
  }

  send(title, body, extra = {}) {

  }
}
