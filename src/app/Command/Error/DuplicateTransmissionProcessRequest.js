
import CommandError from './CommandError'

export default class DuplicateTransmissionProcessRequest extends CommandError {
  constructor(transmission) {
    super(`The transmission with token '${transmission.token}' is already (or already has been) processed.`)
  }
}
