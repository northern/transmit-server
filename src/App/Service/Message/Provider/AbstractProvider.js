
import MissingImplementationError extends './Error/MissingImplementationError'

export default class AbstractProvider {
  static get CAPABILITY_EMAIL() {
    return 'email'
  }

  static get CAPABILITY_SMS() {
    return 'sms'
  }

  static get CAPABILITY_PUSH() {
    return 'push'
  }

  setLogger(logger) {
    this.logger = logger
  }

  getCapabilities() {
    throw new MissingImplementationError("Missing 'getCapabilities' implementation.")
  }

  send(message) {
    throw new MissingImplementationError("Missing 'send' implementation.")
  }
}
