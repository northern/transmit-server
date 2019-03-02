
import TransmissionError from './TransmissionError'

export default class TransmissionValidationError extends TransmissionError {
  constructor(errors: any) {
    super("There was problem validating the transmission.")

    this.errors = errors
  }
}
