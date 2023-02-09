import {Request, Response} from "express";
import Order from "../../models/OrderModel.js";

export const createOrders = async (req: Request, res: Response) => {
    try{
        const savedOrder = await new Order(req.body).save();
        res.status(200).json(savedOrder);
    }
    catch(err) {
        res.status(500).send(err);
    }
};