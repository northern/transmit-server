
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
    const schema = {
      title: "Postways Transmission Schema",
      type: 'object',
      required: ['messageId', 'status', 'type', 'target', 'vars', 'error', 'timeCreated', 'timeUpdated'],
      properties: {
        id: {
          type: ['number', 'string', 'null'],
        },
        messageId: {
          type: ['number', 'string'],
        },
        status: {
          type: ['string'],
        },
        type: {
          type: ['string'],
        },
        target: {
          type: ['object'],
        },
        vars: {
          type: ['object', 'null'],
        },
        error: {
          type: ['string', 'null'],
        },
        timeCreated: {
          type: ['number', 'null'],
        },
        timeUpdated: {
          type: ['number', 'null'],
        },
      },
      additionalProperties: false
    }
    
    return schema
  }
}
