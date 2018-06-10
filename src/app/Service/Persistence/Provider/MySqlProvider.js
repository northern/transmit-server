
import mysql from 'mysql2/promise'

export default class MySqlProvider {
  setLogger(logger) {
    this.logger = logger
  }

  init(options) {
    this.pool = mysql.createPool(options.url)
  }

  async getConnection() {
    return await this.pool.getConnection()
  }

  async releaseConnection(connection) {
    connection.release()
  }

  async beginTransaction(connection) {
    await connection.query('START TRANSACTION')
  }

  async commit(connection) {
    await connection.query('COMMIT')
  }

  async rollback(connection) {
    if (connection) {
      await connection.query('ROLLBACK')
    }
  }
}
