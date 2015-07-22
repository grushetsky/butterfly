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
