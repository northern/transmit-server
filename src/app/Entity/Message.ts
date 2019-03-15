
import uuid from 'uuid'
import Template from './Template'

export default class Message {
  /** 
   * While a message is created but not yet processed.
   */
  static readonly STATUS_CREATED: string = 'created'

  /** 
   * While a message is pending, waiting to be processed (default).
   */
  static readonly STATUS_PENDING: string = 'pending'

  /** 
   * While a message is processing its transmissions.
   */
  static readonly STATUS_PROCESSING: string = 'processing'

  /**
   * When a message failed, the 'error' has details.
   */
  static readonly STATUS_FAILED: string = 'failed'

  /**
   * When a message has failed but a retry has been scheduled.
   */
  static readonly STATUS_RETRY: string = 'retry'

  /**
   * When a message and "all" it's transmissions have been successully processed.
   */
  static readonly STATUS_OK: string = 'ok'

  /**
   * When a message was partially processed, i.e. not all transmissions could be processed successfully.
   */
  static readonly STATUS_WARNING: string = 'warning'

  public id: number | string | null
  public token: string
  public status: string
  public error: string | null
  public environment: string | null
  public data: object | null
  public template: Template | null
  public timeCreated: number | null
  public timeUpdated: number | null

  constructor(data: object | null = null) {
    this.id = null
    this.token = uuid.v4()
    this.status = Message.STATUS_CREATED
    this.error = null
    this.environment = null
    this.data = data
    this.template = null
    this.timeCreated = null
    this.timeUpdated = null
  }

  static getStatuses() {
    return [
      Message.STATUS_CREATED,
      Message.STATUS_PENDING,
      Message.STATUS_PROCESSING,
      Message.STATUS_FAILED,
      Message.STATUS_RETRY,
      Message.STATUS_OK,
      Message.STATUS_WARNING,
    ]
  }
}
