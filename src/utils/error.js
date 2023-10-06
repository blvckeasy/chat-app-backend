export class UserNotFoundError extends Error {
    constructor (code, message) {
        super();
        this.code = code;
        this.errorName = this.constructor.name;
        this.message = message;
    }
}

export class UserAlreayExistsError extends Error {
    constructor (code, message) {
        super();
        this.code = code;
        this.errorName = this.constructor.name;
        this.message = message;
        this.message = message
    }
}

export class InvalidDataError extends Error {
    constructor (code, message, fieldName) {
        super();
        this.code = code
        this.errorName = this.constructor.name;
        this.message = message;
        this.fieldName = fieldName
    }
}

export class PaginationError extends Error {
    constructor (code, message, fieldName) {
        super();
        this.code = code
        this.errorName = this.constructor.name;
        this.message = message;
        this.fieldName = fieldName
    }
}

export class TokenIsInvalid extends Error {
    constructor (code, message) {
        super();
        this.code = code
        this.errorName = this.constructor.name;
        this.message = message;
    }
}

export class InternalServerError extends Error {
    constructor (code, message) {
        super();
        this.code = code
        this.errorName = this.constructor.name;
        this.message = message;
    }
}

export class Forbidden extends Error {
    constructor (code, message) {
        super();
        this.code = code
        this.errorName = this.constructor.name;
        this.message = message;
    }
}

export class MessageNotFoundError extends Error {
    constructor (code, message) {
        super();
        this.code = code;
        this.errorName = this.constructor.name;
        this.message = message;
    }
}