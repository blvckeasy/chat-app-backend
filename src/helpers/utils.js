import mongoose from "mongoose";


class Utils {
    static async generateUUID () {
        return v4();
    }

    static isValidObjectId (id) {
        return mongoose.Types.ObjectId.isValid(id)
    }
}

export { Utils };