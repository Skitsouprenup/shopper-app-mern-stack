import { CartProductVariations, Decimal128Type, ProductInCartNoPriceInCents } from "./producttypes";
import { StripeLineItem } from "./stripetypes";

export interface VariationCartProductType {
    productId: string, 
    variations: CartProductVariations | undefined
};

/*
  These types may have equivalent type in the server-side.
  Make sure types in the server-side and client side are
  always equal to avoid confusion.
*/
export interface CartCheckoutType {
    lineItems: Array<StripeLineItem>,
    productsOrder: ProductInCartNoPriceInCents,
    total: string | undefined,
}