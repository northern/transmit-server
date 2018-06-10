
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
    const transmission = new Transmission(data)

    const result = this.validator.validate(transmission)

    if (result.errors.length > 0) {
      throw new TransmissionValidationError(result.errors)
    }

    await this.repository.persist(transmission, connection)

    return transmission
  }

  async update(transmission, values, connection) {
    const updatedTransmission = Object.assign(new Transmission(), transmission, values)

    const result = this.validator.validate(transmission)

    if (result.errors.length > 0) {
      throw new TransmissionValidationError(result.errors)
    }

    await this.repository.persist(updatedTransmission, connection)

    return updatedTransmission
  }
}
