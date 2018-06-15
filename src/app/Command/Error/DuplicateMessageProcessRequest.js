
import CommandError from './CommandError'

export default class DuplicateMessageProcessRequest extends CommandError {
  constructor(message) {
    super(`The message with token '${message.token}' is already (or already has been) processed.`)
  }
}
