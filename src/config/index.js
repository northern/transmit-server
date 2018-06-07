
let config

export default () => {
  if (!config) {
    config = {
      port: process.env.PORT || 3000,
      storageType: (process.env.STORAGE_TYPE || 'mysql').toLowerCase(),
      databaseUrl: process.env.DATABASE_URL,
    }
  }

  return config
}
