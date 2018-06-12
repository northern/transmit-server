
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
