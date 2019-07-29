
import IProvider from './Integration/IProvider'

export default class Integration {
  static readonly CHANNEL_EMAIL: string = 'email'
  static readonly CHANNEL_SMS: string = 'sms'
  static readonly CHANNEL_PUSH: string = 'push'
  static readonly CHANNEL_CHAT: string = 'chat';
  static readonly CHANNEL_CALLBACK: string = 'callback';

  public channel: string
  public provider: IProvider
  
  constructor(channel: string, provider: IProvider) {
    const capabilities = provider.getCapabilities()

    if (!capabilities.includes(channel)) {
      throw new Error(`Channel (${channel}) does not match Provider capabilities ([${capabilities}]).`)
    }

    this.channel = channel
    this.provider = provider
  }
}
