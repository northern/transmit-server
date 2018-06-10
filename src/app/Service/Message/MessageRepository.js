
export default class MessageRepository {
  setLogger(logger) {
    this.logger = logger
  }

  setStorage(storage) {
    this.storage = storage
  }

  async getById(id, connection) {
    return this.storage.getById(id, connection)
  }

  async persist(message, connection) {
    return await this.storage.persist(message, connection)
  }
}
