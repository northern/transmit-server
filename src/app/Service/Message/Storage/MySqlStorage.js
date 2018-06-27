
import AbstractStorage from './AbstractStorage'
import Message from '../../../Entity/Message'

export default class MySqlStorage extends AbstractStorage {
  async getById(id, connection) {
    let message = null

    try {
      const [rows, fields] = await connection.query(
        'SELECT * FROM `messages` WHERE `id` = ?', [id]
      )

      const result = rows[0]

      if (result) {
        message = new Message()
        message.id = result.id
        message.token = result.token
        message.status = result.status
        message.environment = result.environment
        message.error = result.error
        message.data = JSON.parse(result.data)
        message.template = JSON.parse(result.template)
        message.timeCreated = result.time_created
        message.timeUpdated = result.time_updated
      }
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
        const result = await connection.query(
          'INSERT INTO messages SET ?', {
            token: message.token,
            status: message.status,
            error: message.error,
            environment: message.environment,
            data: JSON.stringify(message.data),
            template: JSON.stringify(message.template),
            time_created: message.timeCreated,
            time_updated: message.timeUpdated,
          }
        )

        message.id = result[0].insertId
      }
      catch(err) {
        throw new Error(err)
      }
    }
    else {
      message.timeUpdated = Math.floor(new Date().getTime() / 1000)

      try {
        await connection.query(
          'UPDATE messages SET ? WHERE id = ?', [{
            token: message.token,
            status: message.status,
            error: message.error,
            environment: message.environment,
            data: JSON.stringify(message.data),
            template: JSON.stringify(message.template),
            time_created: message.timeCreated,
            time_updated: message.timeUpdated,
          }, message.id]
        )
      }
      catch(err) {
        throw new Error(err)
      }
    }

    return message
  }
}
