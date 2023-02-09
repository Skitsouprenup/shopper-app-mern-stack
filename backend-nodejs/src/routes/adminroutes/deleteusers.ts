import {Request, Response} from "express";
import User from "../../models/UserModel.js";

export const deleteUserById = async (req: Request, res: Response) => {
    try{
        await User.findByIdAndDelete(req.params.id);
        res.sendStatus(200);
    }
    catch(err) {
        console.error(err);
        res.sendStatus(500);
    }
};