import ButterflyObject from './common'
import { FunctionResult, SuccessResult, FailResult, FlytimeStartFailError } from './results'
import { NavigatorFactory } from './navigation.js'

export default class Flytime {

  start(done: Function) {}

  stop(done: Function) {}

  static CreateMockFlytime() {
    return new MockFlytime()
  }

  static CreateYandexFlytime() {
    return new RemoveMeFlytime('http://yandex.ru')
  }

}

class RemoveMeFlytime extends Flytime {

  constructor(url) {
    super()
    this._navigator = NavigatorFactory.CreateRemoteWebNavigator()
    this._url = url
  }

  start(done: Function) {
    var electron = require('electron-prebuilt');
    var childProcess = require('child_process');
    var electrofly = childProcess.spawn(electron, ['/path/to/electrofly/app/folder'], {
      stdio: 'inherit'
    });

    electrofly.on('close', function () {
      // Kill the host process when user closes the app
      process.exit();
    });

    setTimeout(() => {
      this._navigator.goTo(this._url, (err, result) => { })
    }, 2000)

    done(null, null)
  }

  stop(done: Function) {
    done(null, new FunctionResult())
  }

}


class MockFlytime extends Flytime {

  constructor() {
    super()
    this._expectedResult = new FailResult()
  }

  get expectedResult() {
    return this._expectedResult
  }

  set expectedResult(result) {
    return this._expectedResult = result
  }

  start(done: Function) {
    if (this.expectedResult.constructor === SuccessResult) {
      done(null, new SuccessResult())
    } else if (this.expectedResult.constructor === FailResult) {
      done(new FlytimeStartFailError(), null)
    }
  }

  stop(done: Function) {
    done(null, new FunctionResult())
  }

}