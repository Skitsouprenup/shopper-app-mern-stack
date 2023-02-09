import {Request, Response} from "express";
import ProductModel from "../../models/ProductModel.js";

export const createProducts = async (req: Request, res: Response) => {
    try{
        const savedProduct = await new ProductModel(req.body).save();
        res.status(200).json(savedProduct);
    }
    catch(err) {
        res.status(500).send(err);
    }
};