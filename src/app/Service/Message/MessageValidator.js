
import {
  Validator
} from 'jsonschema'

import Template from '../../Entity/Template'
import Message from '../../Entity/Message'

export default class MessageValidator {
  setLogger(logger) {
    this.logger = logger
  }

  setTemplateValidator(templateValidator) {
    this.templateValidator = templateValidator
  }

  validate(message) {
    const validator = new Validator()

    return validator.validate(message, this.getSchema())
  }

  getSchema() {
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
