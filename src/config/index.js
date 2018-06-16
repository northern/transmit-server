
let config

const getSqs = () => ({
  sqsClientVersion: process.env.SQS_CLIENT_VERSION,
  sqsClientRegion: process.env.SQS_CLIENT_REGION,
  sqsClientKey: process.env.SQS_CLIENT_KEY,
  sqsClientSecret: process.env.SQS_CLIENT_SECRET,
})

const getSmtp = () => ({
  username: process.env.SMTP_USERNAME,
  password: process.env.SMTP_PASSWORD,
  endpoint: process.env.SMTP_ENDPOINT,
  port: parseInt(process.env.SMTP_PORT) || 587,
  isSecure: process.env.SMTP_SECURE === 'true'
})

const getAwsInternal = () => ({
  awsClientVerion: process.env.AWS_CLIENT_VERSION || 'latest',
  awsClientRegion: process.env.AWS_CLIENT_REGION,
  awsClientKey: process.env.AWS_CLIENT_KEY,
  awsClientSecret: process.env.AWS_CLIENT_SECRET,
})

const getAwsExternal = () => ({
  stsClientVersion: process.env.STS_CLIENT_VERSION || 'latest',
  stsClientRegion: process.env.STS_CLIENT_REGION,
  stsClientKey: process.env.STS_CLIENT_KEY,
  stsClientSecret: process.env.STS_CLIENT_SECRET,
  stsClientExternalId: process.env.STS_CLIENT_EXTERNAL_ID,
  stsClientArn: process.env.STS_CLIENT_ARN,
  stsClientCacheTimeout: process.env.STS_CLIENT_CACHE_TIMEOUT,
})

const getHttp = () => ({
  httpUrl: process.env.HTTP_URL,
})

const getSlack = () => ({
  slackUri: process.env.SLACK_WEBHOOK_URI,
})

export default () => {
  if (!config) {
    config = {
      isDebug: process.env.NODE_ENV !== 'production',
      server: {
        port: process.env.SERVER_PORT || 3000,
      },

      defaults: {
        sender: {
          from: process.env.DEFAULT_SENDER_FROM,
          email: process.env.DEFAULT_SENDER_EMAIL,
        }
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
            config = Object.assign({}, config, getSqs())
          }
          break
        }

        return config
      })(process.env.QUEUE_PROVIDER),

      integrations: ((email, sms, push, callback, chat) => {
        config = {
          providers: {
            smtp: getSmtp(),
            aws: getAwsInternal(),
            sts: getAwsExternal(),
            http: getHttp(),
            slack: getSlack(),
          },
          channels: {}
        }

        if (email) {
          config.channels.email = email.toLowerCase()
        }

        if (sms) {
          config.channels.sms = sms.toLowerCase()
        }

        if (push) {
          config.channels.push = push.toLowerCase()
        }

        if (callback) {
          config.channels.callback = callback.toLowerCase()
        }

        if (chat) {
          config.channels.chat = chat.toLowerCase()
        }

        return config
      })(
        process.env.INTEGRATION_EMAIL,
        process.env.INTEGRATION_SMS,
        process.env.INTEGRATION_PUSH,
        process.env.INTEGRATION_CALLBACK,
        process.env.INTEGRATION_CHAT
      )
    }
    
    if (process.env.NODE_ENV !== 'production') {
      console.log("%o", config)
    }
  }

  return config
}
