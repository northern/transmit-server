
import Message from '../../../Entity/Message'
import IProvider, {
  CAPABILITY_EMAIL,
  CAPABILITY_SMS,
  CAPABILITY_PUSH,
} from '../../../Entity/Integration/IProvider'

export default class AwsProvider implements IProvider {
  getCapabilities() {
    return [
      CAPABILITY_EMAIL,
      CAPABILITY_SMS,
      CAPABILITY_PUSH,
    ]
  }

  send(_message: Message): void {

  }
}
