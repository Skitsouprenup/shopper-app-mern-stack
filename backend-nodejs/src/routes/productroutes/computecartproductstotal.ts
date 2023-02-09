import {Request, Response} from "express";
import mongoose from "mongoose";

import ProductModel from "../../models/ProductModel.js";
import { mapCartProducts } from "../../queries/cart/cartproductsquantified.js";
import { sumQuantifiedPrices } from "../../queries/cart/cartproductstotal.js";
import { CartProductPayloadType, ComputedCartProducts } from "../../types/carttypes.js";

export const computeCartProductsTotal = async (req: Request, res: Response) => {

    try{
        const ids : Array<mongoose.Types.ObjectId> = [];
        const cartProducts: Array<CartProductPayloadType | undefined> = req.body;

        for(let x of cartProducts) {
            ids.push(new mongoose.Types.ObjectId(x?.productId));
        }

        const products : ComputedCartProducts[] = 
            await ProductModel.aggregate([
                { 
                    $match: { 
                        _id: { $in: ids },
                    },
                },

                {
                    $addFields: {
                        receivedProducts: cartProducts,
                    }
                },

                {
                    $group: {
                        _id: "null",
                        products: 
                        {
                            $push: {
                                _id: "$_id",
                                title: "$title",
                                imgPrimary: "$imgPrimary",
                                currency: "$currency",
                                variations: {
                                    $first: mapCartProducts
                                },
                                priceInCents: {
                                    $multiply: [
                                        {
                                            $getField: {
                                                field: "price",
                                                input: {
                                                    $first: "$currency"
                                                }
                                            }
                                        },
                                        { $toDecimal: "100" }
                                    ]
                                }
                            }
                        },
                    }
                },

                {
                    $project: {
                        _id: 0,
                        products: 1,
                        total: sumQuantifiedPrices,
                        totalInCents: {
                            $multiply: [
                                sumQuantifiedPrices,
                                {
                                    $toDecimal: "100"
                                }
                            ]
                        }
                    }
                }
                
            ]) as ComputedCartProducts[];
        //console.log(util.inspect(products, false, null, true));
        res.set({'Content-Type': 'application/json'}).
        status(200).json(products);
    }
    catch(err) {
        console.error(err);
        res.sendStatus(500);
    }
};