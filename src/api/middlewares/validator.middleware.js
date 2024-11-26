import { Utils } from "../../helpers/utils.js";


export async function validateObjectIdMiddleware(req, _, next) {
    try {
        const IDs = [
            ...Object.values(req.params),
            ...Object.values(req.query),
            ...Object.values(req.body)
        ]
    
        Utils.validateObjectIDs(IDs);        

        next();
    } catch (error) {
        next(error)
    }
}
