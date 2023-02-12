import handleSession from "../verifysession.js";
import { Request, Response } from 'express';
import OrderModel from "../../models/OrderModel.js";

export const getUserInfo = async (req: Request, res: Response) => {
    await handleSession(req, res, "VERIFY");
    
    if(res.locals?.accesstoken && res.locals?.userId) {

        const orders = 
        await OrderModel.find(
            { 
                userId: res.locals.userId as string, 
                status: 'completed' 
            }, 
            '_id status products total');

        res.status(200).json({
            accesstoken: res.locals.accesstoken,
            username: res.locals?.username,
            firstname: res.locals?.firstname,
            lastname: res.locals?.lastname,
            middleInitial: res.locals?.middleInitial,
            email: res.locals?.email,
            createdAt: res.locals?.userCreatedAt,
            orders,
        });
        return;
    }
    else {
        if(!res.headersSent)
            res.sendStatus(401);
    }
};