
import Koa from 'koa'

const init = async() => {
  const server = new Koa();

  server.use(async (ctx: any) => {
    ctx.body = 'Hello World';
  });

  server.listen(3000);
}

init();
