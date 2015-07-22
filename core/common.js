export class ButterflyObject extends Object {}

export class ButterflyError extends Error {
  constructor(message) {
    super()
    this.constructor.prototype.__proto__ = Error.prototype
    Error.captureStackTrace(this, this.constructor)
    this.name = this.constructor.name
    this.message = message
  }
}

export class ButterflyTimeoutError extends ButterflyError {
  constructor(event, timeout) {
    super(`'${event}' operation exceeded ${timeout}ms!`)
  }
}

export class TestCaseUnexpectedResultError extends ButterflyError {
  constructor(message) {
    super(message)
  }
}

// Taken from here: http://www.html5rocks.com/en/tutorials/es6/promises
export function spawn(generatorFunc) {
  function continuer(verb, arg) {
    var result;
    try {
      result = generator[verb](arg);
    } catch (err) {
      return Promise.reject(err);
    }
    if (result.done) {
      return result.value;
    } else {
      return Promise.resolve(result.value).then(onFulfilled, onRejected);
    }
  }
  var generator = generatorFunc();
  var onFulfilled = continuer.bind(continuer, "next");
  var onRejected = continuer.bind(continuer, "throw");
  return onFulfilled();
}
