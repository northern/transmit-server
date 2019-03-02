
import {
  Validator,
  ValidatorResult
} from 'jsonschema'

export default class TransmissionValidator {
  validate(data: object): object {
    const validator = new Validator()

    const result = validator.validate(data, this.getSchema())

    return {
      errors: result.errors
    }
  }

  getSchema(): object {
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
          type: ['object', 'string', 'integer'],
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
