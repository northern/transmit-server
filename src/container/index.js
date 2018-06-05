
import Bottle from 'bottlejs'

import logger from '../App/Util/logger'
import initTemplateService from './service/template'
import initTransmissionService from './service/transmission'
import initCommand from './command'
import initQuery from './query'

const bottle = new Bottle()

bottle.factory('logger', container => logger)

initTemplateService(bottle)
initTransmissionService(bottle)
initCommand(bottle)
initQuery(bottle)

export default bottle.container
