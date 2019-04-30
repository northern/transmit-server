
import Koa from 'koa'
import morgan from 'morgan'

const init = async() => {
  const server = new Koa();

  server.use(async (ctx: any) => {
    ctx.body = 'Hello World';
  });

  server.listen(3000, () => {
    console.info(`Transmit Server running on port ${3000}`)
  });
}

init();
