
import TransmissionError from './TransmissionError'

export default class TransmissionNotFoundError extends TransmissionError {
  constructor(id) {
    super(`Transmission is id '${id}' could not be found.`)
  }
}