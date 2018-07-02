
import AbstractProvider from './AbstractProvider'
import Transmission from  '../../../Entity/Transmission'

export default class SlackProvider extends AbstractProvider {
  constructor(config) {
    super()
  }

  getCapabilities() {
    return [
      Transmission.CHANNEL_CHAT,
    ]
  }

  send(channel, title, body, extra = {}) {

  }
}
