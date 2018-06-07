
export default class TransmissionRepository {
  setLogger(logger) {
    this.logger = logger
  }

  setStorage(storage) {
    this.storage = storage
  }

  getById(id, connection) {
    return this.storage.getById(id)
  }

  async persist(transmission, connection) {
    return await this.storage.persist(transmission, connection)
  }
}
