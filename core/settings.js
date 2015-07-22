import { ButterflyError } from '../core/common'

import fs from 'fs'
import _ from 'underscore'

export default class Settings {
  static get DefaultFilePath() {
    return '../settings.json'
  }

  static CreateInstance(object: Object = {}) {
    return _(new Settings()).assign(object)
  }

  static LoadFromFile(filePath: string) {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf8', (error, data) => {
        if (error) {
          reject(new FileNotFoundError(filePath))
          return
        }

        try {
          var dataObject = JSON.parse(data)
        } catch (error) {
          reject(new JsonParsingError(data))
          return
        }

        resolve(Settings.CreateInstance(dataObject))
      })
    })
  }

  static LoadFromObject(object: Object) {
    return new Promise((resolve, reject) => {
      resolve(Settings.CreateInstance(object))
    })
  }
}

export class FileNotFoundError extends ButterflyError {
  constructor(filePath) {
    super(`Could not open "${filePath}"! Check if path is correct and file exists.`);
  }
}

export class JsonParsingError extends ButterflyError {
  constructor(jsonString) {
    super(`Could not parse JSON: "${jsonString}"!`);
  }
}
