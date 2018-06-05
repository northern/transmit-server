
export default class TransmissionRepository {
  setLogger(logger) {
    this.logger = logger
  }

  setRepository(repository) {
    this.repository = repository
  }

  getById(id) {
    return this.repository.getById(id)
  }
}
