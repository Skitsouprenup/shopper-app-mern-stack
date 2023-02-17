const computePriceQuantified = {
    $multiply: [
        {
            $toDecimal : {
                $toString: {
                    $getField: {
                        field: "price",
                        input: {
                            $arrayElemAt: ["$currency",0]
                        }
                    }
                }
            }
        },
        {
            $toDecimal: {
                $toString: "$$productVariations.purchasedQuantity"
            }
        },
    ],
};

export const mapCartProducts = {
    $map: {
        input: {
            $filter: {
                input: "$receivedProducts",
                as: "product",
                cond: {
                    $eq: [
                            {
                                $toString: {
                                    $getField: {
                                        field: "productId",
                                        input: "$$product",
                                    }
                                }
                            }, 
                            {
                                $toString: "$_id"
                            },
                    ]
                }
            }
        },
        as: "product",
        in: {
            $map: {
                input: "$$product.variations",
                as: "productVariations",
                in: {
                    quantifiedPrice: computePriceQuantified,
                    color: "$$productVariations.color",
                    size: "$$productVariations.size",
                    quantity: "$$productVariations.purchasedQuantity"
                }
            }
        }
    }
};