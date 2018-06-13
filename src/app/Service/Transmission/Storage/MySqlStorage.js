
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
        const result = await connection.query(
          'INSERT INTO transmissions SET ?', {
            message_id: transmission.messageId,
            status: transmission.status,
            type: transmission.type,
            target: transmission.target instanceof Object ? JSON.stringify(transmission.target) : transmission.target,
            vars: JSON.stringify(transmission.vars),
            error: transmission.error,
            time_created: transmission.timeCreated,
            time_updated: transmission.timeUpdated,
          }
        )

        transmission.id = result[0].insertId
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
