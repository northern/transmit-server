
import AbstractStorage from './AbstractStorage'
import Transmission from '../../../Entity/Transmission'
import JSONUtil from '../../../Util/JSONUtil'

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
        transmission.messageId = result.message_id
        transmission.token = result.token
        transmission.status = result.status
        transmission.channel = result.channel
        transmission.target = JSONUtil.parseSafe(result.target)
        transmission.vars = JSONUtil.parseSafe(result.vars)
        transmission.error = result.error
        transmission.tries = result.tries
        transmission.timeCreated = result.time_created
        transmission.timeUpdated = result.time_updated
      }
    }
    catch (err) {
      throw new Error(err)
    }

    return transmission
  }

  async getByMessageId(id, connection) {
    let transmissions = []

    try {
      const [results, fields] = await connection.query(
        'SELECT * from `transmissions` WHERE `message_id` = ?', [id]
      )

      results.map(result => {
        const transmission = new Transmission()
        transmission.id = result.id
        transmission.messageId = result.message_id
        transmission.token = result.token
        transmission.status = result.status
        transmission.channel = result.channel
        transmission.target = JSONUtil.parseSafe(result.target)
        transmission.vars = JSONUtil.parseSafe(result.vars)
        transmission.error = result.error
        transmission.tries = result.tries
        transmission.timeCreated = result.time_created
        transmission.timeUpdated = result.time_updated

        transmissions.push(transmission)
      })
    }
    catch (err) {
      throw new Error(err)
    }

    return transmissions
  }

  async persist(transmission, connection) {
    try {
      if (!transmission.id) {
        transmission.timeCreated = Math.floor(new Date().getTime() / 1000)

        const result = await connection.query(
          'INSERT INTO transmissions SET ?', {
            message_id: transmission.messageId,
            token: transmission.token,
            status: transmission.status,
            channel: transmission.channel,
            target: transmission.target instanceof Object ? JSON.stringify(transmission.target) : transmission.target,
            vars: transmission.vars instanceof Object ? JSON.stringify(transmission.vars) : null,
            error: transmission.error,
            tries: transmission.tries,
            time_created: transmission.timeCreated,
            time_updated: transmission.timeUpdated,
          }
        )

        transmission.id = result[0].insertId
      }
      else {
        transmission.timeUpdated = Math.floor(new Date().getTime() / 1000)

        await connection.query(
          'UPDATE transmissions SET ? WHERE id = ?', [{
            message_id: transmission.messageId,
            token: transmission.token,
            status: transmission.status,
            channel: transmission.channel,
            target: transmission.target instanceof Object ? JSON.stringify(transmission.target) : transmission.target,
            vars: transmission.vars instanceof Object ? JSON.stringify(transmission.vars) : null,
            error: transmission.error,
            tries: transmission.tries,
            time_created: transmission.timeCreated,
            time_updated: transmission.timeUpdated,
          }, transmission.id]
        )
      }
    }
    catch (err) {
      throw new Error(err)
    }

    return transmission
  }
}
