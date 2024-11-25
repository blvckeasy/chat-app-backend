export class BaseError extends Error {
    code = -10000;
    message;
    name;

    constructor (message) {
        super(message)

        this.message = message;
        this.name = this.constructor.name;
    }
}