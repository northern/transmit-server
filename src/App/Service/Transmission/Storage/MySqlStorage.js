
import util from 'util'
import mysql from 'mysql'

export default class MySqlStorage {
  setLogger(logger) {
    this.logger = logger
  }

  setConnection(connection) {
    this.connection = connection
  }

  getById(id) {
    return {
      id: id
    }
  }

  async persist(transmission) {
    if (!transmission.id) {
      transmission.timeCreated = Math.floor(new Date().getTime() / 1000)

      try {
        const result = await this.connection.query(
          'INSERT INTO transmissions SET ?', {
            token: transmission.token,
            status: transmission.status,
            error: transmission.error,
            data: JSON.stringify(transmission.data),
            time_created: transmission.timeCreated,
            time_updated: transmission.timeUpdated,
          }
        )

        transmission.id = result.insertId
      }
      catch(err) {
        throw new Error(err)
      }
    }
    else {
      transmission.timeUpdated = Math.floor(new Date().getTime() / 1000)

      try {
        await this.connection.query(
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

  async beginTransaction() {
    await this.connection.beginTransaction()
  }

  async commit() {
    await this.connection.commit()
  }

  async rollback() {
    await this.connection.rollback()
  }

  obtainConnection(url) {
    const connection = mysql.createConnection(url);

    connection.query = util.promisify(connection.query)
    connection.beginTransaction = util.promisify(connection.beginTransaction)
    connection.commit = util.promisify(connection.commit)
    connection.rollback = util.promisify(connection.rollback)

    return connection
  }
}
