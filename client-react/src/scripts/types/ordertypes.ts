import { Decimal128Type } from "./producttypes";

export interface ProductOrderType {
    productId: string,
    quantity: number | undefined,
    color: string | undefined,
    size: string | undefined,
    quantifiedPrice: Decimal128Type | undefined
    ,
} 