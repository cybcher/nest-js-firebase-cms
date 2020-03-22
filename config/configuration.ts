import { merge } from 'lodash'

import { readConfig } from '../src/utils'
import { Config } from './types'

const initialConfig: Config = readConfig('../../data/config.json')
const credentials: Config = readConfig('../../data/credentials.json')
const packageFile = readConfig('../../package.json')

if (!process.env.NODE_ENV) {
  throw Error('Process environment is required!')

  // eslint-disable-next-line no-unreachable
  process.exit(0)
}

const allowedEnvironments = ['local', 'development', 'production']

if (!allowedEnvironments.includes(process.env.NODE_ENV)) {
  throw Error('Process environment not allowed! Choose another!')

  // eslint-disable-next-line no-unreachable
  process.exit(0)
}

const env: string = process.env.NODE_ENV

const defaultConfig = {
  host: '127.0.0.1',
  port: process.env.PORT || 7070,
  env,
  version: packageFile.version,
  name: packageFile.name,
}

export default () =>
  merge({}, defaultConfig, initialConfig[env], credentials[env])
