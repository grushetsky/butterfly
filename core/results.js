export class FunctionResult {

}

export class SuccessResult extends FunctionResult {

}

export class FailResult extends FunctionResult {

}

export class ButterflyError extends Error {

}

export class FlytimeStartFailError extends ButterflyError {

}

export class NavigationFailError extends ButterflyError {

}

export class MessengerCommandSendingError extends ButterflyError {

}