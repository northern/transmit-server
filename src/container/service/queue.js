
import QueueService from '../../app/Service/Queue/QueueService'
import SqsProvider from '../../app/Service/Queue/Provider/SqsProvider'

const initSqsProvider = (container) => {
  const config = container.get('config')
  const logger = container.get('logger')

  const sqs = SqsProvider.getSqsClient(
    config.queue.sqsClientVersion,
    config.queue.sqsClientRegion,
    {accessKeyId: config.queue.sqsClientKey, secretAccessKey: config.queue.sqsClientSecret},
  )

  new Promise((resolve, reject) => {
    const params = {
      QueueName: config.queue.name,
      Attributes: {
        DelaySeconds: '0',
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
      console.log("SQS provider initialized ->", result.QueueUrl)
    }

    const provider = new SqsProvider()
    provider.setLogger(logger)
    provider.setSqsClient(sqs)
    provider.setQueueUrl(result.QueueUrl)

    container.service('sqsProvider', () => provider)
  })
}

const initQueueProviders = (container) => {
  const config = container.get('config')

  switch (config.queue.provider) {
    case QueueService.PROVIDER_SQS:
      initSqsProvider(container)
      break
  }
}

export default (container) => {
  initQueueProviders(container)

  container.service('queueService', container => {
    const config = container.get('config')
    const logger = container.get('logger')
    
    const service = new QueueService()
    service.setLogger(logger)

    switch (config.queue.type) {
      case QueueService.TYPE_SQS: {
        service.setProvider(container.get('sqsProvider'))
      }
      break
    }

    return service
  }, true)
}
