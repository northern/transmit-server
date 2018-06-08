
export default class QueueService {
  static get TYPE_SQS() {
    return 'sqs'
  }

  setLogger(logger) {
    this.logger = logger
  }

  setProvider(provider) {
    this.provider = provider
  }

  /**
   * Adds a message to the queue.
   */
  async add(message) {
    this.provider.add(message)
  }

  /**
   * Gets a message from the queue.
   */
  async get() {
    return this.provider.get()
  }
}
