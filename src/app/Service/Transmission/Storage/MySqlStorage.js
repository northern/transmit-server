
import AbstractStorage from './AbstractStorage'
import Transmission from '../../../Entity/Transmission'

export default class MySqlStorage extends AbstractStorage {
  async getById(id, connection) {
    let transmission = null

    try {

    }
    catch(err) {
      throw new Error(err)
    }

    return transmission
  }

  async persist(transmission, connection) {
    if (!transmission.id) {
      transmission.timeCreated = Math.floor(new Date().getTime() / 1000)

      try {

      }
      catch(err) {
        throw new Error(err)
      }
    }
    else {
      transmission.timeUpdated = Math.floor(new Date().getTime() / 1000)

      try {

      }
      catch(err) {
        throw new Error(err)
      }
    }

    return transmission
  }
}
