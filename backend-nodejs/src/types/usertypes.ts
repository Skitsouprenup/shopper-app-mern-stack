import mongoose from "mongoose";

export interface UserModelType {
    _id: mongoose.Types.ObjectId,
    activeRefreshToken: string,
    username: string,
    firstname: string,
    middleInitial: string,
    lastname: string,
    email: string,
    password: string,
    roles: Array<string>,
}