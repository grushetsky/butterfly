import Flytime from '../core/flytime'
import { TestCaseUnexpectedResultError } from '../core/common'

import chai from 'chai'

let expect = chai.expect

describe(`Butterfly runtime`, () => {

  describe(`default`, () => {

    it(`should initialize successfully`, (done) => {
      let defaultFlytime = Flytime.CreateDefaultFlytime()
      defaultFlytime.init().then(() => {
        done()
      }).catch((error) => {
        done(error)
      })
    })

    // it('should throw an error if initialization takes too long', (done) => {
    //   let defaultFlytime = Flytime.CreateDefaultFlytime()
    //   defaultFlytime.init().then(() => {
    //     done(new TestCaseUnexpectedResultError(`Runtime was initialized successfully!`))
    //   }).catch((error) => {
    //     done(error)
    //   })
    // })

    // it('should start successfully', (done) => {
    //   let defaultFlytime = Flytime.CreateDefaultFlytime()
    //   defaultFlytime.init().then(() => {
    //     defaultFlytime.start()
    //   }).then(() => {
    //     done()
    //   }).catch((error) => {
    //     done(error)
    //   })
    // })

  })

})
