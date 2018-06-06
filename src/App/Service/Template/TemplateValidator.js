
import Template from '../../Entity/Template'

export default class TemplateValidator {
  setLogger(logger) {
    this.logger = logger
  }

  getSchema() {
    const schema = {
      // 'title' => "Postways Template Schema",
      // 'type' => 'object',
      // 'required' => ['name', 'title', 'description', 'enabled', 'status', 'revision', 'category', 'revisions'],
      // 'properties' => (object)[
      //     'id' => (object)[
      //         'type' => ['integer', 'string', 'null'],
      //     ],
      //     'name' => (object)[
      //         'type' => 'string',
      //         'minLength' => 2,
      //         'maxLength' => 64,
      //     ],
      //     'title' => (object)[
      //         'type' => 'string',
      //         'minLength' => 2,
      //         'maxLength' => 64,
      //     ],
      //     'category' => (object)[
      //         'type' => 'object',
      //         'required' => ['name', 'title'],
      //         'properties' => (object)[
      //             'name' => (object)[
      //                 'type' => ['string', 'null'],
      //                 'maxLength' => 64,
      //             ],
      //             'title' => (object)[
      //                 'type' => 'string',
      //                 'minLength' => 1,
      //                 'maxLength' => 64,
      //             ],
      //         ],
      //         'additionalProperties' => false,
      //     ],
      //     'description' => (object)[
      //         'type' => ['string', 'null'],
      //         'maxLength' => 256,
      //     ],
      //     'enabled' => (object)[
      //         'type' => 'boolean'
      //     ],
      //     'status' => (object)[
      //         'type' => 'string',
      //         'enum' => Template::getStatuses(),
      //         'maxLength' => 16,
      //     ],
      //     'revision' => (object)[
      //         'type' => 'integer',
      //     ],
      //     'revisions' => (object)[
      //         'type' => ['array'],
      //         'items' => (object)[
      //             'type' => 'object',
      //             'required' => ['number', 'parent', 'channels', 'default'/*, 'email', 'sms', 'push', 'callback', 'test'*/],
      //             'properties' => (object)[
      //                 'number' => (object)[
      //                     'type' => 'integer',
      //                 ],
      //                 'parent' => (object)[
      //                     'type' => 'integer',
      //                 ],
      //                 'channels' => self::getChannelsType(),
      //                 'default' => self::getDefaultType(),
      //                 'email' => self::getEmailType(),
      //                 'sms' => self::getSmsType(),
      //                 'push' => self::getPushType(),
      //                 'callback' => self::getCallbackType(),
      //                 'test' => (object)[
      //                     'type' => ['object', 'null'],
      //                     'required' => ['vars'],
      //                     'properties' => (object)[
      //                         'vars' => (object)[
      //                             'type' => ['array', 'object', 'null'],
      //                             'additionalProperties' => true,
      //                         ],
      //                     ],
      //                     'additionalProperties' => false,
      //                 ],
      //             ],
      //             'additionalProperties' => false,
      //         ],
      //         'minItems' => 1,
      //     ],

      //     'team' => (object)[
      //         'type' => ['object', 'null'],
      //     ],
      //     'testers' => (object)[
      //         'type' => ['object', 'null'],
      //     ],

      //     'timeCreated' => (object)[
      //         'type' => ['integer', 'null'],
      //     ],
      //     'timeUpdated' => (object)[
      //         'type' => ['integer', 'null'],
      //     ],
      // ],
      // //'additionalProperties' => false,
    }

    return schema
  }

  getChannelsType() {
    return {
      'type': 'object',
      'properties': {
        'preferred': {
          'type': ['array', 'null'],
          'items': {
            'type': 'string',
            'enum': Template.getChannelTypes(),
          },
        },
        'required': {
          'type': ['array', 'null'],
          'items': {
            'type': 'string',
            'enum': Template.getChannelTypes(),
          },
        },
      },
      'additionalProperties': false,
    }
  }

  getDefaultType() {
    return {
      'type': 'object',
      'required': ['title', 'body'],
      'properties': {
        'title': {
          'type': 'string',
          //'minLength': 1,
          'maxLength': 64,
        },
        'body': {
          'type': ['string', 'null'],
        },
      },
      'additionalProperties': false,
    }
  }

  getEmailType() {
    return {
      'type': 'object',
      'required': ['body'],
      'properties': {
        'title': {
          'type': ['string', 'null'],
          'maxLength': 64,
        },
        'senderName': {
          'type': ['string', 'null'],
          'maxLength': 32,
        },
        'senderEmail': {
          'type': 'email',
        },
        'body': {
          'type': 'object',
          //'required': ['text', 'html', 'isHtml'],
          'properties': {
            'text': {
              'type': ['string', 'null'],
            },
            'html': {
              'type': ['string', 'null'],
            },
          },
          'additionalProperties': false,
        },
        'isHtml': {
          'type': 'bool'
        },
      },
      'additionalProperties': false,
    }
  }

  getSmsType() {
    return {
      'type': 'object',
      'required': ['body'],
      'properties': {
        'from': {
          'type': ['string', 'null'],
          'maxLength': 64,
        },
        'body': {
          'type': ['string', 'null'],
        },
      },
      'additionalProperties': false,
    }
  }

  getPushType() {
    return {
      'type': 'object',
      'required': ['body'],
      'properties': {
        'title': {
          'type': ['string', 'null'],
          'maxLength': 64,
        },
        'from': {
          'type': ['string', 'null'],
          'maxLength': 32,
        },
        'body': {
          'type': ['string', 'null'],
        },
      },
      'additionalProperties': false,
    }
  }

  getCallbackType() {
    return {
      'type': 'object',
      'required': ['body'],
      'properties': {
        'title': {
          'type': ['string', 'null'],
          'maxLength': 64,
        },
        'from': {
          'type': ['string', 'null'],
          'maxLength': 32,
        },
        'body': {
          'type': ['string', 'null'],
        },
      },
      'additionalProperties': false,
    }
  }
}
