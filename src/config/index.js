
export default () => {
  const config = {
    storageType: (process.env.STORAGE_TYPE || 'mysql').toLowerCase(),
    databaseUrl: process.env.DATABASE_URL,
  }

  return config
}
