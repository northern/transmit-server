
import Container from '@northern/di'

import logger from '../app/Util/logger'
import initPersistanceService from './service/persistance'
import initQueueService from './service/queue'
import initTemplateService from './service/template'
import initMessageService from './service/message'
import initTransmissionService from './service/transmission'
import initIntegrationService from './service/integration'
import initCommand from './command'
import initQuery from './query'

export default async (config) => {
  const container = new Container()

  container.service('logger', () => logger)
  container.service('config', () => config)

  await initPersistanceService(container)
  await initQueueService(container)
  await initTemplateService(container)
  await initMessageService(container)
  await initTransmissionService(container)
  await initIntegrationService(container)
  await initCommand(container)
  await initQuery(container)

  return container
}
