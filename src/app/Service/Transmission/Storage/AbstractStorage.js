
export default class AbstractStorage {
  setLogger(logger) {
    this.logger = logger
  }

  getById(id, connection) {
    throw new Error("Missing implementation for 'getById'.")
  }

  async persist(entity, connection) {
    throw new Error("Missing implementation for 'persist'.")
  }
}
