
import AbstractProvider from './AbstractProvider'

export default SmtpProvider extends AbstractProvider {
  getCapabilities() {
    return [
      AbstractProvider.CAPABILITY_EMAIL,
    ]
  }

  send(message) {

  }
}
