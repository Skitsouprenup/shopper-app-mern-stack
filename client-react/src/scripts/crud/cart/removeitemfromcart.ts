import React from "react";
import { AppDispatch } from "../../redux/reduxstore";
import { setCount, setTotalQuantity } from "../../redux/slices/cartslice";
import { CartProductType } from "../../types/cartslicetypes";
import { getLocalStorCart } from "./localstorageop/getlocalstorcart";
import { setLocalStorageCart } from "./localstorageop/setlocalstorcart";


export const removeItemFromCart = 
    (productDelete: string,
     cartDispatch: AppDispatch,
     setProductDelete: React.Dispatch<React.SetStateAction<string>>,
     isLoggedIn: boolean) => {

    if(productDelete) {
        const parsedProducts: Array<CartProductType> = getLocalStorCart(isLoggedIn);
        const retainedProducts: Array<CartProductType> = [];

        let variationCount = 0;

        for(let x of parsedProducts) {
            variationCount += x.variations.length;

            if(!(x.productId === productDelete)) 
                    retainedProducts.push(x);
        }
        
        if(retainedProducts) {
            if(setLocalStorageCart(isLoggedIn, retainedProducts)) {
                cartDispatch(setCount(retainedProducts.length));
                cartDispatch(setTotalQuantity(variationCount));
                setProductDelete('');
            }
        }
    }
}