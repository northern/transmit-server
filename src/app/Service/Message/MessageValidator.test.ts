
import {
  ValidationError
} from 'jsonschema'

import Message from '../../Entity/Message'
import MessageValidator from './MessageValidator'

describe('getSchema', () => {
  let messageValidator: MessageValidator

  beforeEach(() => {
    messageValidator = new MessageValidator()
  })

  it('should return the schema', () => {
    const schema: object = messageValidator.getSchema()

    expect(schema).toBeInstanceOf(Object)
    expect(schema).toHaveProperty('title')
    expect(schema).toHaveProperty('type')
    expect(schema).toHaveProperty('required')
    expect(schema).toHaveProperty('properties')
  })
})

describe('validate', () => {
  let messageValidator: MessageValidator

  beforeEach(() => {
    messageValidator = new MessageValidator()
  })

  it('should validate', () => {
    const message: Message = new Message()
    message.id = 1
    message.data = {
      template: {
        channels: {
          required: ['email'],
        },
      },
      recipients: [{
        email: "info@postways.com",
      }]
    }

    const result: object = messageValidator.validate(message)

    expect(result).toBeInstanceOf(Object)
    expect(result).toHaveProperty('errors')
    expect(result.errors).toBeInstanceOf(Array)
    expect(result.errors.length).toBe(0)
  })

  it('should not validate without data', () => {
    const message: Message = new Message()
    message.id = 1

    const result: object = messageValidator.validate(message)

    expect(result).toBeInstanceOf(Object)
    expect(result).toHaveProperty('errors')
    expect(result.errors).toBeInstanceOf(Array)
    expect(result.errors.length).toBe(1)
    expect(result.errors[0]).toBeInstanceOf(ValidationError)
    expect(result.errors[0].name).toBe('type')
    expect(result.errors[0].property).toBe('instance.data')
  })

  it('should not validate without a valid status', () => {
    const message: Message = new Message({})
    message.id = 1
    message.status = 'unknown'

    const result: object = messageValidator.validate(message)

    expect(result).toBeInstanceOf(Object)
    expect(result).toHaveProperty('errors')
    expect(result.errors).toBeInstanceOf(Array)
    expect(result.errors.length).toBe(1)
    expect(result.errors[0]).toBeInstanceOf(ValidationError)
    expect(result.errors[0].name).toBe('enum')
    expect(result.errors[0].property).toBe('instance.status')
  })
})
