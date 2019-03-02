
import Message from '../../../Entity/Message'
import IProvider, {
  CAPABILITY_EMAIL,
} from '../../../Entity/Integration/IProvider'

export default class SmtpProvider implements IProvider {
  getCapabilities(): Array<string> {
    return [
      CAPABILITY_EMAIL,
    ]
  }

  send(_message: Message): void {

  }
}
