
import {
  Validator,
  ValidatorResult
} from 'jsonschema'

import Message from '../../Entity/Message'
import IMesssageValidator from './IMessageValidator'

export default class MessageValidator implements IMesssageValidator {
  validate(data: object): object {
    const validator = new Validator()

    const result = validator.validate(data, this.getSchema())

    return {
      errors: result.errors
    }
  }

  getSchema(): object {
    const schema = {
      title: "Postways Message Schema",
      type: 'object',
      required: ['token', 'status', 'error', 'data', 'template', 'timeCreated', 'timeUpdated'],
      properties: {
        id: {
          type: ['number', 'string', 'null'],
        },
        token: {
          type: ['string'],
        },
        status: {
          type: ['string'],
          enum: Message.getStatuses(),
        },
        environment: {
          type: ['string', 'null'],
          maxLength: 64,
        },
        error: {
          type: ['string', 'null'],
        },
        data: {
          type: ['object'],
        },
        template: {
          type: ['object', 'null'],
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
