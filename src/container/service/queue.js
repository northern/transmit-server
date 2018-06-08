
import Aws from 'aws-sdk'

import QueueService from '../../App/Service/Queue/QueueService'
import SqsProvider from '../../App/Service/Queue/Provider/SqsProvider'

function initQueueDependencies(bottle) {
  const config = bottle.container.config

  switch (config.queue.type) {
    case QueueService.TYPE_SQS: {
      const sqs = new Aws.SQS({
        region: config.aws.client.region,
        version: config.aws.client.version,
      })

      const params = {
        QueueName: config.queue.name,
        Attributes: {
          DelaySeconds: '60',
          MessageRetentionPeriod: '86400',
        }
      }

      new Promise((resolve, reject) => {
        sqs.createQueue(params, (err, result) => {
          if (err) {
            reject(err)
          }
          else {
            resolve(sqs)
          }
        })
      })
      .then(sqs => {
        console.log("SQS initialized")
        bottle.service('sqs', () => sqs)
      })
    }
    break
  }
}

export default (bottle) => {

  initQueueDependencies(bottle)

  bottle.factory('queueService', container => {
    const { config } = container
    
    const service = new QueueService()
    service.setLogger(container.logger)

    switch (config.queue.type) {
      case QueueService.TYPE_SQS: {
        const provider = new SqsProvider()
        provider.setLogger(container.logger)
        provider.setSqs(container.sqs)

        service.setProvider(provider)
      }
      break
    }

    return service
  })
}
