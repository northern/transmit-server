
export default class AbstractQuery {
  setLogger(logger) {
    this.logger = logger
  }
  
  setPersistenceService(persistenceService) {
    this.persistenceService = persistenceService
  }
}
