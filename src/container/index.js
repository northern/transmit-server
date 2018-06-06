
import Bottle from 'bottlejs'

import logger from '../App/Util/logger'
import initTemplateService from './service/template'
import initTransmissionService from './service/transmission'
import initCommand from './command'
import initQuery from './query'

export default (config) => {
  const bottle = new Bottle()

  bottle.factory('logger', container => logger)

  initTemplateService(bottle, config)
  initTransmissionService(bottle, config)
  initCommand(bottle, config)
  initQuery(bottle, config)

  return bottle.container
}
