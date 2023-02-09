import {Request, Response} from "express";
import User from "../../models/UserModel.js";

export const getUserById = async (req: Request, res: Response) => {
    try{
        const user = await User.findById(req.params.id, ['username']);
        res.status(200).json(user);
    }
    catch(err) {
        console.error(err);
        res.sendStatus(500);
    }
};

export const getAllUsers = async (req: Request, res: Response) => {
    try{
        const newest = req.query.new;
        const count : unknown = req.query.count ? req.query.count : 5;
        const users = 
        newest ? 
        await User.
              find({},['username']).
              sort({ createdAt: -1}).
              limit(count as number) :
        await User.find({},['username']);
        
        res.status(200).json(users);
    }
    catch(err) {
        console.error(err);
        res.sendStatus(500);
    }
};