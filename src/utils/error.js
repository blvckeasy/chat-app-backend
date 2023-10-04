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
        this.message = message
    }
}

export class InvalidDataError extends Error {
    constructor (code, message, fieldName) {
        super(message);
        this.code = code
        this.errorName = this.constructor.name;
        this.fieldName = fieldName
    }
}

export class PaginationError extends Error {
    constructor (code, message, fieldName) {
        super(message);
        this.code = code
        this.errorName = this.constructor.name;
        this.fieldName = fieldName
    }
}

export class TokenIsInvalid extends Error {
    constructor (code, message) {
        super(message);
        this.code = code
        this.errorName = this.constructor.name;
    }
}

export class InternalServerError extends Error {
    constructor (code, message) {
        super(message);
        this.code = code
        this.errorName = this.constructor.name;
    }
}

export class Forbidden extends Error {
    constructor (code, message) {
        super(message);
        this.code = code
        this.errorName = this.constructor.name;
    }
}

export class MessageNotFoundError extends Error {
    constructor (code, message) {
        super(message);
        this.code = code;
        this.errorName = this.constructor.name;
    }
}