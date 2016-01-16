import { ButterflyTimeoutError } from '../core/common'

import socketIoClient from 'socket.io-client'

export default class MockRemoteMessengerClient {
  static CreateEchoClient(options) {
    return new RemoteMessengerEchoClient(options.port)
  }
}

class RemoteMessengerEchoClient extends MockRemoteMessengerClient {
  constructor(port) {
    super()
    this._connectionTimeout = 2000
    this._port = port
  }

  connect() {
    return new Promise((resolve, reject) => {
      // console.log(`Echo client tries to connect to server on port ${this._port}.`)
      this._socket = socketIoClient.connect(`ws://localhost:${this._port}`)
      this._socket.on('connect', () => {
        resolve()
      })
      this._socket.on('disconnect', (socket) => {
        this._socket.close();
        this._socket = null
      })
      this._socket.on('ping', (data) => {
        this._socket.emit('pong', data)
      })
      setTimeout(() => {
        reject(new ButterflyTimeoutError('connect', this._connectionTimeout))
      }, this._connectionTimeout)
    })
  }
}
