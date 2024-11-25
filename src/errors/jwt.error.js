export class TokenError extends Error {
    code = -20000;
    message;
    name;

    constructor (message) {
        super(message)

        this.message = message;
        this.name = this.constructor.name;
    }
}