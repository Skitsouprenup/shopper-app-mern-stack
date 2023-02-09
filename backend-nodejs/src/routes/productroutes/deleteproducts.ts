import {Request, Response} from "express";

import ProductModel from "../../models/ProductModel.js";

export const deleteProductById = async (req: Request, res: Response) => {
    try{
        await ProductModel.findByIdAndDelete(req.params.id);
        res.sendStatus(200);
    }
    catch(err) {
        console.error(err);
        res.sendStatus(500);
    }
};