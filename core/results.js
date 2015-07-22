import { ButterflyError } from './common'

export class FunctionResult {

}

export class SuccessResult extends FunctionResult {

}

export class FailResult extends FunctionResult {

}

export class FlytimeStartFailError extends ButterflyError {

}

export class NavigationFailError extends ButterflyError {

}

export class MessengerCommandSendingError extends ButterflyError {

}
