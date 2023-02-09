export interface CartProductType {
    productId: string,
    variations: Array<{
        purchasedQuantity: number,
        color: string,
        size: string,
    }>,
}

export type CartProductVariationProps = {
    purchasedQuantity: number,
    color: string,
    size: string,
};