import {Request, Response} from "express";
import Order from "../../models/OrderModel.js";

export const getMonthlyIncome = async (req: Request, res: Response) => {
    try{
        let currentDate = new Date();
        const lastMonthDate = new Date(currentDate);
        lastMonthDate.setMonth(currentDate.getMonth() - 1);

        const previousFromLast = new Date(lastMonthDate);
        previousFromLast.setMonth(lastMonthDate.getMonth() - 1);

        const data = await Order.aggregate([
            { $match: { createdAt: { $gte: previousFromLast } } },
            { $project: 
                { 
                    month: { $month: "$createdAt" },
                    sales: "$amount",
                } 
            },
            { $group: 
                { 
                    _id: "$month",
                    total: { $count: "$sales" },
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