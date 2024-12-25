import MessageModel from "../database/models/message.model.js"

class MessageService {
    constructor () {}

    async get(filter) {
        const foundedMessages = await MessageModel
        .find(filter)
        .sort({ sended_time: 1 });
        
        return foundedMessages;
    }

    async create (params) {
        const newMessage = (await MessageModel.create(params))?.toObject();
        return newMessage;
    }

    async update(filter, params) {
        const updatedMessage = (await MessageModel.findOneAndUpdate(filter, params))?.toObject();
        return updatedMessage;
    }

    async delete (filter) {
        const deletedMesage = (await MessageModel.findOneAndDelete(filter))?.toObject()
        return deletedMesage;
    }
}


export { MessageService };