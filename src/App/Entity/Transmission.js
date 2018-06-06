
import crypto from 'crypto'

export default class Transmission {
  /** 
   * When a transmission is processing its messages (default).
   */
  static get STATUS_PROCESSING() {
    return 'processing'
  }

  /**
   * When a transmission failed (template missing?). The transmission error has details.
   */
  static get STATUS_FAILED() {
    return 'failed'
  }

  /**
   * When a transmission and all it's messages have been successully processed.
   */
  static get STATUS_OK() {
    return 'ok'
  }

  /**
   * When a transmission was processed but not all messages could not be processed successfully.
   */
  static get STATUS_WARNING() {
    return 'warning'
  }

  constructor(data) {
    this.token = crypto.createHash('sha256').update(crypto.randomBytes(256)).digest('hex')
    this.status = Transmission.STATUS_OK
    this.error = null
    this.data = data
    this.timeCreated = null
    this.timeUpdated = null
  }
}
