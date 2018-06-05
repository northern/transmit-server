
import MissingImplementationError extends './Error/MissingImplementationError'

export default class AbstractProvider {
  setLogger(logger) {
    this.logger = logger
  }

  add(message) {
    throw new MissingImplementationError("Missing 'add' implementation.")
  }

  get() {
    throw new MissingImplementationError("Missing 'get' implementation.")
  }
}
