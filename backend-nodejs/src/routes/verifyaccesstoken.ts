/// <reference path="../types/jwttypes.d.ts" />
import { Request, Response, NextFunction } from "express";
import jwt, { TokenPayload } from "jsonwebtoken";
import { UserModelType } from "../types/usertypes.js";

export const verifyAccessToken = 
    async (
           user: UserModelType,
           req: Request, 
           res: Response, 
           next?: NextFunction) => {

    //header property names in Request.Headers
    //are in lowercase 
    const authHeader = req.headers['authorization'];
    const accessToken = authHeader ? authHeader.split(" ")[1] : '';
    if(authHeader) {
        //verify access token
        jwt.verify(
            accessToken, 
            process.env.JWT_ACCESS_TKN_SECRET as string, 
            (err, decoded) => {
                const tokenPayload : TokenPayload = decoded as TokenPayload;
                if(err) {
                    //Create new access token if expired
                    if(err.name === "TokenExpiredError") {
                        const newAccessToken = jwt.sign({
                            id: user?._id,
                        },
                        process.env.JWT_ACCESS_TKN_SECRET as string,
                        { expiresIn: 
                            process.env.JWT_ACCESS_TKN_EXPIRE as string });

                        res.locals.accesstoken = newAccessToken;
                        if(next) next();
                    }
                    //invalid access token
                    else {
                        console.error(err.name);
                        res.status(403).end();
                    }
                }
                //resend old access token
                else {
                    if(tokenPayload?.id.toString() === 
                       user?._id.toString()) {
                        res.locals.accesstoken = accessToken;
                        if(next) next();
                    } else {
                        console.error(`ID in access token doesn't match ID in database!`);
                        res.sendStatus(403);
                    }
                }
            }
        );
    }else {
        console.error("Header not found");
        res.sendStatus(401);
    }
};