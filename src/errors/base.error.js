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

export class InternalServerError extends Error {
    code = 400;
    message;
    name;

    constructor () {
        const message = "Server bilan bog'liq muammo bo'ldi";
        super(message)

        this.message = message;
        this.name = this.constructor.name;
    }
}