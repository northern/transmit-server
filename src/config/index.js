
let config

export default () => {
  if (!config) {
    config = {
      isDebug: process.env.NODE_ENV !== 'production',
      server: {
        port: process.env.SERVER_PORT || 3000,
      },

      database: ((provider) => {
        if (!provider) {
          throw new Error("Missing database provider in config.")
        }

        let config = {
          provider: provider.toLowerCase()
        }

        switch (config.provider) {
          case 'mysql': {
            config = Object.assign({}, config, {
              url: `mysql://${process.env.MYSQL_USER}:${process.env.MYSQL_PASSWORD}@${process.env.MYSQL_HOST}/${process.env.MYSQL_DATABASE}`,
            })
          }
          break;
        }

        return config        
      })(process.env.DATABASE_PROVIDER),
      
      queue: ((provider) => {
        if (!provider) {
          throw new Error("Missing queue provider in config.")
        }

        let config = {
          provider: provider.toLowerCase(),
          name: process.env.QUEUE_NAME,
        }

        switch (config.provider) {
          case 'sqs': {
            config = Object.assign({}, config, {
              sqs_client_version: process.env.SQS_CLIENT_VERSION,
              sqs_client_region: process.env.SQS_CLIENT_REGION,
              sqs_client_credentials: {
                accessKeyId: process.env.SQS_CLIENT_KEY,
                secretAccessKey: process.env.SQS_CLIENT_SECRET,
              }
            })
          }
          break
        }

        return config
      })(process.env.QUEUE_PROVIDER)
    }
    
    if (process.env.NODE_ENV !== 'production') {
      console.log(config)
    }
  }

  return config
}
