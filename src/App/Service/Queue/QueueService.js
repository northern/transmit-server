
export default class QueueService {
  setLogger(logger) {
    this.logger = logger
  }

  setProvider(provider) {
    this.provider = provider
  }

  /**
   * Adds a message to the queue.
   */
  add(message) {
    return this.provider.add(message)
  }

  /**
   * Gets a message from the queue.
   */
  get() {
    return this.provider.get()
  }
}
