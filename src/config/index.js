
let config

export default () => {
  if (!config) {
    config = {
      isDebug: () => process.env.NODE_ENV !== 'production',
      server: {
        port: process.env.SERVER_PORT || 3000,
      },
      aws: {
        client: {
          version: process.env.AWS_CLIENT_VERSION,
          region: process.env.AWS_CLIENT_REGION,
        }
      },
      database: {
        type: (process.env.DATABASE_TYPE || 'mysql').toLowerCase(),
        url: process.env.DATABASE_URL,
      },
      queue: {
        type: (process.env.QUEUE_TYPE || 'sqs').toLowerCase(),
        name: process.env.QUEUE_NAME,
      }
    }
    
    if (process.env.NODE_ENV !== 'production') {
      console.log(config)
    }
  }

  return config
}
