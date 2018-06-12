
import Body from './Email/Body'

export default class Email {
  constructor() {
    this.title = null
    this.senderName = null
    this.senderEmail = null
    this.body = new Body()
    this.isHtml = false
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
    this.body = data.body ? (new Body()).unserialize(data.body) : new Body()
    this.isHtml = data.isHtml || false
  }
}
