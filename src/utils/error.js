export class UserNotFoundError extends Error {
    constructor (code, message) {
        super(message);
        this.code = code;
        this.errorName = this.constructor.name;
    }
}

export class UserAlreayExistsError extends Error {
    constructor (code, message) {
        super(message);
        this.code = code;
        this.errorName = this.constructor.name;
    }
}