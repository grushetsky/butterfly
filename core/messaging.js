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
}

class SocketIoMessenger extends Messenger {
  constructor(port) {
    super()
    this._port = port
    this._clientSockets = []
    this._io = socketIo()

    // Maintain list of connected clients and notify each client upon
    // connection with 'connection-ok' message
    this._io.on('connection', (socket) => {
      // console.log(`Socket '${socket.id}' connected!`)
      this._clientSockets.push(socket)
      socket.on('disconnect', () => {
        // console.log(`Socket '${socket.id}' was closed.`)
        this._clientSockets.splice(this._clientSockets.indexOf(socket), 1)
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
        done(data)
      })
    })
  }

  send(commandName: string, data: Object) {

    // Sends message to all connected clients what's probably a bad idea...
    this._io.emit(commandName, data)
  }
}

export class MessengerError extends ButterflyError {
  constructor(message) {
    super(message)
  }
}

