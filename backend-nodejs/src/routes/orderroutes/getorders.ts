import {Request, Response} from "express";
import Order from "../../models/OrderModel.js";

export const getOrderById = async (req: Request, res: Response) => {
    try{
        const order = await Order.findOne({userId: req.params.userId});
        res.status(200).json(order);
    }
    catch(err) {
        console.error(err);
        res.sendStatus(500);
    }
};

export const getAllOrders = async (req: Request, res: Response) => {
    try{
        const orders = await Order.find();
        res.status(200).json(orders);
    }
    catch(err) {
        console.error(err);
        res.sendStatus(500);
    }
};