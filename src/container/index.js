
import Bottle from 'bottlejs'

import logger from '../app/Util/logger'
import initPersistanceService from './service/persistance'
import initQueueService from './service/queue'
import initTemplateService from './service/template'
import initTransmissionService from './service/transmission'
import initCommand from './command'
import initQuery from './query'

export default (config) => {
  const bottle = new Bottle()

  bottle.service('logger', () => logger)
  bottle.service('config', () => config)

  initPersistanceService(bottle)
  initQueueService(bottle)
  initTemplateService(bottle)
  initTransmissionService(bottle)
  initCommand(bottle)
  initQuery(bottle)

  return bottle.container
}
