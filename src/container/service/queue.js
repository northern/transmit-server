
import QueueService from '../../app/Service/Queue/QueueService'
import SqsProvider from '../../app/Service/Queue/Provider/SqsProvider'

function initQueueProviders(bottle) {
  const config = bottle.container.config

  switch (config.queue.provider) {
    case QueueService.PROVIDER_SQS: {
      const sqs = SqsProvider.getSqsClient(
        config.aws.client.version,
        config.aws.client.region
      )

      new Promise((resolve, reject) => {
        const params = {
          QueueName: config.queue.name,
          Attributes: {
            DelaySeconds: '60',
            MessageRetentionPeriod: '86400',
          }
        }

        sqs.createQueue(params, (err, result) => {
          if (err) {
            reject(err)
          }
          else {
            resolve(result)
          }
        })
      })
      .then((result) => {
        if (process.env.NODE_ENV !== 'production') {
          console.log("SQS initialized ->", result.QueueUrl)
        }

        const provider = new SqsProvider()
        provider.setLogger(bottle.container.logger)
        provider.setSqsClient(sqs)
        provider.setQueueUrl(result.QueueUrl)

        bottle.service('sqsProvider', () => provider)
      })
    }
    break
  }
}

export default (bottle) => {
  initQueueProviders(bottle)

  bottle.factory('queueService', container => {
    const { config } = container
    
    const service = new QueueService()
    service.setLogger(container.logger)

    switch (config.queue.type) {
      case QueueService.TYPE_SQS: {
        service.setProvider(container.sqsProvider)
      }
      break
    }

    return service
  })
}
