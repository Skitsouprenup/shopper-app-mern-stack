import mongoose from "mongoose";
import { ProductInCartNoPriceInCents } from "./producttypes.js";
import { StripeLineItem } from "./stripetypes.js";

/*
  These types may have equivalent type in the server-side.
  Make sure types in the server-side and client side are
  always equal to avoid confusion.
*/

export interface CartProductPayloadType {
    productId: number,
    purchasedQuantity: number,
    color: string,
    size: string,
}

//If you add/remove/edit fields in the aggregation in
//computeCartProductsTotal method, the changes you made
//should reflect here.
export interface ComputedCartProducts {
    products: ProductInCart,
    total: mongoose.Types.Decimal128,
    totalInCents: mongoose.Types.Decimal128,
};

export type ProductInCart = [
    {
        _id: number,
        stripeProductId: string,
        title: string,
        imgPrimary: string,
        currency: [{
            type: string,
            symbol: string,
            price: mongoose.Types.Decimal128
        }],
        variations: Array<CartProductVariations | undefined>,
        priceInCents: mongoose.Types.Decimal128
    }
];

export interface CartProductVariations {
    quantifiedPrice: mongoose.Types.Decimal128,
    color: string,
    size: string,
    quantity: number,
}

export interface CartCheckoutType {
    lineItems: Array<StripeLineItem>,
    productsOrder: ProductInCartNoPriceInCents,
    total: string | undefined,
}