import mongoose from "mongoose";
import { UserModelType } from "../types/usertypes.js";

const UserSchema = new mongoose.Schema<UserModelType>(
    {
        _id: mongoose.Types.ObjectId,
        activeRefreshToken: { type: String, default: '', unique: true },
        username: { type: String, required: true, unique: true },
        firstname: { type: String, required: true },
        middleInitial: { type: String },
        lastname: { type: String, required: true},
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        roles: Array,
    },
    { timestamps: true }
);

const UserModel = mongoose.model('Users', UserSchema);
export default UserModel;