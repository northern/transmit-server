
import Body from './Email/Body'

export default class Email {
  constructor() {
    this.title = null
    this.senderName = null
    this.senderEmail = null
    this.body = new Body()
    this.isHtml = false
  }

  getSenderName(defaultName) {
    return this.senderName || defaultName
  }

  getSenderEmail(defaultEmail) {
    return this.senderEmail || defaultEmail
  }

  serialize() {
    return Object.assign({}, this)
  }

  unserialize(data) {
    if (!data) {
      data = {}
    }

    this.title = data.title || null
    this.senderName = data.senderName || null
    this.senderEmail = data.senderEmail || null
    this.body.unserialize(data.body)
    this.isHtml = data.isHtml || false
  }
}
