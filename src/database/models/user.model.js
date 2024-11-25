import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    profile_img_path: {
        type: Schema.Types.String,
    },
    username: {
        type: Schema.Types.String,
        required: true,
        unique: true
    },
    fullname: {
        type: Schema.Types.String,
        required: true,
    },
    password: {
        type: Schema.Types.String,
        require: true,
    },
    socket_id: {
        type: Schema.Types.String,
    }
})

const UserModel = mongoose.model("Users", userSchema)

export default UserModel;