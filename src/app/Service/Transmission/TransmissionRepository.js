
export default class TransmissionRepository {
  setLogger(logger) {
    this.logger = logger
  }

  setStorage(storage) {
    this.storage = storage
  }

  async getById(id, connection) {
    return this.storage.getById(id, connection)
  }

  async getByMessageId(id, connection) {
    return this.storage.getByMessageId(id, connection)
  }

  async persist(transmission, connection) {
    return await this.storage.persist(transmission, connection)
  }
}
