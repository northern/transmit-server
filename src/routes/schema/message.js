
import {
  Validator
} from 'jsonschema'

import Template from '../../app/Entity/Template'
import TemplateValidator from '../../app/Service/Template/TemplateValidator'

const templateValidator = new TemplateValidator()

const schema = {
  title: "Postways Message Schema",
  type: 'object',
  required: ['template', 'recipients'],
  properties: {
    environment: {
      type: ['string', 'null'],
      maxLength: 64,
    },
    template: {
      type: 'object',
      oneOf: [{
        type: 'object',
        required: ['id'],
        properties: {
          id: {
            type: 'string',
            maxLength: 64,
          },
          revision: {
            type: 'integer',
          },
          vars: {
            type: ['object', 'null'],
            additionalProperties: true,
          },
        },
        additionalProperties: false,
      }, {
        type: 'object',
        required: ['channels', 'default'],
        properties: {
          channels: templateValidator.getChannelsType(),
          default: templateValidator.getDefaultType(),
          email: templateValidator.getEmailType(),
          sms: templateValidator.getSmsType(),
          push: templateValidator.getPushType(),
          callback: templateValidator.getCallbackType(),
          vars: {
            type: ['object', 'null'],
            additionalProperties: true,
          },
        },
        additionalProperties: false,
      }],
    },
    recipients: {
      type: 'array',
      items: {
        type: 'object',
        anyOf: [
          {required: ['email']},
          {required: ['phone']},
          {required: ['push']},
          {required: ['callback']},
        ],
        properties: {
            email: {
              type: ['string', 'null'],
            },
            phone: {
              type: ['string', 'integer', 'null'],
            },
            push: {
              type: ['object', 'null'],
              required: ['platform', 'device', 'endpoint'],
              properties: {
                platform: {
                  type: 'string',
                  enum: ['gcm', 'apns', 'apns_sandbox'],
                },
                device: {
                  type: 'string',
                },
                endpoint: {
                  type: 'string',
                },
                data: {
                  type: ['object', 'null'],
                  additionalProperties: true,
                },
              },
              additionalProperties: false,
            },
            callback: {
              type: ['object', 'null'],
              required: ['type'],
              properties: {
                type: {
                  type: 'string',
                  enum: ['http']
                },
                uri: {
                  type: ['string', 'null']
                },
                headers: {
                  type: ['array', 'null'],
                  items: {
                    type: 'string',
                  }
                },
                data: {
                  type: ['object', 'null'],
                  additionalProperties: true,
                },
              },
              additionalProperties: false,
            },
            chat: {
              type: ['object', 'null']
            },
            vars: {
              type: ['object', 'null'],
              additionalProperties: true,
            },
        },
      },
      minItems: 1,
    },
    channels: {
      type: ['array', 'null'],
      items: {
        type: ['string'],
        enum: Template.getChannelTypes(),
      }
    },
    additionalProperties: false,
  }
}

export default (data) => {
  const validator = new Validator()

  return validator.validate(data, schema)
}
