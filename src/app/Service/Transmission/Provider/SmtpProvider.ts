
import IProvider from '../../../Entity/Integration/IProvider'
import Integration from '../../../Entity/Integration'

export default class SmtpProvider implements IProvider {
  getCapabilities(): Array<string> {
    return [
      Integration.CHANNEL_EMAIL,
    ]
  }

  async send(_channel: string, _title: string, _body: string, _extra: object | null): Promise<void> {

  }
}
