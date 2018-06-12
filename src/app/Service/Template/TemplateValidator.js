
import Template from '../../Entity/Template'

export default class TemplateValidator {
  setLogger(logger) {
    this.logger = logger
  }

  getSchema() {
    const schema = {
      title: "Postways Template Schema",
      type: 'object',
      required: ['name', 'title', 'description', 'enabled', 'status', 'revision', 'category', 'revisions'],
      properties: {
          id: {
            type: ['integer', 'string', 'null'],
          },
          name: {
            type: 'string',
            minLength: 2,
            maxLength: 64,
          },
          title: {
            type: 'string',
            minLength: 2,
            maxLength: 64,
          },
          'category': {
            type: 'object',
            required: ['name', 'title'],
            properties: {
              name: {
                type: ['string', 'null'],
                maxLength: 64,
              },
              title: {
                type: 'string',
                minLength: 1,
                maxLength: 64,
              },
            },
            additionalProperties: false,
          },
          description: {
            type: ['string', 'null'],
            maxLength: 256,
          },
          enabled: {
            type: 'boolean'
          },
          status: {
            type: 'string',
            enum: Template.getStatuses(),
            maxLength: 16,
          },
          revision: {
            type: 'integer',
          },
          revisions: {
            type: ['array'],
            items: {
              type: 'object',
              required: ['number', 'parent', 'channels', 'default'/*, 'email', 'sms', 'push', 'callback', 'test'*/],
              properties: {
                number: {
                  type: 'integer',
                },
                parent: {
                  type: 'integer',
                },
                channels: Template.getChannelsType(),
                default: Template.getDefaultType(),
                email: Template.getEmailType(),
                sms: Template.getSmsType(),
                push: Template.getPushType(),
                callback: Template.getCallbackType(),
                test: {
                  type: ['object', 'null'],
                  required: ['vars'],
                  properties: {
                    vars: {
                      type: ['array', 'object', 'null'],
                      additionalProperties: true,
                    },
                  },
                  additionalProperties: false,
                },
              },
              additionalProperties: false,
            },
            minItems: 1,
          },

          'timeCreated': {
              'type': ['integer', 'null'],
          },
          'timeUpdated': {
              'type': ['integer', 'null'],
          },
      },
      'additionalProperties': false,
    }

    return schema
  }

  getChannelsType() {
    return {
      type: 'object',
      properties: {
        preferred: {
          type: ['array', 'null'],
          items: {
            type: 'string',
            enum: Template.getChannelTypes(),
          },
        },
        required: {
          type: ['array', 'null'],
          items: {
            type: 'string',
            enum: Template.getChannelTypes(),
          },
        },
      },
      additionalProperties: false,
    }
  }

  getDefaultType() {
    return {
      type: 'object',
      required: ['title', 'body'],
      properties: {
        title: {
          type: 'string',
          //minLength: 1,
          maxLength: 64,
        },
        body: {
          type: ['string', 'null'],
        },
      },
      additionalProperties: false,
    }
  }

  getEmailType() {
    return {
      type: 'object',
      required: ['body'],
      properties: {
        title: {
          type: ['string', 'null'],
          maxLength: 64,
        },
        senderName: {
          type: ['string', 'null'],
          maxLength: 32,
        },
        senderEmail: {
          type: 'email',
        },
        body: {
          type: 'object',
          //required: ['text', 'html', 'isHtml'],
          properties: {
            text: {
              type: ['string', 'null'],
            },
            html: {
              type: ['string', 'null'],
            },
          },
          additionalProperties: false,
        },
        isHtml: {
          type: 'bool'
        },
      },
      additionalProperties: false,
    }
  }

  getSmsType() {
    return {
      type: 'object',
      required: ['body'],
      properties: {
        from: {
          type: ['string', 'null'],
          maxLength: 64,
        },
        body: {
          type: ['string', 'null'],
        },
      },
      additionalProperties: false,
    }
  }

  getPushType() {
    return {
      type: 'object',
      required: ['body'],
      properties: {
        title: {
          type: ['string', 'null'],
          maxLength: 64,
        },
        from: {
          type: ['string', 'null'],
          maxLength: 32,
        },
        body: {
          type: ['string', 'null'],
        },
      },
      additionalProperties: false,
    }
  }

  getCallbackType() {
    return {
      type: 'object',
      required: ['body'],
      properties: {
        title: {
          type: ['string', 'null'],
          maxLength: 64,
        },
        from: {
          type: ['string', 'null'],
          maxLength: 32,
        },
        body: {
          type: ['string', 'null'],
        },
      },
      additionalProperties: false,
    }
  }
}
