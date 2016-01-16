import { ButterflyError } from './common'

import socketIo from 'socket.io'

export default class Messenger {
  static CreateRemoteMessenger(options: Object) {
    if (options.mechanism.toLowerCase() === 'socket.io') {
      return new SocketIoMessenger(options.port)
    } else {
      throw new MessengerError(`Can't create remote messenger! Unknown messaging mechanism '${options.mechanism}'.`)
    }
  }

  start() {}
  stop() {}
  on(commandName: string, done: Function) {}
  send(commandName: string, data: Object) {}
  waitForClientConnection() {}
}

class SocketIoMessenger extends Messenger {
  constructor(port) {
    super()
    this._port = port
    this._io = socketIo()

    this._io.on('connection', (socket) => {
      // console.log(`Socket '${socket.id}' connected!`)
      socket.on('disconnect', () => {
        // console.log(`Socket '${socket.id}' was closed.`)
      })
      socket.on('error', (error) => {
        // console.log(`Error occurred on socket '${socket.id}': `, error)
      })
    })
  }

  start() {
    // console.log(`Server started listening on port ${this._port}.`)
    this._io.listen(this._port)
  }

  stop() {

    // Close all existing client connections and stop listening
    this._io.close()
  }

  on(commandName: string, done: Function) {
    this._io.on('connection', (socket) => {
      socket.on(commandName, (data) => {
        console.log('messaging.on:', commandName, data)
        done(data)
      })
    })
  }

  send(commandName: string, data: Object) {

    // Sends message to all connected clients what's probably a bad idea...
    this._io.emit(commandName, data)
  }

  waitForClientConnection() {
    return new Promise((resolve, reject) => {
      this._io.on('connection', (socket) => {
        resolve()
      })

      // TODO: Probably a good idea to add a timeout here...
    })
  }
}

export class MessengerError extends ButterflyError {
  constructor(message) {
    super(message)
  }
}

