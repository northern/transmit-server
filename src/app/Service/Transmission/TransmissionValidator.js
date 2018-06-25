
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
      required: ['messageId', 'token', 'status', 'channel', 'target', 'vars', 'error', 'timeCreated', 'timeUpdated'],
      properties: {
        id: {
          type: ['number', 'string', 'null'],
        },
        messageId: {
          type: ['number', 'string'],
        },
        token: {
          type: ['string'],
        },
        status: {
          type: ['string'],
        },
        channel: {
          type: ['string'],
        },
        target: {
          type: ['object', 'string'],
        },
        vars: {
          type: ['object', 'null'],
        },
        error: {
          type: ['string', 'null'],
        },
        tries: {
          type: 'number'
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
