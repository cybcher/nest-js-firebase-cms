import { existsSync, readFileSync } from 'fs'
import { resolve } from 'path'

export const readJsonFile = (path: string) =>
  JSON.parse(readFileSync(resolve(__dirname, path)).toString('utf8'))

export const readConfig = (path: string) =>
  existsSync(resolve(__dirname, path)) ? readJsonFile(path) : {}
