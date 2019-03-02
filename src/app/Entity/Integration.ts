
import IProvider from './Integration/IProvider'

export default class Integration {
  public channel: string
  public provider: IProvider
  
  constructor(channel: string, provider: IProvider) {
    this.channel = channel
    this.provider = provider
  }
}
