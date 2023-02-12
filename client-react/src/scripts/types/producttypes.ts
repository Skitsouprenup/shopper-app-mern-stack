export type Decimal128Type = { "$numberDecimal" : string };

/*
  These types may have equivalent type in the server-side.
  Make sure types in the server-side and client side are
  always equal to avoid confusion.
*/

export type sizeType = {
    _id: string,
    type: string,
    available: boolean,
    quantity: number,
  };
  
export type itemType = [{
    _id: string,
    color: string,
    size: sizeType[],
}];

export interface ProductType {
    _id: string,
    title: string,
    desc: string,
    image: Array<string>,
    imgPrimary: string,
    categories: Array<string>,
    item: itemType,
    currency: [
        {
            type: string,
            symbol: string,
            price: Decimal128Type,
        }
    ],
};

export interface CartProductInfo {
    productId: string | undefined,
    imgPrimary: string,
    title: string,
    price: string | undefined,
    priceAbbr: string,
}

export interface CartProductVariations {
    quantifiedPrice: Decimal128Type,
    color: string,
    size: string,
    quantity: number,
}

export type ProductInCart = Array<
    {
        _id: string,
        title: string,
        imgPrimary: string,
        currency: [{
            type: string,
            symbol: string,
            price: Decimal128Type,
        }],
        variations: Array<CartProductVariations | undefined>,
        priceInCents: Decimal128Type,
    }
>;

export type ProductInCartNoPriceInCents = Array<
    {
        _id: string,
        title: string,
        imgPrimary: string,
        currency: [{
            type: string,
            symbol: string,
            price: Decimal128Type,
        }],
        variations: Array<CartProductVariations | undefined>,
    }
>;

export interface ComputedCartProducts {
    products: ProductInCart,
    total: Decimal128Type,
    totalInCents: Decimal128Type,
}

export interface MinifiedProductProjection {
    _id: string,
    title: string,
    imgPrimary: string,
}

