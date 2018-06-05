
export default class MessageService {
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
