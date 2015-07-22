import Settings, { FileNotFoundError, JsonParsingError } from '../core/settings'
import { ButterflyError, TestCaseUnexpectedResultError, spawn } from '../core/common'

import chai from 'chai'

let expect = chai.expect

describe(`Settings`, () => {

  describe(`from in-memory object`, () => {

    let configObject = { thisFieldMustExist: null }

    it(`should load correctly`, (done) => {
      Settings.LoadFromObject(configObject).then((settings) => {
        expect(settings).to.include.keys('thisFieldMustExist')
        done()
      }).catch(error => {
        done(error)
      })
    })

  })

  describe(`from file`, () => {

    let configFilePath = './mock/test-settings.json',
      unexistingConfigFilePath = './mock/!@#$.json',
      brokenConfigFilePath = './mock/test-broken-settings.json'

    it(`should load correctly`, (done) => {
      Settings.LoadFromFile(configFilePath).then((settings) => {
        expect(settings).to.include.key('test-field')
        done()
      }).catch(error => {
        done(error)
      })
    })

    it(`should load correctly using generators syntax`, (done) => {
      spawn(function* () {
        try {
          var settings = yield Settings.LoadFromFile(configFilePath)
          expect(settings).to.include.key('test-field')
          done()
        } catch (error) {
          done(error)
        }
      })
    })

    it(`should throw an error if the file cannot be found`, (done) => {
      Settings.LoadFromFile(unexistingConfigFilePath).then(() => {
        done(new TestCaseUnexpectedResultError(`File was read successfully!`))
      }).catch(error => {
        if (error instanceof FileNotFoundError) {
          done()
        } else {
          done(new TestCaseUnexpectedResultError(`Got unexpected error '${error.constructor.name}'!`))
        }
      })
    })

    it(`should throw an error if the file contents cannot be parsed`, (done) => {
      Settings.LoadFromFile(brokenConfigFilePath).then(() => {
        done(new TestCaseUnexpectedResultError(`File was parsed successfully!`))
      }).catch(error => {
        if (error instanceof JsonParsingError) {
          done()
        } else {
          done(new TestCaseUnexpectedResultError(`Got unexpected error ${error.constructor.name}!`))
        }
      })
    })

  })

})
