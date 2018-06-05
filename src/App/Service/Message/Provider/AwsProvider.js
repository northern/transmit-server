
import AbstractProvider from './AbstractProvider'

export default AwsProvider extends AbstractProvider {
  getCapabilities() {
    return [
      AbstractProvider.CAPABILITY_EMAIL,
      AbstractProvider.CAPABILITY_SMS,
      AbstractProvider.CAPABILITY_PUSH,
    ]
  }

  send(message) {

  }
}
