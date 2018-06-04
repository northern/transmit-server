
import Bottle from 'bottlejs'

import logger from '../App/Util/logger'
import initTemplateService from './template'
import initTransmissionService from './transmission'
import initCommand from './command'
import initQuery from './query'

const bottle = new Bottle()

bottle.factory('logger', container => logger)

initTemplateService(bottle)
initTransmissionService(bottle)
initCommand(bottle)
initQuery(bottle)

export default bottle.container
