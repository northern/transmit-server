
import MessageError from './MessageError'

export default class MessageValidationError extends MessageError {
  public errors: any
  
  constructor(errors: any) {
    super("There was problem validating the message.")

    this.errors = errors
  }
}
