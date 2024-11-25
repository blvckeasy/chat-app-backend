import UserModel from "../database/models/user.model.js"

class UserService {
    constructor () {}

    async get(filter) {
        const { page = 1, limit = 10, ...rest } = filter;
        const skip = (page - 1) * limit;

        const foundedUsers = await UserModel.find(rest)
            .skip(skip)
            .limit(limit)
            .select('-password')
            
        return foundedUsers;
        }

    async getOne(filter) {
        const foundedUser = (await UserModel.findOne(filter))?.toObject();
        delete foundedUser?.password;
        return foundedUser;
    }

    async create (params) {
        const newUser = (await UserModel.create(params))?.toObject();
        delete newUser?.password;
        return newUser;
    }

    async update(filter, params) {
        const updatedUser = (await UserModel.findOneAndUpdate(filter, params))?.toObject();
        return updatedUser;
    }

    async delete (filter) {
        const deletedUser = (await UserModel.findOneAndDelete(filter))?.toObject()
        return deletedUser;
    }
}


export { UserService };