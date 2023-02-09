import {Request, Response} from "express";

import User from "../../models/UserModel.js";

export const updateUserById = async (req: Request, res: Response) => {

    try {
        if(req.body.password) {
            req.body.password = 
            CryptoJS.AES.encrypt(req.body.password, process.env.PASSPHRASE as string)
        }
        
        const updatedUser = await User.findByIdAndUpdate(req.params?.id, {
            $set: req.body
        },{new: true});

        res.status(200).json(updatedUser);
    }
    catch(err) {
        console.error(err);
        res.sendStatus(500);
    }
};