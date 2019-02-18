
import Channels from './Revision/Channels'
import Defaults from './Revision/Defaults'
import Email from './Revision/Email'
import Sms from './Revision/Sms'
import Push from './Revision/Push'
import Callback from './Revision/Callback'
import Test from './Revision/Test'

export default class Revision {
  number: number
  parent: number | null
  channels: Channels
  defaults: Defaults
  email: Email
  sms: Sms
  push: Push
  callback: Callback
  test: Test

  constructor(number: number = 1, parent: number | null = null) {
    this.number = number
    this.parent = parent
    this.channels = new Channels()
    this.defaults = new Defaults()
    this.email = new Email()
    this.sms = new Sms()
    this.push = new Push()
    this.callback = new Callback()
    this.test = new Test()
  }

  getTitle(channel: string): string {
    let title: string = '';

    switch (channel) {
      case Channels.TYPE_EMAIL:
        title = this.email.title || ''
        break

      case Channels.TYPE_SMS:
        // SMS has no title.
        break

      case Channels.TYPE_PUSH:
        title = this.push.title || ''
        break

      case Channels.TYPE_CALLBACK:
        title = this.callback.title || ''
        break

      // case Channels.TYPE_CHAT:
      //   title = this.chat.title
      //   break
    }

    if (!title.length) {
      title = this.defaults.title
    }

    return title
  }

  getBody(channel: string): string {
    let body: string = '';

    switch (channel) {
      case Channels.TYPE_EMAIL:
        body = (this.email.isHtml ? this.email.body.html : this.email.body.text) || ''
        break

      case Channels.TYPE_SMS:
        body = this.sms.body || ''
        break

      case Channels.TYPE_PUSH:
        body = this.push.body
        break

      case Channels.TYPE_CALLBACK:
        body = this.callback.body
        break

      // case Channels.TYPE_CHAT:
      //   body = this.chat.body
      //   break
    }

    if (!body.length) {
      body = this.defaults.body
    }

    return body
  }

  unserialize(data: object | null) {
    if (!data) {
      data = {}
    }

    const map: Map<string, string> = new Map(Object.entries(data))

    this.number = <number>(map.get('number') || 1)
    this.parent = map.get('parent') || null

    (this.channels = new Channels()).unserialize(map.get('channels'))
    (this.defaults = new Defaults()).unserialize(map.get('defaults'))
    (this.email = new Email()).unserialize(map.get('email'))
    (this.sms = new Sms()).unserialize(map.get('sms'))
    (this.push = new Push()).unserialize(map.get('push'))
    (this.callback = new Callback()).unserialize(map.get('callback'))
    (this.test = new Test()).unserialize(map.get('test'))
  }
}
