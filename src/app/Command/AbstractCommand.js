
export default class AbstractCommand {
  setLogger(logger) {
    this.logger = logger
  }
  
  setPersistenceService(persistenceService) {
    this.persistenceService = persistenceService
  }
}
