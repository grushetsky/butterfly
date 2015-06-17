import Flytime from '../core/flytime'
import { FlytimeStartFailError, SuccessResult, FailResult } from '../core/results'
import chai from 'chai'

let expect = chai.expect

describe('Butterfly mock runtime', () => {

  describe('mock runtime', () => {

    let flytime = Flytime.CreateMockFlytime()

    it('should be able to start successfully', (done) => {
      flytime.expectedResult = new SuccessResult()
      flytime.start((err, result) => {
        if (err) {
          return done(err)
        }
        done()
      })
    })

    it('should be able to gracefully fail if start wasn\'t successful', (done) => {
      flytime.expectedResult = new FailResult()
      flytime.start((err, result) => {
        if (err.constructor === FlytimeStartFailError) {
          return done()
        }
        done(new Error('Must not be started at all'))
      })
    })

  })

  // describe('default runtime', () => {

  //   let flytime = Flytime.CreateDefaultFlytime()

  //   it('should be able to start successfully', (done) => {
  //     flytime.start((err, result) => {
  //       if (err) {
  //         return done(err)
  //       }
  //       done()
  //     })
  //   })
  // })

})