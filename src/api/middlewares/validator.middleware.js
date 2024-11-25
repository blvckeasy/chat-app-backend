import { validateObjectIds } from "../../helpers/validate.js";


export async function validateObjectIdMiddleware(req, _, next) {
    try {
        const IDs = [
            ...Object.values(req.params),
            ...Object.values(req.query),
            ...Object.values(req.body)
        ]
    
        await validateObjectIds(IDs);        

        next();
    } catch (error) {
        next(error)
    }
}
