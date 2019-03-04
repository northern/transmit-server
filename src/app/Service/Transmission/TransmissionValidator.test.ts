
import Transmission from '../../Entity/Transmission'
import TransmissionValidator from './TransmissionValidator'

describe('getSchema', () => {
  let transmissionValidator: TransmissionValidator

  beforeEach(() => {
    transmissionValidator = new TransmissionValidator()
  })

  it('should return the schema', () => {
    const schema: object = transmissionValidator.getSchema()

    expect(schema).toBeInstanceOf(Object)
    expect(schema).toHaveProperty('title')
    expect(schema).toHaveProperty('type')
    expect(schema).toHaveProperty('required')
    expect(schema).toHaveProperty('properties')
  })
})

describe('validate', () => {
  let transmissionValidator: TransmissionValidator

  beforeEach(() => {
    transmissionValidator = new TransmissionValidator()
  })

  it('should validate', () => {
    const transmission: Transmission = new Transmission()
    transmission.messageId = 1
    transmission.channel = Transmission.CHANNEL_EMAIL
    transmission.target = 'info@postways.com'

    const result: object = transmissionValidator.validate(transmission)

    expect(result).toBeInstanceOf(Object)
    expect(result).toHaveProperty('errors')
    expect(result.errors).toBeInstanceOf(Array)
    expect(result.errors.length).toBe(0)
  })
})
