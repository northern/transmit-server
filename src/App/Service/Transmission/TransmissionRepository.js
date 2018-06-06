
export default class TransmissionRepository {
  setLogger(logger) {
    this.logger = logger
  }

  setStorage(storage) {
    this.storage = storage
  }

  getById(id) {
    return this.storage.getById(id)
  }

  persist(transmission) {
    return this.storage.persist(transmission)
  }

  beginTransaction() {
    this.storage.beginTransaction()
  }

  commitTransaction() {
    this.storage.commit()
  }

  rollbackTransaction() {
    this.storage.rollback()
  }
}
