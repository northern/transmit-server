
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
    this.title = data.title || this.title
    this.senderName = data.senderName || this.senderName
    this.senderEmail = data.senderEmail || this.senderEmail
    this.body = data.body ? (new Body()).unserialize(data.body) : this.body
    this.isHtml = data.isHtml || this.isHtml

    return this
  }
}
