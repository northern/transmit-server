
import Transmission from '../../Entity/Transmission'
import TransmissionValidationError from './Error/TransmissionValidationError'

export default class TransmissionService {
  static get TYPE_MYSQL() {
    return 'mysql'
  }
  
  setLogger(logger) {
    this.logger = logger
  }

  setRepository(repository) {
    this.repository = repository
  }

  setValidator(validator) {
    this.validator = validator
  }

  async getById(id, connection) {
    return this.repository.getById(id, connection)
  }

  async create(data, connection) {
    const result = this.validator.validate(data)

    if (result.errors.length > 0) {
      throw new TransmissionValidationError(result.errors)
    }

    const transmission = new Transmission(data)

    await this.repository.persist(transmission, connection)

    return transmission
  }
}
