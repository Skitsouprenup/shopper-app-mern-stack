import mongoose  from "mongoose";
import { ProductModelType } from "../types/producttypes.js";

export const ProductSchema = new mongoose.Schema<ProductModelType>(
    {
        title: {type: String, required: true, unique: true, index: true},
        desc: {type: String, required: true},
        img: {type: Array, required: true},
        imgPrimary: {type: String, required: true},
        categories: {type: Array, required: true, index: true},
        item : [
            {
                color: {type: String, default: 'default'},
                size: [
                    {
                        type: { type: String, default: 'default' },
                        available: { type: Boolean, default: true },
                        quantity: { type: Number, default: 0 },
                    }
                ],
            }
        ],
        currency: [
            {  
                type : {type: String, required: true},
                symbol : {type: String},
                price : {type: mongoose.Types.Decimal128, required: true}
            },
        ],
    },
    { timestamps: true }
);

export default mongoose.model("Products", ProductSchema);