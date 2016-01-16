import Flytime from '../core/flytime'
import { TestCaseUnexpectedResultError } from '../core/common'
import Messenger, { MessengerError, MessengerStartError } from '../core/messaging'

import MockRemoteMessengerClient from '../mock/mock-messaging'

import chai from 'chai'

let expect = chai.expect

describe(`Messaging`, () => {

  describe(`remote messenger`, () => {

    let correctServerOptions = {
      port: 7890,
      mechanism: 'SoCkeT.iO'
    }, unsupportedServerOptions = {
      mechanism: 'unsupported'
    }

    describe('used with unsupported messaging mechanism', () => {
      it('should throw an error if such a mechanism is encountered', (done) => {
        try {
          let messenger = Messenger.CreateRemoteMessenger(unsupportedServerOptions)
          done(new TestCaseUnexpectedResultError(`Remote messenger was successfully created!`))
        } catch (error) {
          if (error instanceof MessengerError) {
            done()
          } else {
            done(new TestCaseUnexpectedResultError(`Got unexpected error ${error.constructor.name}!`))
          }
        }
      })
    })

    describe('used with supported messaging mechanism', () => {
      let messenger = Messenger.CreateRemoteMessenger(correctServerOptions)

      beforeEach(() => {
        messenger.start()
      })

      afterEach(() => {
        messenger.stop()
      })

      it(`should receive 'pong' and echo of the request payload on 'ping'`, (done) => {
        let testPayload = {
          surname: "Gult",
          description: "Who is speaking?!"
        }

        messenger.on('pong', (data) => {
          expect(data.surname).to.equal("Gult")
          done()
        })

        messenger.waitForClientConnection().then(() => {
          messenger.send('ping', testPayload)
        })

        let mockEchoMessengerClient = MockRemoteMessengerClient.CreateEchoClient(correctServerOptions)
        mockEchoMessengerClient.connect()
      })
    })

  })

})
