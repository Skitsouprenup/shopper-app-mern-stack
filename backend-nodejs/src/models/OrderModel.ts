import mongoose  from "mongoose";
import { OrderModelType } from "../types/ordertypes.js";

//Purchased Products Record
const OrderSchema = new mongoose.Schema<OrderModelType>(
    {
        _id: mongoose.Types.ObjectId,
        userId: { type: String, required: true, index: true },
        products: Array,
        stripeSessionUrl: { type: String },
        expiration: { type: Number },
        status: { type: String, default: 'pending', index: true },
    },
    { timestamps: true }
);

export default mongoose.model("Orders", OrderSchema);