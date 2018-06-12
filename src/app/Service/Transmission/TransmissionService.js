
export default class TransmissionService {
  constructor() {
    this.providers = []
  }

  setLogger(logger) {
    this.logger = logger
  }

  setRepository(repository) {
    this.repository = repository
  }

  setValidator(validator) {
    this.validator = validator
  }

  addProvider(provider) {
    this.providers.push(provider)
  }

  create(message, template) {
    const transmissions = []




    return transmissions
  }

  send(transmission) {
    
  }
}
