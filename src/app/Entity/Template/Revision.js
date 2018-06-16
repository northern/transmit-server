
import Channels from './Revision/Channels'
import Defaults from './Revision/Defaults'
import Email from './Revision/Email'
import Sms from './Revision/Sms'
import Push from './Revision/Push'
import Callback from './Revision/Callback'
import Test from './Revision/Test'

export default class Revision {
  constructor(number = 1, parent = null) {
    this.number = number
    this.parent = parent
    this.channels = new Channels()
    this.default = new Defaults()
    this.email = new Email()
    this.sms = new Sms()
    this.push = new Push()
    this.callback = new Callback()
    this.test = new Test()
  }

  getTitle(channel) {
    let title;

    switch (channel) {
      case Channels.TYPE_EMAIL:
        title = this.email.title
        break

      case Channels.TYPE_SMS:
        // SMS has no title.
        break

      case Channels.TYPE_PUSH:
        title = this.push.title
        break

      case Channels.TYPE_CALLBACK:
        title = this.callback.title
        break

      case Channels.TYPE_CHAT:
        title = this.chat.title
        break
    }

    if (!title) {
      title = this.default.title
    }

    return title
  }

  getBody(channel) {
    let body;

    switch (channel) {
      case Channels.TYPE_EMAIL:
        if (this.email.isHtml) {
          body = this.email.body.html
        }
        else {
          body = this.email.body.text
        }
        break

      case Channels.TYPE_SMS:
        body = this.sms.body
        break

      case Channels.TYPE_PUSH:
        body = this.push.body
        break

      case Channels.TYPE_CALLBACK:
        body = this.callback.body
        break

      case Channels.TYPE_CHAT:
        body = this.chat.body
        break
    }

    if (!body) {
      body = this.default.body
    }

    return body
  }

  unserialize(data) {
    if (!data) {
      data = {}
    }

    this.number = data.number || 1
    this.parent = data.parent || null

    this.channels.unserialize(data.channels)
    this.default.unserialize(data.default)
    this.email.unserialize(data.email)
    this.sms.unserialize(data.sms)
    this.push.unserialize(data.push)
    this.callback.unserialize(data.callback)
    this.test.unserialize(data.test)
  }
}
