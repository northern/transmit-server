
import IProvider from '../../../Entity/Integration/IProvider'
import Integration from '../../../Entity/Integration'

export default class AwsProvider implements IProvider {
  getCapabilities() {
    return [
      Integration.CHANNEL_EMAIL,
      Integration.CHANNEL_SMS,
      Integration.CHANNEL_PUSH,
    ]
  }

  async send(_channel: string, _title: string, _body: string, _extra: object | null): Promise<void> {

  }
}
