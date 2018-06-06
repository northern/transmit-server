
import util from 'util'

export default class MySqlStorage {
  setLogger(logger) {
    this.logger = logger
  }

  setConnection(connection) {
    this.connection = connection

    this.connection.query = util.promisify(this.connection.query)
    this.connection.beginTransaction = util.promisify(this.connection.beginTransaction)
    this.connection.commit = util.promisify(this.connection.commit)
    this.connection.rollback = util.promisify(this.connection.rollback)
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
}
