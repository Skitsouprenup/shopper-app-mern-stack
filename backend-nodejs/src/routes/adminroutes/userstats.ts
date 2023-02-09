import {Request, Response} from "express";
import User from "../../models/UserModel.js";

export const getUsersStats = async (req: Request, res: Response) => {
    try{
        const currentDate = new Date();
        const lastYearDate = new Date(currentDate);
        lastYearDate.setFullYear(currentDate.getFullYear() - 1);

        const data = await User.aggregate([
            { $match: { createdAt: { $gte: lastYearDate } } },
            { $project: { month: { $month: "$createdAt" } } },
            { $group: 
                { 
                    _id: "$month",
                    total: { $count: {} }
                } 
            }
        ]);
        res.status(200).json(data);
    }
    catch(err) {
        console.error(err);
        res.sendStatus(500);
    }
};