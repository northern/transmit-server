
import uuid from 'uuid'

import Template from './Template'

export default class Transmission {
  /** 
   * While a transmission is pending, waiting to be processed (default).
   */
  static get STATUS_PENDING() {
    return 'pending'
  }

  /** 
   * While a transmission is processing its transmissions.
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
   * When a transmission has failed but a retry has been scheduled.
   */
  static get STATUS_RETRY() {
    return 'retry'
  }

  /**
   * When a transmission was successully processed.
   */
  static get STATUS_OK() {
    return 'ok'
  }

  static get CHANNEL_EMAIL() {
    return Template.CHANNEL_TYPE_EMAIL
  }

  static get CHANNEL_SMS() {
    return Template.CHANNEL_TYPE_SMS
  }

  static get CHANNEL_PUSH() {
    return Template.CHANNEL_TYPE_PUSH
  }

  static get CHANNEL_CALLBACK() {
    return Template.CHANNEL_TYPE_CALLBACK
  }

  static get CHANNEL_CHAT() {
    return Template.CHANNEL_TYPE_CHAT
  }

  constructor() {
    this.id = null
    this.messageId = null
    this.token = uuid.v4()
    this.status = Transmission.STATUS_PENDING
    this.channel = null
    this.target = null
    this.vars = null
    this.error = null
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
    ]
  }
}
