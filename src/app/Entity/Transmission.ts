
import uuid from 'uuid'

import Channels from './Template/Revision/Channels'

export default class Transmission {
  /** 
   * While a transmission is pending, waiting to be processed (default).
   */
  static readonly STATUS_PENDING = 'pending'

  /** 
   * While a transmission is processing its transmissions.
   */
  static readonly STATUS_PROCESSING = 'processing'

  /**
   * When a transmission failed, the 'error' has details.
   */
  static readonly STATUS_FAILED = 'failed'

  /**
   * When a transmission has failed but a retry has been scheduled.
   */
  static readonly STATUS_RETRY = 'retry'

  /**
   * When a transmission was successully processed.
   */
  static readonly STATUS_OK = 'ok'

  static readonly CHANNEL_EMAIL    = Channels.TYPE_EMAIL
  static readonly CHANNEL_SMS      = Channels.TYPE_SMS
  static readonly CHANNEL_PUSH     = Channels.TYPE_PUSH
  static readonly CHANNEL_CALLBACK = Channels.TYPE_CALLBACK
  static readonly CHANNEL_CHAT     = Channels.TYPE_CHAT

  static readonly MAX_TRIES = 3

  public id: number | null
  public messageId: number | null
  public token: string
  public status: string
  public channel: string | null
  public target: string | object | null
  public vars: object | null
  public error: string | null
  public tries: number
  public timeCreated: number | null
  public timeUpdated: number | null

  constructor() {
    this.id = null
    this.messageId = null
    this.token = uuid.v4()
    this.status = Transmission.STATUS_PENDING
    this.channel = null
    this.target = null
    this.vars = null
    this.error = null
    this.tries = 1
    this.timeCreated = null
    this.timeUpdated = null
  }
}
