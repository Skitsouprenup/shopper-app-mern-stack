import { Decimal128Type, ProductInCartNoPriceInCents } from "./producttypes";

export interface ProductOrderType {
    productId: string,
    quantity: number | undefined,
    color: string | undefined,
    size: string | undefined,
    quantifiedPrice: Decimal128Type | undefined,
}

export interface OrderModel {
    _id: string,
    status: string,
    products: ProductInCartNoPriceInCents,
    total: Decimal128Type,
}