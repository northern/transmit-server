
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
    this.number = data.number || this.number
    this.parent = data.parent || this.parent

    this.channels = new Channels().unserialize(data.channels || {})
    this.default = new Defaults().unserialize(data.defaults || {})
    this.email = new Email().unserialize(data.email || {})
    this.sms = new Sms().unserialize(data.sms || {})
    this.push = new Push().unserialize(data.push || {})
    this.callback = new Callback().unserialize(data.callback || {})
    this.test = new Test().unserialize(data.test || {})

    return this
  }
}
