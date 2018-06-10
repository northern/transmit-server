
import Response from '../Response'
import AppError from '../Error/AppError'
import AbstractCommand from './AbstractCommand'
import Transmission from '../Entity/Transmission'

export default class TransmissionProcessCommand extends AbstractCommand {
  setQueueService(queueService) {
    this.queueService = queueService
  }

  setTransmissionService(transmissionService) {
    this.transmissionService = transmissionService
  }

  async execute(transmission) {
    const response = new Response()

    let connection

    try {
      connection = await this.persistenceService.beginTransaction()

      const values = {
        status: Transmission.STATUS_PROCESSING
      }

      transmission = await this.transmissionService.update(transmission, values, connection)

      await this.persistenceService.commit(connection)
      await this.persistenceService.releaseConnection(connection)

      connection = null


      response.transmission = transmission


      /*
      const transmission = await this.transmissionService.create(data, connection)

      // TODO: Queue transmission for processing.
      await this.queueService.add({
        type: 'transmission',
        data: {
          id: transmission.id,
        }
      })
      */
    }
    catch(e) {
      console.log(e)
      await this.persistenceService.rollback(connection)

      if (e instanceof AppError) {
        response.status  = Response.ERROR
        response.message = e.message
      }
      else {
        throw e
      }
    }
    finally {
      await this.persistenceService.releaseConnection(connection)
    }

    return response
  }
}
