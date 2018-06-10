
import AbstractStorage from './AbstractStorage'
import Message from '../../../Entity/Message'

export default class MySqlStorage extends AbstractStorage {
  async getById(id, connection) {
    let message = null

    try {

    }
    catch(err) {
      throw new Error(err)
    }

    return message
  }

  async persist(message, connection) {
    if (!message.id) {
      message.timeCreated = Math.floor(new Date().getTime() / 1000)

      try {

      }
      catch(err) {
        throw new Error(err)
      }
    }
    else {
      message.timeUpdated = Math.floor(new Date().getTime() / 1000)

      try {

      }
      catch(err) {
        throw new Error(err)
      }
    }

    return message
  }
}
