
export default class TransmissionService {
  constructor() {
    this.providers = []
  }

  setLogger(logger) {
    this.logger = logger
  }

  addProvider(provider) {
    this.providers.push(provider)
  }

  send(message) {
    
  }
}
