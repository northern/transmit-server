
export default interface IProvider {
  getCapabilities(): Array<string>
  send(channel: string, title: string, body: string, extra: object | null): Promise<void>
}
