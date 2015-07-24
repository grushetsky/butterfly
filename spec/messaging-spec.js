import Flytime from '../core/flytime'
import { TestCaseUnexpectedResultError } from '../core/common'
import Messenger from '../core/messaging'

import MockRemoteMessengerClient from '../mock/mock-messaging'

import chai from 'chai'

let expect = chai.expect

describe(`Messaging`, () => {

  describe(`remote`, () => {

    let serverOptions = {
      port: 7890,
      mechanism: 'SoCkeT.iO'
    }
    let messenger = Messenger.CreateRemoteMessenger(serverOptions)

    beforeEach(() => {
      messenger.start()
    })

    afterEach(() => {
      messenger.stop()
    })

    it(`should receive 'pong' and echo of the sent payload on 'ping'`, (done) => {
      let testPayload = {
        surname: "Gult",
        description: "Who is speaking?!"
      }

      messenger.on('pong', (data) => {
        expect(data.surname).to.equal("Gult")
        done()
      })

      let mockEchoMessengerClient = MockRemoteMessengerClient.CreateEchoClient(serverOptions)
      mockEchoMessengerClient.connect().then(() => {
        messenger.send('ping', testPayload)
      })
    })

  })

})
