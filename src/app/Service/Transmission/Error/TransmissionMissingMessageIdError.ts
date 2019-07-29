
import TransmissionError from './TransmissionError'

export default class TransmissionMissingMessageIdError extends TransmissionError {
  constructor() {
    super(`A Transmission can only be instantiated with a Message that has a valid Id.`)
  }
}
