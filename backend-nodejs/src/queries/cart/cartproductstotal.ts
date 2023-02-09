export const sumQuantifiedPrices = {
    $reduce: {
        input: {
            $map: {
                input: "$products",
                as: "product",
                in: {
                    $reduce: {
                        input: {
                            $getField: {
                                field: "variations",
                                input: "$$product"
                            }
                        },
                        initialValue: { $toDecimal: "0" },
                        in: {
                            $add: [
                                "$$value",
                                "$$this.quantifiedPrice"
                            ]
                        }
                    }
                }
            }
        },
        initialValue: { $toDecimal: "0" },
        in: {
            $add: [
                "$$value",
                "$$this"
            ]
        }
    }
};