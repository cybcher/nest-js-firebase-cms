export type Config = {
  [env in Environments]: {
    db: {
      mysql: credentialsMySQL
    }
    auth: {
      secret: string
    }
    firebase: {
      projectId: string,
      privateKey: string,
      clientEmail: string,
      databaseURL: string,
    }
  }
}

export type credentialsMySQL = {
  host: string
  user: string
  port: number
  password: string
  database: string
}

export type Environments = 'local' | 'development' | 'production' | string
