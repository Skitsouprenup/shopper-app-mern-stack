import mongoose from "mongoose";
import { ProductInCartNoPriceInCents } from "./producttypes.js";

export interface OrderModelType {
    _id: mongoose.Types.ObjectId,
    userId: string,
    products: ProductInCartNoPriceInCents,
    stripeSessionId: string,
    total: mongoose.Types.Decimal128,
    status: 'pending' | 'completed' | 'anomaly' | 'refunded',
    createdAt: NativeDate,
}