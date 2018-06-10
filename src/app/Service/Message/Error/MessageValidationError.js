
import MessageError from './MessageError'

export default class MessageValidationError extends MessageError {
  constructor(errors) {
    super("There was problem validating the message.")

    this.errors = errors
  }
}
