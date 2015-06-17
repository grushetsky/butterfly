import socketIo from 'socket.io'
import { SuccessResult } from './results'

class AbstractMessenger {

  send(command: string, data, done: Function) {}

  on(command: string, done: Function) {}

}

class RemoteMessenger extends AbstractMessenger {

  constructor(messagingStrategy) {
    super()
    this._messagingStrategy = messagingStrategy
  }

  send(command: string, data, done: Function) {
    this._messagingStrategy.sendCommand(command, data, (err, result) => {
      if (err) {
        done(err, result)
      }
      done(err, new SuccessResult())
    })
  }

  on(command: string, done: Function) {
    this._messagingStrategy.onCommandReceived(command, (data) => {
      done(data)
    })
  }

}

class AbstractMessagingStrategy {

  sendCommand(command: string, data, done: Function) {}

  onCommandReceived(command: string, done: Function) {}

}

class SocketIoMessagingStrategy extends AbstractMessagingStrategy {

  constructor(options) {
    super()
    initServer(this)
    this._namespaces = {}
    this._subscribers = []

    function initServer(self) {
      self._io = socketIo()
      self._io.on('connection', (socket) => {
         console.log("Socket connected: " + socket.id)
      })
      self._io.listen(options.port)
    }
  }

  _onMessageReceived(socket) {
    socket.on('navigation.transition-finished', (data) => {
      console.log("Received message!!! Transition done!")
      this._subscribers.forEach((subscriber) => {
        subscriber(data)
      })
    })
  }

  sendCommand(command: string, data, done: Function) {
    var namespaceName = command.split('.')[0]
    this._namespaces[namespaceName] = this._io.of('/' + namespaceName)
    this._namespaces[namespaceName].on('connection', this._onMessageReceived)

    // TODO: Send to defined namespace instead of default namespace
    this._io.sockets.emit(command.split('.')[1], data)
    // this._namespaces[namespaceName].emit(command.split('.')[1], data)

    done(null, new SuccessResult())
  }

  onCommandReceived(command: string, done: Function) {
    this._subscribers.push(done)
  }

}

export class MessengerFactory {

  static CreateRemoteMessenger() {
    if (!this._sharedStrategy) {
      this._sharedStrategy = new SocketIoMessagingStrategy({ port: 5678 })
    }
    return new RemoteMessenger(this._sharedStrategy)
  }

}