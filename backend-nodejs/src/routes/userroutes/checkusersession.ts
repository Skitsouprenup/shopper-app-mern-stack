import { Request, Response } from "express";
import handleSession from "../verifysession.js";

export const checkUserSession = async (req: Request, res: Response) => {

    await handleSession(req, res, "VERIFY");

    if(res.locals?.accesstoken && res.locals?.username) {
        res.set({
            'Content-Type':'application/json',
            'Cache':'no-store',
        });
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