
import {
  Validator
} from 'jsonschema'

export default class TransmissionValidator {
  setLogger(logger) {
    this.logger = logger
  }

  validate(data) {
    const validator = new Validator()

    return validator.validate(data, this.getSchema())
  }

  getSchema() {
    const schema = {}
    
    return schema
  }
}
