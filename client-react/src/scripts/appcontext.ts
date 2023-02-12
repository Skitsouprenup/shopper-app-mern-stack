import React, { createContext } from "react";

type productSizeContextType = {
    selectedSize?: string,
    setSelectedSize?: React.Dispatch<React.SetStateAction<string>>,
}
type SearchItemContextType = {
    searchItem: string
}

export const ProductSizeContext = createContext<productSizeContextType>({});
export const SearchItemContext = 
    createContext<SearchItemContextType | undefined>(undefined);