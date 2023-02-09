import {Request, Response, NextFunction} from "express";
import handleSession from "../verifysession.js";

export const verifyAdmin = (req: Request, res: Response, next: NextFunction) => {

    handleSession(req, res, "VERIFY", () => {
        try{
            const roles: Array<String> = res.locals?.authUser?.roles;
            if(res.locals?.authUser?.roles) {
                let isAdmin = false;
                for(let x in roles) {
                    if(roles[x] === process.env.ADMIN_ROLE) {
                        isAdmin = true;
                        break;
                    }
                }

                if(isAdmin) {
                    next();
                }
                else {
                    res.
                    status(403).
                    send("Forbidden Access. This endpoint is for admin only.");
                }
            }
            else {
                console.error("verifyadmin.ts: roles property in JWT payload doesn't exist!");
                res.sendStatus(500);
            }
        }
        catch(e) {
            console.error(e);
            if(!res.headersSent)
                res.sendStatus(500);
        }
    })
};