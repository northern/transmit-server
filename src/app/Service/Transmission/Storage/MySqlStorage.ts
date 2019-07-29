
import ILogger from '../../../ILogger'
import IStorage from './IStorage'
import Transmission from '../../../Entity/Transmission'
import JsonUtil from '../../../Util/JsonUtil'

export default class MySqlStorage implements IStorage {
  private logger: ILogger

  setLogger(logger: ILogger): void {
    this.logger = logger
  }

  async getById(id: string, connection: any): Promise<Transmission | null> {
    let transmission = null

    try {
      const [results] = await connection.query(
        'SELECT * FROM `transmissions` WHERE `id` = ?', [id]
      )

      const result = results[0]

      if (result) {
        transmission = new Transmission(
          result.message_id,
          result.channel
        )
        transmission.id = result.id
        transmission.token = result.token
        transmission.status = result.status
        transmission.target = JsonUtil.parseSafe(result.target)
        transmission.vars = JsonUtil.parseSafe(result.vars)
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

  async getByMessageId(id: string, connection: any): Promise<Transmission[]> {
    let transmissions: Transmission[] = []

    try {
      const [results] = await connection.query(
        'SELECT * from `transmissions` WHERE `message_id` = ?', [id]
      )

      results.map((result: object): void => {
        const map: Map<string, any> = new Map(Object.entries(result))

        const transmission = new Transmission(
          map.get('message_id'),
          map.get('channel')
        )
        transmission.id = map.get('id')
        transmission.token = map.get('token')
        transmission.status = map.get('status')
        transmission.target = JsonUtil.parseSafe(map.get('target'))
        transmission.vars = JsonUtil.parseSafe(map.get('vars'))
        transmission.error = map.get('error')
        transmission.tries = map.get('tries')
        transmission.timeCreated = map.get('time_created')
        transmission.timeUpdated = map.get('time_updated')

        transmissions.push(transmission)
      })
    }
    catch (err) {
      throw new Error(err)
    }

    return transmissions
  }

  async persist(transmission: Transmission, connection: any): Promise<Transmission> {
    try {
      if (!transmission.id) {
        transmission.timeCreated = Math.floor(new Date().getTime() / 1000)

        const results = await connection.query(
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

        transmission.id = results[0].insertId
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
