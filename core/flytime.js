import { ButterflyTimeoutError } from './common'
// import { FunctionResult, SuccessResult, FailResult, FlytimeStartFailError } from './results'
// import { NavigatorFactory } from './navigation.js'

import machina from 'machina'

/**
 * Flytime acts as an abstract class and the creator of the concrete runtimes
 */
export default class Flytime {

  static get FsmPrototype() {
    return machina.Fsm.extend({
      initialize: () => {},
      namespace: 'flytime',
      initialState: 'uninitialized',
      states: {
        'uninitialized': {
          init: function () {
            this.transition('initializing')
          }
        },
        'initializing': {
          _onEnter: function () {

            // Read settings
            // Check if frontend is available
            // Make transition in a callback if everything is successful
            this.transition('ready-to-start')
          }
        },
        'initialization-failed': {

        },
        'ready-to-start': {
          start: function () {

            this.transition('starting')
          }
        },
        'starting': {
          _onEnter: function () {

            // Start up local server that hosts homescreen
            // Start up frontend
            // defer 'navigate-to-homescreen' comand until transition to processing state
            this.transition('processing')
          }
        },
        'processing': {
          navigate: function (url) {

            // Send 'transition' to 'url' command via Socket.IO
          },
          needToNavigate: function (url) {

          }
        },
        'stopping': {

        },
        'stopped': {

        }
      }
    })
  }

  _onStateReached(stateName, done) {
    var transitionSub = this.fsm.on('transition', (data) => {
      if (data.toState == stateName) {
        transitionSub.off()
        done()
      }
    })
  }

  init() {}
  start() {}

  static CreateMockFlytime() {
    return new MockFlytime()
  }

}

export class MockFlytime extends Flytime {
  get initTimeout() { return 1000 }

  constructor() {
    super()
    this.fsm = new Flytime.FsmPrototype()
  }

  _promiseAction(action, targetStateName) {
    return new Promise((resolve, reject) => {
      this._onStateReached(targetStateName, () => {
        resolve()
      })
      this.fsm.handle(action)

      setTimeout(() => {
        reject(new ButterflyTimeoutError(action, this.initTimeout))
      }, this.initTimeout)
    })
  }

  init() {
    return this._promiseAction('init', 'ready-to-start')
  }

  start() {
    return this._promiseAction('start', 'processing')
  }
}

export class DefaultFlytime extends Flytime {



  constructor() {
    super()
    this.fsm = new Flytime.FsmPrototype({
      states: {
        'uninitialized': {
          init: function () {
            this.transition('initializing')
          }
        },
        'initializing': {
          _onEnter: function () {
            // Read settings
            // Prepare other subsystems
            // Check if frontend is available
            // Make transition in a callback if everything is successful
            this.transition('ready-to-start')
          }
        },
        'initialization-failed': {

        },
        'ready-to-start': {
          start: function () {

            // Prepare to start up transition
            this.transition('starting')
          }
        },
        'starting': {
          _onEnter: function () {

            // Start up
            this.transition('processing')
          }
        },
        'processing': {

        },
        'stopping': {

        },
        'stopped': {

        }
      }
    })
  }

  init() {

  }

  start() {

  }
}


// class MockFlytime extends Flytime {

//   constructor() {
//     super()
//     this._expectedResult = new FailResult()
//   }

//   get expectedResult() {
//     return this._expectedResult
//   }

//   set expectedResult(result) {
//     return this._expectedResult = result
//   }

//   start(done: Function) {
//     if (this.expectedResult.constructor === SuccessResult) {
//       done(null, new SuccessResult())
//     } else if (this.expectedResult.constructor === FailResult) {
//       done(new FlytimeStartFailError(), null)
//     }
//   }

//   stop(done: Function) {
//     done(null, new FunctionResult())
//   }

// }

// class RemoveMeFlytime extends Flytime {

//   constructor(url) {
//     super()
//     this._navigator = NavigatorFactory.CreateRemoteWebNavigator()
//     this._url = url
//   }

//   start(done: Function) {
//     var electron = require('electron-prebuilt');
//     var childProcess = require('child_process');
//     var electrofly = childProcess.spawn(electron, ['/home/toxic/Projects/electrofly/app'], {
//       stdio: 'inherit'
//     });

//     electrofly.on('close', function () {
//       // Kill the host process when user closes the app
//       process.exit();
//     });

//     setTimeout(() => {
//       this._navigator.goTo(this._url, (err, result) => { })
//     }, 2000)

//     done(null, null)
//   }

//   stop(done: Function) {
//     done(null, new FunctionResult())
//   }

// }
