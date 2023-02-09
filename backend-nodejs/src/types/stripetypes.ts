export interface StripeLineItem {
    quantity: number,
    price_data: {
        currency: string,
        unit_amount_decimal: string,
        product_data: {
            name: string,
            description: string,
        },
    }
};