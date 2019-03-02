
import Message from '../Message'

export const CAPABILITY_EMAIL: string = 'email'
export const CAPABILITY_SMS: string = 'sms'
export const CAPABILITY_PUSH: string = 'push'

export default interface IProvider {
  getCapabilities(): Array<string>
  send(message: Message): void
}
