/// <reference path="../types/jwttypes.d.ts" />
import { NextFunction, Request, Response } from "express";
import UserModel from "../models/UserModel.js";
import jwt, { TokenPayload } from "jsonwebtoken";
import { verifyAccessToken } from "./verifyaccesstoken.js";

type TokenActionTypes = "VERIFY_LOGOUT" | "VERIFY";

const handleSession = 
    async (req: Request, 
           res : Response, 
           action : TokenActionTypes,
           next ?: NextFunction) => {

    try{
        const cookies = req?.cookies;

        //Verify Cookie
        if(!cookies?.jwt) {
            //console.error("Cookie for jwt doesn't exist!");
            res.status(400).end();
            return;
        }
        const refreshToken : string = JSON.parse(cookies.jwt).refreshtoken; 

        //username could be in the query(for GET method) or 
        //body(for POST method)
        const username: string = 
            req.query?.username ? req.query?.username :
            req.body?.username ? req.body?.username : '';

        //Verify User
        const user = await UserModel.findOne({
            username: username,
        });
        if(!user) {
            console.error("User doesn't Exist!");
            res.status(404).end();
            return;
        }
        else {
            res.locals.userId = user._id;
            res.locals.username = user.username;
            res.locals.firstname = user.firstname;
            res.locals.lastname = user.lastname;
            res.locals.middleInitial = user.middleInitial;
            res.locals.email = user.email;
            res.locals.userCreatedAt = new Date(user.createdAt).toLocaleDateString();
        }

        //Compare user refresh token to cookie refresh token
        if(user.activeRefreshToken !== refreshToken) {
            /*
                console.error(`User refresh token in db doesn't match
                        refresh token in cookie!`);
            */
            res.status(403).end();
            return;
        }

        //logout user
        const removeLoginStatus = async () => {

            user.activeRefreshToken = '';
            user.isNew = false;
            const updatedUser = await user.save();
            
            if(user === updatedUser){
                //Note: options in clearCookie(other than maxAge) must be equivalent
                //to the options in setCookie.
                res.clearCookie('jwt', {
                    httpOnly: true, 
                    sameSite: "lax",
                    secure: true,
                });
                if(process.env.NODE_ENV === 'production') {
                    res.set({'Access-Control-Allow-Origin' : process.env.FRONT_END_DOMAIN});
                }
                res.sendStatus(204);
            } 
            else res.sendStatus(500);
        };

        //verify cookie refresh token
        jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_TKN_SECRET as string, 
            (e, decoded) => {
                //invalid/expired refresh token
                if(e) {
                    //console.error(e);
                    removeLoginStatus();
                }
                //valid refresh token 
                else {
                    const tokenPayload : TokenPayload = decoded as TokenPayload;

                    //Verify if the user ID in refresh token is equal to
                    //the ID of requesting user. If not, the user is using a
                    //refresh token that is not designated to the sent username
                    if(tokenPayload?.id.toString() !== user?._id.toString()) {
                        removeLoginStatus();
                        return;
                    }

                    switch(action) {
                        case "VERIFY":
                            verifyAccessToken(user, req, res, next);
                            break;
    
                        case "VERIFY_LOGOUT":
                            removeLoginStatus();
                            break;
                    }
                }
            }
        );

    }
    catch(e) {
        console.error(e);
        if(!res.headersSent)
            res.sendStatus(500);
    }
};

export default handleSession;