
import TransmissionError from './TransmissionError'

export default class TransmissionNotFoundError extends TransmissionError {
  constructor(id: number | string) {
    super(`Transmission is id '${id}' could not be found.`)
  }
}
