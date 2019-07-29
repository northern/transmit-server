
import MessageError from './MessageError'

export default class MessageNotFoundError extends MessageError {
  constructor(id: number | string) {
    super(`Message is id '${id}' could not be found.`)
  }
}
