import { Request, Response } from "express";
import handleSession from "../verifysession.js";

export const checkUserSession = async (req: Request, res: Response) => {

    await handleSession(req, res, "VERIFY");

    //Something wrong with user verification process.
    //Return immediately.
    if(res.statusCode !== 200) return;

    if(res.locals?.accesstoken && res.locals?.username) {
        if(process.env.NODE_ENV === 'production') {
            res.set({
                'Content-Type':'application/json',
                'Cache':'no-store',
                'Access-Control-Allow-Origin' : process.env.FRONT_END_DOMAIN
            });
        }
        else {
            res.set({
                'Content-Type':'application/json',
                'Cache':'no-store',
            });
        }
        res.status(200).json({
            accesstoken: res.locals.accesstoken,
            username: res.locals.username
        });
        return;
    }
    else {
        if(!res.headersSent)
            res.sendStatus(401);
    }
    
};