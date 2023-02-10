//import util from 'util';
import { Response } from 'express';
import mongoose from 'mongoose';
import { ProductInCartNoPriceInCents, ProductModelType } from '../../types/producttypes.js';

export const updateStocks = 
    (
     res: Response, 
     productIds: Array<mongoose.Types.ObjectId>,
     queriedProducts: Array<ProductModelType>,
     productsOrder: ProductInCartNoPriceInCents,
     opType: 'increase' | 'decrease',
    ) => {
    //Reduce product stock
    const updateProducts = [];
    for(let x = 0; x < productIds.length; x++) {
        if(queriedProducts[x]._id.toString() === productsOrder[x]._id) {
            for(let y of queriedProducts[x].item) {
                for(let z of productsOrder[x].variations) {
                    if(y.color === z?.color) {
                        for(let a of y.size) {
                            const quantity = 
                                opType === 'decrease' ?
                                a.quantity - z.quantity :
                                a.quantity + z.quantity;

                            if(quantity >= 0) {
                                const modifiedSize = a;
                                modifiedSize.quantity = quantity;

                                updateProducts.push({
                                    updateOne: {
                                        filter: {
                                            _id: new mongoose.Types.ObjectId(queriedProducts[x]._id),
                                        },
                                        update: {
                                            $set: {
                                                item: y
                                            }
                                        },
                                    }
                                });
                            }
                            else {
                                //Bad Request #3
                                /*
                                    console.error(`${queriedProducts[x].title}
                                    stock calculation is invalid!`);
                                */
                                if(!res.headersSent){
                                    const msg = queriedProducts[x].title +
                                    ' current stock is insufficient.'
                                    res.statusMessage = msg
                                    res.sendStatus(400);
                                }
                                return [];
                            }
                        }
                    }
                }
            }
        }
    }
    //console.log(util.inspect(updateProducts,false,null,true));
    return updateProducts;
}