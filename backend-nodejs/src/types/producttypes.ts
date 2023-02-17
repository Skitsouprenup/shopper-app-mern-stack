import mongoose from "mongoose";
import { CartProductVariations } from "./carttypes.js";

export interface MinifiedProduct {
    _id: string,
    title: string,
    imgPrimary: string,
    isLiked: boolean,
};

export interface MinifiedProductsPayload {
    products: Array<MinifiedProduct>,
    username ?: string,
    accesstoken ?: string,
}

export interface ProductModelType {
    _id: mongoose.Types.ObjectId,
    title: string,
    desc: string,
    img: ArrayConstructor,
    imgPrimary: string,
    categories: ArrayConstructor,
    item: [
        {
            color: string,
            size: [
                {
                    type: string,
                    available: boolean,
                    quantity: number,
                }
            ],
        }
    ],
    currency: [
        {  
            type : string,
            symbol : string,
            price : mongoose.Types.Decimal128,
        },
    ],
    createdAt: NativeDate,
    updatedAt: NativeDate,
};

export type ProductInCartNoPriceInCents = Array<
    {
        _id: string,
        title: string,
        imgPrimary: string,
        currency: [{
            type: string,
            symbol: string,
            price: mongoose.Types.Decimal128,
        }],
        variations: Array<CartProductVariations | undefined>,
    }
>;