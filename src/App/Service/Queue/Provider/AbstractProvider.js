
export default class AbstractProvider {
  setLogger(logger) {
    this.logger = logger
  }

  async add(message) {
    throw new Error("Missing implementation for 'add'.")
  }

  async get() {
    throw new Error("Missing implementation for 'get'.")
  }
}
