
export default class MySqlStorage {
  setLogger(logger) {
    this.logger = logger
  }

  getById(id) {
    return {
      id: id
    }
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
