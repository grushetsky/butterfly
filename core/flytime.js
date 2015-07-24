import { ButterflyTimeoutError } from './common'
import Settings from './settings'
// import { FunctionResult, SuccessResult, FailResult, FlytimeStartFailError } from './results'
// import { NavigatorFactory } from './navigation.js'

import machina from 'machina'
import fs from 'fs'
import electron from 'electron-prebuilt'
import childProcess from 'child_process'

/**
 * Flytime acts as an abstract class and the creator of the concrete runtimes
 */
export default class Flytime {

  static get FsmPrototype() {
    return machina.Fsm.extend({
      initialize: () => {},
      namespace: 'flytime',
      initialState: 'uninitialized'
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

  _onError(errorCaught) {
    var errorSub = this.fsm.on('error', (error) => {
      errorSub.off()
      errorCaught(error)
    })
  }

  init() {}
  start() {}

  static CreateDefaultFlytime() {
    return new DefaultFlytime()
  }

}

export class DefaultFlytime extends Flytime {

  constructor() {
    super()
    var self = this
    this.fsm = new Flytime.FsmPrototype({
      states: {
        'uninitialized': {
          init: function () {
            this.transition('initializing')
          }
        },
        'initializing': {
          _onEnter: function () {

            // 1. Read settings
            // 2. Check if frontend is available
            // 3. Initialize messaging server
            // 4. Prepare other subsystems
            // 5. Transition to 'ready-to-start'

            Settings.LoadFromFile('./mock/test-real-settings.json').then((settings) => {
              self.settings = settings
              return Promise.resolve()
            }).then(() => {
              switch (self.settings.frontend.type) {
                case 'electrofly':
                case 'some-other-frontend':
                  if (fs.lstatSync(self.settings.frontend.path).isDirectory()) {
                    return Promise.resolve()
                  }
                  break
              }
              return Promise.reject(new UnknownFrontendError())
            }).then(() => {
              this.transition('ready-to-start')
            }).catch(error => {
              this.emit('error', error)
              this.transition('uninitialized')
            })
          }
        },
        'ready-to-start': {
          start: function () {
            this.transition('starting')
          }
        },
        'starting': {
          _onEnter: function () {

            new Promise((resolve, reject) => {

              // 1. Start process
              // 2. Wait for client connection to messaging server
              // 3. Navigate to home screen
              // 4. Transition to 'running'

              var electrofly = childProcess.spawn(electron, [self.settings.frontend.path], {
                stdio: 'inherit'
              })

            }).then(() => {
              this.transition('running')
            }).catch(error => {
              this.emit('error', error)
              this.transition('ready-to-start')
            })
          }
        },
        'running': {

        },
        'stopping': {

        },
        'stopped': {

        }
      }
    })
  }

  init(timeout: number = 2000) {
    return new Promise((resolve, reject) => {
      this.fsm.handle('init')
      this._onStateReached('ready-to-start', resolve)
      this._onError(reject)
      setTimeout(() => {
        reject(new ButterflyTimeoutError('init', timeout))
      }, timeout)
    })
  }

  start(timeout: number = 2000) {
    return new Promise((resolve, reject) => {
      this.fsm.handle('start')
      this._onStateReached('running', resolve)
      this._onError(reject)
      setTimeout(() => {
        reject(new ButterflyTimeoutError('start', timeout))
      }, timeout)
    })
  }
}
