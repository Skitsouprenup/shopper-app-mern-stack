import mongoose from "mongoose";
import ProductModel from "../../models/ProductModel.js";
import { Response } from 'express';
import OrderModel from "../../models/OrderModel.js";
import Stripe from "stripe";
import { updateStocks } from "./updateStocks.js";

/*
    Invoke this function if customer checkout failed or expired.
*/
export const releaseOnHoldStocks = 
async(
        res: Response,
        filterId: string,
        stripe: Stripe | undefined,
     ) => {

    //Note: These array must have equal length
    const productIds = [];
    const productsOrder = [];
    let queriedProducts = [];

    const order = 
        await OrderModel.findOne(
            { 
                userId: filterId, 
                status: 'pending' 
            }, 
            'stripeSessionId products');

    if(order) {
        for(let x of order?.products) {
            productIds.push(new mongoose.Types.ObjectId(x._id));
            productsOrder.push(x);
        }

        queriedProducts = 
        await ProductModel.find({
            _id: { 
                $in: productIds
            }
        },'item');

        if(productIds.length && productsOrder.length &&
           queriedProducts.length) {
            const updateProducts = 
                updateStocks(res, productIds, queriedProducts, productsOrder, 'increase');
            if(updateProducts.length) {
                await ProductModel.collection.bulkWrite(updateProducts);
                await stripe?.checkout.sessions.expire(order?.stripeSessionId);
                await order.remove();
            } else return null;
        } else return null;
    }
};