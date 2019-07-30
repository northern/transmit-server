
import Koa from 'koa'
import morgan from 'morgan'

import container from './container'

const config = () => {
  return {
    database: {
      provider: 'mysql'
    }
  }
}

const init = async() => {
  const server = new Koa();

  server.context.container = await container(config())

  server.use(async (ctx: any) => {
    const logger = ctx.container.get('logger')
    const service = ctx.container.get('transmissionService')
    
    logger.info(service)

    ctx.body = 'Hello World';
  });

  server.listen(3000, () => {
    console.info(`Transmit Server running on port ${3000}`)
  });
}

init();
