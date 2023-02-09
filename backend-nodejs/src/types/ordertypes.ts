import mongoose from "mongoose";
import { ProductInCartNoPriceInCents } from "./producttypes.js";

export interface OrderModelType {
    _id: mongoose.Types.ObjectId,
    userId: string,
    products: Array<ProductInCartNoPriceInCents>,
    stripeSessionUrl: string,
    expiration: number,
    status: 'pending' | 'completed',
}