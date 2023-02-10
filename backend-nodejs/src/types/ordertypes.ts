import mongoose from "mongoose";
import { ProductInCartNoPriceInCents } from "./producttypes.js";

export interface OrderModelType {
    _id: mongoose.Types.ObjectId,
    userId: string,
    products: Array<ProductInCartNoPriceInCents>,
    stripeSessionId: string,
    status: 'pending' | 'completed' | 'anomaly' | 'refunded',
}