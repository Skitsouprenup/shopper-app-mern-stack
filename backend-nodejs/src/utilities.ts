import { ProductSchema } from "./models/ProductModel.js";

export const productSortOptions = (sort: string | undefined) => {
    let option = {};

    if(sort) {
        switch(sort.toLowerCase()) {
            case 'newest':
                ProductSchema.index({createdAt: -1});
                option = { createdAt: -1 };
                break;

            case 'oldest':
                ProductSchema.index({createdAt: 1});
                option = { createdAt: 1 };
                break;

            case 'lowest price':
                ProductSchema.index({'currency.price': 1});
                option = { 'currency.price' : 1 };
                break;

            case 'highest price':
                ProductSchema.index({'currency.price': -1});
                option = { 'currency.price' : -1 };
                break;
        }
    }

    return option;
};