import {Request, Response} from "express";

import ProductModel from "../../models/ProductModel.js";

export const updateProductById = async (req: Request, res: Response) => {

    try {
        const updatedProduct = await ProductModel.findByIdAndUpdate(req.params?.id, {
            $set: req.body
        },{new: true});

        res.status(200).json(updatedProduct);
    }
    catch(err) {
        console.error(err);
        res.sendStatus(500);
    }
};