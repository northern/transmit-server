
export default class Integration {
  public channel: string
  public provider: object
  
  constructor(channel: string, provider: object) {
    this.channel = channel
    this.provider = provider
  }
}
