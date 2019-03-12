
import MessageError from './MessageError'

export default class MessageNotFoundError extends MessageError {
  constructor(id) {
    super(`Message is id '${id}' could not be found.`)
  }
}
