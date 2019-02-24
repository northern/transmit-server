
import Serializable from '../Serializable'

import Channels from './Revision/Channels'
import Defaults from './Revision/Defaults'
import Email from './Revision/Email'
import Sms from './Revision/Sms'
import Push from './Revision/Push'
import Callback from './Revision/Callback'
import Test from './Revision/Test'

export default class Revision implements Serializable {
  public number: number
  public parent: number | null
  public channels: Channels
  public defaults: Defaults
  public email: Email
  public sms: Sms
  public push: Push
  public callback: Callback
  public test: Test

  constructor(number: number, parent: number | null = null) {
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
    let title: string | null = null;

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

      // case Channels.TYPE_CHAT:
      //   title = this.chat.title
      //   break
    }

    if (!title) {
      title = this.defaults.title
    }

    return title
  }

  getBody(channel: string): string {
    let body: string | null = null;

    switch (channel) {
      case Channels.TYPE_EMAIL:
        body = (this.email.isHtml ? this.email.body.html : this.email.body.text)
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

      // case Channels.TYPE_CHAT:
      //   body = this.chat.body
      //   break
    }

    if (!body) {
      body = this.defaults.body
    }

    return body
  }

  serialize(): object {
    return {
      number: this.number,
      parent: this.parent,
      channels: this.channels.serialize(),
      defaults: this.defaults.serialize(),
      email: this.email.serialize(),
      sms: this.sms.serialize(),
      push: this.push.serialize(),
      callback: this.callback.serialize(),
      test: this.test.serialize(),
    }
  }

  unserialize(data: object | null) {
    if (!data) {
      data = {
        number: 1,
        parent: null,
      }
    }

    const map: Map<string, any> = new Map(Object.entries(data))

    this.number = map.get('number');
    this.parent = map.get('parent');

    this.channels = new Channels()
    this.channels.unserialize(map.get('channels'))

    this.defaults = new Defaults()
    this.defaults.unserialize(map.get('defaults'))

    this.email = new Email()
    this.email.unserialize(map.get('email'))

    this.sms = new Sms()
    this.sms.unserialize(map.get('sms'))

    this.push = new Push()
    this.push.unserialize(map.get('push'))

    this.callback = new Callback()
    this.callback.unserialize(map.get('callback'))

    this.test = new Test()
    this.test.unserialize(map.get('test'))
  }
}
