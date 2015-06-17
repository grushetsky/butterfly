import { NavigatorFactory } from '../core/navigation'
import { SuccessResult, NavigationFailError } from '../core/results'
import chai from 'chai'

let expect = chai.expect

describe('Navigation', () => {

  describe('mock Web navigator', () => {

    it('should transition to supplied URL', (done) => {
      var navigator = NavigatorFactory.CreateMockWebNavigator({ transitionResult: true})
      var targetUrl = 'http://example.com/'
      navigator.goTo(targetUrl, (err, result) => {
        expect(result.constructor).to.equal(SuccessResult)
        expect(navigator.getCurrentUrl()).to.equal(targetUrl)
        done()
      })
    })

    it('should not navigate if navigation error was caught', (done) => {
      var navigator = NavigatorFactory.CreateMockWebNavigator({ transitionResult: false})
      var targetUrl = 'http://example.com/'
      var originalUrl = navigator.getCurrentUrl()
      navigator.goTo(targetUrl, (err, result) => {
        expect(err.constructor).to.equal(NavigationFailError)
        expect(navigator.getCurrentUrl()).to.equal(originalUrl)
        done()
      })
    })

  })

  // describe('remote Web navigator', () => {

  //   it('should transition to supplied URL', (done) => {
  //     var navigator = NavigatorFactory.CreateRemoteWebNavigator()
  //     var targetUrl = 'http://example.com/'
  //     navigator.goTo(targetUrl, (err, result) => {
  //       expect(result.constructor).to.equal(SuccessResult)
  //       expect(navigator.getCurrentUrl()).to.equal(targetUrl)
  //       done()
  //     })
  //   })

  // })

})