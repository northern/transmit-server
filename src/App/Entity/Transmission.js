
import crypto from 'crypto'

export default class Transmission {
  /** 
   * While a transmission is processing its messages (default).
   */
  static get STATUS_PROCESSING() {
    return 'processing'
  }

  /**
   * When a transmission failed, the 'error' has details.
   */
  static get STATUS_FAILED() {
    return 'failed'
  }

  /**
   * When a transmission and "all" it's messages have been successully processed.
   */
  static get STATUS_OK() {
    return 'ok'
  }

  /**
   * When a transmission was partially processed, i.e. not all messages could be processed successfully.
   */
  static get STATUS_WARNING() {
    return 'warning'
  }

  constructor(data) {
    this.id = null
    this.token = crypto.createHash('sha256').update(crypto.randomBytes(256)).digest('hex')
    this.status = Transmission.STATUS_PROCESSING
    this.error = null
    this.data = data
    this.timeCreated = null
    this.timeUpdated = null
  }
}
