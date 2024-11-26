import mongoose from "mongoose";
import { BaseError } from "../errors/base.error.js";


class Utils {
    static async generateUUID () {
        return v4();
    }

    static isValidObjectId (id) {
        return mongoose.Types.ObjectId.isValid(id)
    }

    /**
     * 
     * @param {array} IDs;
     */
    static validateObjectIDs(IDs) {
        for (const id of IDs) {
            if (!this.isValidObjectId(id)) {
                throw new BaseError("_id noto'g'ri yuborildi!");
            }
        }    
    }
    
}

export { Utils };