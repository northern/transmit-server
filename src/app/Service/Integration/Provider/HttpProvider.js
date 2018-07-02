
import AbstractProvider from './AbstractProvider'
import Transmission from  '../../../Entity/Transmission'

export default class HttpProvider extends AbstractProvider {
  constructor(config) {
    super()
  }

  getCapabilities() {
    return [
      Transmission.CHANNEL_CALLBACK,
    ]
  }

  send(channel, title, body, extra = {}) {
    
  }
}
