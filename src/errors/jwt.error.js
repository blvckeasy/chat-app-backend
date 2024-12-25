import { BaseError } from "./base.error.js";

export class TokenError extends BaseError {
    code = -20000;
    message;
    name;

    constructor (message) {
        super(message)

        this.message = message;
        this.name = this.constructor.name;
    }
}