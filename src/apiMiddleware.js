import Path from 'path';
import Cors from 'cors';
import Express from 'express';
import Fs from 'fs';
import * as AllErrors from './utils/error.js'

export function apiMiddlewares (app) {
    return new Promise((resolve, reject) => {
        app.use(Cors("*"))
        app.use(Express.static(Path.join(process.cwd(), "uploads")))
        app.use(Express.json())

        resolve(200);
    })  
}

export function ErrorHandlerMiddleware (err, req, res, next) {
    if (Object.keys(AllErrors).includes(err.errorName)) {
      return res.send({
        ok: false,
        error: err,
      })
    }
    console.log(err);
    const writer = Fs.createWriteStream(Path.join(process.cwd(), "logs", "errors.log"), {
      flags: 'a'
    })
    writer.write(`
ERROR ---------------------------------------- ${new Date()}
    path: ${req.route.path}
    method: ${req.method}
    headers: ${JSON.stringify(req.headers)}
    body: ${JSON.stringify(req.body)}
    params: ${JSON.stringify(req.params)}
    query: ${JSON.stringify(req.query)}
    IP: ${req.socket.remoteAddress}
    error: ${JSON.stringify(err)}
`)

    return res.send({
      ok: false,
      error: {
        code: 500,
        errorName: "InternalServerError",
        message: "Internal Server Error"
      }
    })
}