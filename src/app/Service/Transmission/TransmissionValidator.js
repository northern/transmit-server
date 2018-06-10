
import {
  Validator
} from 'jsonschema'

import Template from '../../Entity/Template'
import Transmission from '../../Entity/Transmission'

export default class TransmissionValidator {
  setLogger(logger) {
    this.logger = logger
  }

  setTemplateValidator(templateValidator) {
    this.templateValidator = templateValidator
  }

  validate(transmission) {
    const validator = new Validator()

    return validator.validate(transmission, this.getSchema())
  }

  getSchema() {
    const schema = {
      title: "Postways Transmission Schema",
      type: 'object',
      required: ['token', 'status', 'error', 'data', 'timeCreated', 'timeUpdated'],
      properties: {
        id: {
          type: ['number', 'string', 'null'],
        },
        token: {
          type: ['string'],
        },
        status: {
          type: ['string'],
          enum: Transmission.getStatuses(),
        },
        error: {
          type: ['string', 'null'],
        },
        data: {
          'type': 'object',
          'required': ['template', 'recipients'],
          'properties': {
            'template': {
              'type': 'object',
              'oneOf': [{
                'type': 'object',
                'required': ['id'],
                'properties': {
                  'id': {
                    'type': 'string',
                    'maxLength': 64,
                  },
                  'revision': {
                    'type': 'integer',
                  },
                  'vars': {
                    'type': ['object', 'null'],
                    'additionalProperties': true,
                  },
                },
                'additionalProperties': false,
              }, {
                'type': 'object',
                'required': ['channels', 'default'],
                'properties': {
                  'channels': this.templateValidator.getChannelsType(),
                  'default': this.templateValidator.getDefaultType(),
                  'email': this.templateValidator.getEmailType(),
                  'sms': this.templateValidator.getSmsType(),
                  'push': this.templateValidator.getPushType(),
                  'callback': this.templateValidator.getCallbackType(),
                  'vars': {
                    'type': ['object', 'null'],
                    'additionalProperties': true,
                  },
                },
                'additionalProperties': false,
              }],
            },
            'recipients': {
              'type': 'array',
              'items': {
                'type': 'object',
                'anyOf': [
                  {'required': ['email']},
                  {'required': ['phone']},
                  {'required': ['push']},
                  {'required': ['callback']},
                ],
                'properties': {
                    'email': {
                      'type': ['string', 'null'],
                    },
                    'phone': {
                      'type': ['string', 'integer', 'null'],
                    },
                    'push': {
                      'type': ['object', 'null'],
                      'required': ['platform', 'device', 'endpoint'],
                      'properties': {
                        'platform': {
                          'type': 'string',
                          'enum': ['gcm', 'apns', 'apns_sandbox'],
                        },
                        'device': {
                          'type': 'string',
                        },
                        'endpoint': {
                          'type': 'string',
                        },
                        'data': {
                          'type': ['object', 'null'],
                          'additionalProperties': true,
                        },
                      },
                      'additionalProperties': false,
                    },
                    'callback': {
                      'type': ['object', 'null'],
                      'required': ['type'],
                      'properties': {
                        'type': {
                          'type': 'string',
                          'enum': ['http']
                        },
                        'uri': {
                          'type': ['string', 'null']
                        },
                        'headers': {
                          'type': ['array', 'null'],
                          'items': {
                            'type': 'string',
                          }
                        },
                        'data': {
                          'type': ['object', 'null'],
                          'additionalProperties': true,
                        },
                      },
                      'additionalProperties': false,
                    },
                    'vars': {
                      'type': ['object', 'null'],
                      'additionalProperties': true,
                    },
                },
                'additionalProperties': false,
              },
              'minItems': 1,
            },
            'channels': {
              'type': ['array', 'null'],
              'items': {
                'type': ['string'],
                'enum': Template.getChannelTypes(),
              }
            }
          },
          'additionalProperties': false
        },
        timeCreated: {
          type: ['number', 'null'],
        },
        timeUpdated: {
          type: ['number', 'null'],
        },
      },
      'additionalProperties': false
    }

    return schema
  }
}
