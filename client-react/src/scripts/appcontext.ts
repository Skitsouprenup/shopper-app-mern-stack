import React, { createContext } from "react";

type productSizeContextType = {
    selectedSize?: string,
    setSelectedSize?: React.Dispatch<React.SetStateAction<string>>,
}
export const ProductSizeContext = createContext<productSizeContextType>({});