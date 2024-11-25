import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema({
    from_user_id: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
    },
    to_user_id: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
    },
    message: {
        type: Schema.Types.String,
        required: true,
    },
    sended_time: {
        type: Schema.Types.Date,
        default: new Date()
    },
    is_readable: {
        type: Schema.Types.Boolean,
        default: false,
    }
})

const MessageModel = mongoose.model("Messages", messageSchema)

export default MessageModel;