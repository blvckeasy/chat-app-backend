import Path from 'path';
import Cors from 'cors';
import Express from 'express';

export default function (app) {
    return new Promise((resolve, reject) => {
        app.use(Cors("*"))
        app.use(Express.static(Path.join(process.cwd(), "uploads")))
        app.use(Express.json())

        resolve(200);
    })  
}