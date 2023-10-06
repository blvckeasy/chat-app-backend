import Fs from 'fs'
import Path from 'path'
import Url from 'url'

const homedir = Path.resolve()
const routeFiles = ["user", "user-status", "message"]

export default function (app) {
    return new Promise(async (resolve, reject) => {
        for await (let routeName of routeFiles) {
            const routeFile = Path.join(homedir, 'src', routeName, `${routeName}.routes.js`)
            const route = await import(Url.pathToFileURL(routeFile).href)
            if (route.default.path && route.default.router) {
                app.use('/api/v1' + route.default.path, route.default.router)
            }
        }
        resolve(200);
    })
}