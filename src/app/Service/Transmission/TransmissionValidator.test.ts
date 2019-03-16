
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
    const transmission: Transmission = new Transmission(1, Transmission.CHANNEL_EMAIL)
    transmission.target = 'info@postways.com'

    const result: object = transmissionValidator.validate(transmission)

    expect(result).toBeInstanceOf(Object)
    expect(result).toHaveProperty('errors')

    const map: Map<string, any> = new Map(Object.entries(result))

    expect(map.get('errors')).toBeInstanceOf(Array)
    expect(map.get('errors').length).toBe(0)
  })
})
