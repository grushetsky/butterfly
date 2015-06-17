import { SuccessResult, NavigationFailError } from './results'
import { MessengerFactory } from './messaging'

class AbstractNavigator {

  goTo(url: string, done: Function) {}

}

export class NavigatorFactory {

  static CreateMockWebNavigator(options) {
    return new WebNavigator(new MockNavigationStrategy(options))
  }

  static CreateRemoteWebNavigator() {
    var messenger = MessengerFactory.CreateRemoteMessenger()
    return new WebNavigator(new RemoteNavigationStrategy(messenger))
  }

}

class AbstractNavigationStrategy {

  transition(url: string, done: Function) {}

}

class MockNavigationStrategy extends AbstractNavigationStrategy {

  constructor(options) {
    super()
    this._transitionResult = options.transitionResult
  }

  transition(url: string, done: Function) {
    if (this._transitionResult === true) {
      done(null, new SuccessResult())
    } else {
      done(new NavigationFailError(), null)
    }
  }

}

class RemoteNavigationStrategy extends AbstractNavigationStrategy {

  constructor(messenger) {
    super()
    this._messenger = messenger;
  }

  transition(url: string, done: Function) {
    this._messenger.send('navigation.transition', { url: url }, (err, result) => {
      if (err) {
        done(err, result)
      }
    })
    this._messenger.on('navigation.transition-finished', (data) => {
      done(err, result)
    })
  }

}

export class WebNavigator extends AbstractNavigator {

  constructor(navigationStrategy) {
    super()
    this._historyPosition = 0
    this._history = ['butterfly://home']
    this._navigationStrategy = navigationStrategy
  }

  goTo(url: string, done: Function) {
    this._navigationStrategy.transition(url, (err, result) => {
      if (!err) {
        this._history.push(url)
        this._historyPosition++
      }
      done(err, result)
    })
  }

  getCurrentUrl() {
    return this._history[this._historyPosition]
  }

}

// class Navigation {

//   constructor(navigatee) {
//     this.navigatee = navigatee;
//     this.historyPosition = 0;
//     this.history = ["butterfly://home"];
//     this.toCommands = [{
//       name: "navigate",
//       dataScheme: [ guid, url ]
//     }];
//     this.fromCommands = [{
//       name: "navigation-finished",
//       dataScheme: [ guid ]
//     }];
//   }

//   goBack() {
//     if (historyPosition > 0) {
//       navigatee.transition(--historyPosition);
//     }
//   }

//   goForward() {

//   }1

//   goTo(url) {
//     this.navigatee.transition(function success() {
//       this.history.push(url);
//     }, function error(errorCode) {
//       // Do nothing
//     });
//   }

//   processReply(command, parametersObject) {
//     if (command.name == "go-back") {
//       goBack();
//     }
//   }

// }

// class ButterflyEntity {

//   getCommand() {
//       this.commands = [];
//       this.fromCommands = [];
//   }

// }

// class ButterflyCommand {

//   constructor() {
//     this.name
//   }

// }


// class KioBrowserNavigatee extends INavigatee {

//   constructor(messagingMechanism) {
//     this.setMessagingMechanism(messagingMechanism);
//   }

//   transition(url, successCb, errorCb) {
//     // Do it
//   }

// }


// class StandaloneNavigatee extends INavigatee {

//   constructor(messagingMechanism) {
//     this.setMessagingMechanism(messagingMechanism);
//     this.messagingMechanism.subscribe(Navigation.processReply);
//   }

//   transition(url, successCb, errorCb) {
//     messagingMechanism.sendCommandWithResult('navigate', { url: url }, function (result, error) {
//       if (!error) {
//         successCb();
//       } else {
//         errorCb();
//       }
//     });
//   }

// }

// class ANavigatee {

//   setMessagingMechanism(messagingMechanism) {
//     this.messagingMechanism = messagingMechanism;
//   }

//   transition(url, successCb, errorCb) {
//     // Do something super common if you wish, but that's not recommended though
//   }

// }

// class LocalBusMessenger extends IMessagingMechanism {

//   constructor(eventEmitter) {
//     this.eventEmitter = eventEmitter;
//     this.subscribers = [];
//   }

//   sendCommand(command, parametersObject, resultCallback) {
//     eventEmitter.sendWithResponse(command, parametersObject, function (result) {
//       if (result.success) {
//         resultCallback(result, error);
//       } else {
//         resultCallback(result, "Couldn't send the message!");
//       }
//     });
//   }

//   onCommandReceived(command, parametersObject) {
//     this.subscribers.forEach(function (subscriber) {
//       subscriber(command, parametersObject);
//     }
//   }

//   subscribe(me) {
//     this.subscribers.push(me);
//   }

// }

// class IMessagingMechanism {

//   subscribe() {}

//   sendCommandWithResult(command, parametersObject, resultCallback) {}

//   sendCommand(command, parametersObject) {}

//   onCommandReceived(command, parametersObject) {}

// }

// class NavigateeFactory {

//   static createStandaloneNavigatee(messagingMechanism) {
//     return new StandaloneNavigatee(messagingMechanism);
//   }


//   static createKioBrowserNavigatee(messagingMechanism) {
//     return new KioBrowserNavigatee(messagingMechanism);
//   }

// }

// class MessagingMechanismFactory {

//   static createLocalBusMessenger() {
//     return new LocalBusMessenger(require('events').EventEmitter);
//   }

//   static createSocketMessenger() {
//     return new SocketMessenger();
//   }

// }