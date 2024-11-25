import { BaseError } from "../../errors/base.error.js"

export async function errorHandlerMiddleware (error, req, res, next) {
    if (error instanceof BaseError) {
        return res.send({
            ok: false,
            message: error.message,
            code: error.code,
            name: error.constructor.name
        })
    }

    console.log(error);
    return res.send({
        ok: false,
        message: "Voy nimadur xato bo'ldi.",
        code: 505,
        name: "Interval Server Error"
    })
}