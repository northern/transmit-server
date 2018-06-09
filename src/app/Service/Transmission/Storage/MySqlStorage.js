
import AbstractStorage from './AbstractStorage'
import Transmission from '../../../Entity/Transmission'

export default class MySqlStorage extends AbstractStorage {
  async getById(id, connection) {
    let transmission = null

    try {
      const [rows, fields] = await connection.query(
        'SELECT * FROM `transmissions` WHERE `id` = ?', [id]
      )

      const result = rows[0]

      if (result) {
        transmission = new Transmission()
        transmission.id = result.id
        transmission.token = result.token
        transmission.status = result.status
        transmission.error = result.error
        transmission.data = JSON.parse(result.data)
        transmission.timeCreated = result.time_created
        transmission.timeUpdated = result.time_updated
      }
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
            token: transmission.token,
            status: transmission.status,
            error: transmission.error,
            data: JSON.stringify(transmission.data),
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
        await connection.query(
          'UPDATE transmissions SET ?', {
            token: transmission.token,
            status: transmission.status,
            error: transmission.error,
            data: JSON.stringify(transmission.data),
            time_created: transmission.timeCreated,
            time_updated: transmission.timeUpdated,
          }
        )
      }
      catch(err) {
        throw new Error(err)
      }
    }

    return transmission
  }
}
