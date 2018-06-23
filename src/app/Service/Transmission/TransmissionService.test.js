
import Message from '../../Entity/Message'
import Revision from '../../Entity/Template/Revision'
import Transmission from '../../Entity/Transmission'
import TransmissionTarget from '../../Entity/TransmissionTarget'
import TransmissionService from './TransmissionService'
import TransmissionHelper from './TransmissionHelper'

class MockTransmissionRepository {
  persist(transmission, connection) {
    return transmission
  }
}

describe('create (required channels)', () => {
  const mockRepository = new MockTransmissionRepository()

  const transmissionService = new TransmissionService()
  transmissionService.setHelper(new TransmissionHelper())
  transmissionService.setRepository(mockRepository)

  it("should return one transmission", async () => {
    const message = new Message()
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

    const revision = new Revision()
    revision.unserialize(message.data.template)

    const transmissions = await transmissionService.create(message, revision, [])

    expect(transmissions.length).toBe(1)
    expect(transmissions[0].channel).toEqual('email')
    expect(transmissions[0].target).toEqual("info@postways.com")
  })

  it("should return two transmissions", async () => {
    const message = new Message()
    message.data = {
      template: {
        channels: {
          required: ['email', 'sms'],
        },
      },
      recipients: [{
        email: "info@postways.com",
        phone: "0123456789"
      }]
    }

    const revision = new Revision()
    revision.unserialize(message.data.template)

    const transmissions = await transmissionService.create(message, revision, [])

    expect(transmissions.length).toBe(2)

    let transmission

    transmission = transmissions.find(transmission => transmission.channel === 'email')
    expect(transmission.channel).toEqual('email')
    expect(transmission.target).toEqual("info@postways.com")

    transmission = transmissions.find(transmission => transmission.channel === 'sms')
    expect(transmission.channel).toEqual('sms')
    expect(transmission.target).toEqual("0123456789")
  })  

  it("should return three transmissions", async () => {
    const message = new Message()
    message.data = {
      template: {
        channels: {
          required: ['email', 'sms', 'push'],
        },
      },
      recipients: [{
        email: "info@postways.com",
        phone: "0123456789",
        push: {
          token: "abc123"
        }
      }]
    }

    const revision = new Revision()
    revision.unserialize(message.data.template)

    const transmissions = await transmissionService.create(message, revision, [])

    expect(transmissions.length).toBe(3)

    let transmission

    transmission = transmissions.find(transmission => transmission.channel === 'email')
    expect(transmission.channel).toEqual('email')
    expect(transmission.target).toEqual("info@postways.com")

    transmission = transmissions.find(transmission => transmission.channel === 'sms')
    expect(transmission.channel).toEqual('sms')
    expect(transmission.target).toEqual("0123456789")

    transmission = transmissions.find(transmission => transmission.channel === 'push')
    expect(transmission.channel).toEqual('push')
    expect(transmission.target).toEqual({token: "abc123"})
  })  

  it("should return four transmissions", async () => {
    const message = new Message()
    message.data = {
      template: {
        channels: {
          required: ['email', 'sms', 'push', 'callback'],
        },
      },
      recipients: [{
        email: "info@postways.com",
        phone: "0123456789",
        push: {
          token: "abc123"
        },
        callback: "http://www.example.com"
      }]
    }

    const revision = new Revision()
    revision.unserialize(message.data.template)

    const transmissions = await transmissionService.create(message, revision, [])

    expect(transmissions.length).toBe(4)

    let transmission

    transmission = transmissions.find(transmission => transmission.channel === 'email')
    expect(transmission.channel).toEqual('email')
    expect(transmission.target).toEqual("info@postways.com")

    transmission = transmissions.find(transmission => transmission.channel === 'sms')
    expect(transmission.channel).toEqual('sms')
    expect(transmission.target).toEqual("0123456789")

    transmission = transmissions.find(transmission => transmission.channel === 'push')
    expect(transmission.channel).toEqual('push')
    expect(transmission.target).toEqual({token: "abc123"})

    transmission = transmissions.find(transmission => transmission.channel === 'callback')
    expect(transmission.channel).toEqual('callback')
    expect(transmission.target).toEqual("http://www.example.com")
  })  

  it("should return five transmissions", async () => {
    const message = new Message()
    message.data = {
      template: {
        channels: {
          required: ['email', 'sms', 'push', 'callback', 'chat'],
        },
      },
      recipients: [{
        email: "info@postways.com",
        phone: "0123456789",
        push: {
          token: "abc123"
        },
        callback: "http://www.example.com",
        chat: {
          username: "bob",
          password: "s3cr3t"
        }
      }]
    }

    const revision = new Revision()
    revision.unserialize(message.data.template)

    const transmissions = await transmissionService.create(message, revision, [])

    expect(transmissions.length).toBe(5)

    let transmission

    transmission = transmissions.find(transmission => transmission.channel === 'email')
    expect(transmission.channel).toEqual('email')
    expect(transmission.target).toEqual("info@postways.com")

    transmission = transmissions.find(transmission => transmission.channel === 'sms')
    expect(transmission.channel).toEqual('sms')
    expect(transmission.target).toEqual("0123456789")

    transmission = transmissions.find(transmission => transmission.channel === 'push')
    expect(transmission.channel).toEqual('push')
    expect(transmission.target).toEqual({token: "abc123"})

    transmission = transmissions.find(transmission => transmission.channel === 'callback')
    expect(transmission.channel).toEqual('callback')
    expect(transmission.target).toEqual("http://www.example.com")

    transmission = transmissions.find(transmission => transmission.channel === 'chat')
    expect(transmission.channel).toEqual('chat')
    expect(transmission.target).toEqual({username: "bob", password: "s3cr3t"})
  })  
})


describe('create (preferred channels)', () => {
  const mockRepository = new MockTransmissionRepository()

  const transmissionService = new TransmissionService()
  transmissionService.setHelper(new TransmissionHelper())
  transmissionService.setRepository(mockRepository)

  it("should return an email transmission", async () => {
    const message = new Message()
    message.data = {
      template: {
        channels: {
          preferred: ['email', 'sms', 'push', 'callback', 'chat']
        },
      },
      recipients: [{
        email: "info@postways.com",
      }]
    }

    const revision = new Revision()
    revision.unserialize(message.data.template)

    const transmissions = await transmissionService.create(message, revision, [])

    expect(transmissions.length).toBe(1)
    expect(transmissions[0].channel).toEqual('email')
    expect(transmissions[0].target).toEqual("info@postways.com")
  })

  it("should return an sms transmission", async () => {
    const message = new Message()
    message.data = {
      template: {
        channels: {
          preferred: ['email', 'sms', 'push', 'callback', 'chat']
        },
      },
      recipients: [{
        phone: "0123456789"
      }]
    }

    const revision = new Revision()
    revision.unserialize(message.data.template)

    const transmissions = await transmissionService.create(message, revision, [])

    expect(transmissions.length).toBe(1)
    expect(transmissions[0].channel).toEqual('sms')
    expect(transmissions[0].target).toEqual("0123456789")
  })

  it("should return a push transmission", async () => {
    const message = new Message()
    message.data = {
      template: {
        channels: {
          preferred: ['email', 'sms', 'push', 'callback', 'chat']
        },
      },
      recipients: [{
        push: {
          token: "abc123"
        }
      }]
    }

    const revision = new Revision()
    revision.unserialize(message.data.template)

    const transmissions = await transmissionService.create(message, revision, [])

    expect(transmissions.length).toBe(1)
    expect(transmissions[0].channel).toEqual('push')
    expect(transmissions[0].target).toEqual({token: "abc123"})
  })

  it("should return a callback transmission", async () => {
    const message = new Message()
    message.data = {
      template: {
        channels: {
          preferred: ['email', 'sms', 'push', 'callback', 'chat']
        },
      },
      recipients: [{
        callback: "http://www.example.com"
      }]
    }

    const revision = new Revision()
    revision.unserialize(message.data.template)

    const transmissions = await transmissionService.create(message, revision, [])

    expect(transmissions.length).toBe(1)
    expect(transmissions[0].channel).toEqual('callback')
    expect(transmissions[0].target).toEqual("http://www.example.com")
  })

  it("should return a chat transmission", async () => {
    const message = new Message()
    message.data = {
      template: {
        channels: {
          preferred: ['email', 'sms', 'push', 'callback', 'chat']
        },
      },
      recipients: [{
        chat: {
          username: "bob",
          password: "s3cr3t"
        }
      }]
    }

    const revision = new Revision()
    revision.unserialize(message.data.template)

    const transmissions = await transmissionService.create(message, revision, [])

    expect(transmissions.length).toBe(1)
    expect(transmissions[0].channel).toEqual('chat')
    expect(transmissions[0].target).toEqual({username: "bob", password: "s3cr3t"})
  })
})
