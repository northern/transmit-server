
import Response from '../Response'
import AppError from '../Error/AppError'
import AbstractCommand from './AbstractCommand'

export default class TransmissionProcessCommand extends AbstractCommand {
  setQueueService(queueService) {
    this.queueService = queueService
  }

  setTransmissionService(transmissionService) {
    this.transmissionService = transmissionService
  }

  async execute(transmissionId) {
    const response = new Response()

    const connection = await this.persistenceService.beginTransaction()

    try {

      /*
      const transmission = await this.transmissionService.create(data, connection)

      // TODO: Queue transmission for processing.
      await this.queueService.add({
        type: 'transmission',
        data: {
          id: transmission.id,
        }
      })

      response.transmission = transmission
      */

      await this.persistenceService.commit(connection)
    }
    catch(e) {
      await this.persistenceService.rollback(connection)

      if (e instanceof AppError) {
        response.status  = Response.ERROR
        response.message = e.message
      }
      else {
        throw e
      }
    }

    this.persistenceService.releaseConnection(connection)

    return response
  }
}
