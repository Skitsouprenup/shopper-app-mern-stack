import {Request, Response} from "express";
import Order from "../../models/OrderModel.js";

export const deleteOrderById = async (req: Request, res: Response) => {
    try{
        await Order.findByIdAndDelete(req.params.id);
        res.sendStatus(200);
    }
    catch(err) {
        console.error(err);
        res.sendStatus(500);
    }
};