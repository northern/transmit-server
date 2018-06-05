
import MissingImplementationError extends './Error/MissingImplementationError'

export default class AbstractProvider {
  get static CAPABILITY_EMAIL() {
    return 'email'
  }

  get static CAPABILITY_SMS() {
    return 'sms'
  }

  get static CAPABILITY_PUSH() {
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
