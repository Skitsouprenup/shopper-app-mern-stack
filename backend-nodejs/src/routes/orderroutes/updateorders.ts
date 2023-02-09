import {Request, Response} from "express";
import Order from "../../models/OrderModel.js";

export const updateOrderById = async (req: Request, res: Response) => {

    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params?.id, {
            $set: req.body
        },{new: true});

        res.status(200).json(updatedOrder);
    }
    catch(err) {
        console.error(err);
        res.sendStatus(500);
    }
};