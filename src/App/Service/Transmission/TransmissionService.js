
import Transmission from '../../Entity/Transmission'
import TransmissionValidationError from './Error/TransmissionValidationError'

export default class TransmissionService {
  setLogger(logger) {
    this.logger = logger
  }

  setRepository(repository) {
    this.repository = repository
  }

  setValidator(validator) {
    this.validator = validator
  }

  getById(id) {
    return this.repository.getById(id)
  }

  create(data) {
    const result = this.validator.validate(data)

    if (result.errors.length > 0) {
      throw new TransmissionValidationError(result.errors)
    }

    const transmission = new Transmission(data)

    

    return transmission
  }
}
