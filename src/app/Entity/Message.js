
import uuid from 'uuid'

export default class Message {
  /** 
   * While a message is pending, waiting to be processed (default).
   */
  static get STATUS_PENDING() {
    return 'pending'
  }

  /** 
   * While a message is processing its transmissions.
   */
  static get STATUS_PROCESSING() {
    return 'processing'
  }

  /**
   * When a message failed, the 'error' has details.
   */
  static get STATUS_FAILED() {
    return 'failed'
  }

  /**
   * When a message has failed but a retry has been scheduled.
   */
  static get STATUS_RETRY() {
    return 'retry'
  }

  /**
   * When a message and "all" it's transmissions have been successully processed.
   */
  static get STATUS_OK() {
    return 'ok'
  }

  /**
   * When a message was partially processed, i.e. not all transmissions could be processed successfully.
   */
  static get STATUS_WARNING() {
    return 'warning'
  }

  constructor(data) {
    this.id = null
    this.token = uuid.v4()
    this.status = Message.STATUS_PENDING
    this.error = null
    this.data = data
    this.timeCreated = null
    this.timeUpdated = null
  }

  static getStatuses() {
    return [
      Message.STATUS_PENDING,
      Message.STATUS_PROCESSING,
      Message.STATUS_FAILED,
      Message.STATUS_RETRY,
      Message.STATUS_OK,
      Message.STATUS_WARNING,
    ]
  }
}
