import {Request, Response} from "express";
import UserModel from "../../models/UserModel.js";
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";

export const userLogin = async (req: Request, res: Response) => {

    try {
        const user = await UserModel.findOne({
            username: req.body?.username
        }, 'password roles username');

        if(!user) {
            res.sendStatus(400);
            return;
        }
        if(req.body.password !== CryptoJS.AES.decrypt(user?.password as string, 
            process.env.PASSPHRASE as string).toString(CryptoJS.enc.Utf8)) {
            res.sendStatus(400);
            return;
        }

        if(user) {
            const accesstoken = jwt.sign({
                id: user?._id,
            },
            process.env.JWT_ACCESS_TKN_SECRET as string,
            { expiresIn: "30s" });

            const refreshtoken = jwt.sign({
                id: user?._id,
            },
            process.env.JWT_REFRESH_TKN_SECRET as string,
            { expiresIn: "1d" });

            user.activeRefreshToken = refreshtoken;
            user.isNew = false;
            await user.save();
            //cookie expiration should be equal to 
            //jwt expiration. Unit used in maxAge is milliseconds
            //Note: add 'secure' property in the cookie options and
            //set it to true if your domain has https protocol.
            //This ensures that your cookie is gonna be served to
            //only https domain. 
            res.status(200).
            cookie('jwt', 
                    JSON.stringify({refreshtoken}),
                    {
                        httpOnly: true, 
                        maxAge: 24*60*60*1000,
                        sameSite: "lax",
                        secure: true,
                    }).
            json({
                username: user?.username,
                accesstoken 
            });
        }
    }
    catch(e) {
        if(!res.headersSent)
            res.sendStatus(500);
    }
}