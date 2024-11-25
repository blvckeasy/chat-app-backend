import messageRoute from "./message.route.js";
import userRoute from "./user.route.js";

async function setupRoutes (app) {
    app.use("/api/v1" + userRoute.path, userRoute.router);
    app.use("/api/v1" + messageRoute.path, messageRoute.router);
}


export default setupRoutes;