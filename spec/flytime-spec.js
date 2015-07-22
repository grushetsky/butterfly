import Flytime, { MockFlytime } from '../core/flytime'
import { FlytimeStartFailError, SuccessResult, FailResult } from '../core/results'
import chai from 'chai'

let expect = chai.expect

describe('Butterfly runtime', () => {

  describe('mock runtime', () => {

    let mockFlytime = Flytime.CreateMockFlytime()

    it('should initialize successfully', (done) => {
      mockFlytime.init().then(mockFlytime.start).then(() => {
        done()
      }).catch((error) => {
        done(error)
      })
    })

    // it('should start successfully', (done) => {
    //   mockFlytime.start().then(() => {
    //     done()
    //   }).catch((error) => {
    //     done(error)
    //   })
    // })

    // it('should be able to gracefully fail if start wasn\'t successful', (done) => {
    //   flytime.expectedResult = new FailResult()
    //   flytime.start((err, result) => {
    //     if (err.constructor === FlytimeStartFailError) {
    //       return done()
    //     }
    //     done(new Error('Must not be started at all'))
    //   })
    // })

  })

  // describe('default runtime', () => {

  //   let flytime = Flytime.CreateDefaultFlytime()

  //   it('should initialize', (done) => {
  //     flytime.start((err, result) => {
  //       if (err) {
  //         return done(err)
  //       }
  //       done()
  //     })
  //   })
  // })

})
