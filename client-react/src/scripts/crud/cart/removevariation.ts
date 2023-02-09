import { AppDispatch } from "../../redux/reduxstore";
import { setCount, setTotalQuantity } from "../../redux/slices/cartslice";
import { CartProductType } from "../../types/cartslicetypes";
import { VariationCartProductType } from "../../types/carttypes";
import { getLocalStorCart } from "./localstorageop/getlocalstorcart";
import { setLocalStorageCart } from "./localstorageop/setlocalstorcart";

export const removeCartProductVariation = 
    (
        cartDispatch: AppDispatch,
        variationDelete: VariationCartProductType | undefined,
        setVariationDelete: React.Dispatch<
            React.SetStateAction<VariationCartProductType | undefined>>,
        isLoggedIn: boolean
    ) => {

    if(variationDelete) {
        let parsedProducts: Array<CartProductType> = getLocalStorCart(isLoggedIn);

        let totalQuantity = 0;
        for(let x of parsedProducts) {
            if(x.productId === variationDelete.productId) {
                let newVariations : typeof x.variations = [];

                for(let xVar of x.variations) {
                    if(xVar.color !== variationDelete.variations?.color ||
                       xVar.size !== variationDelete.variations?.size) {
                        newVariations.push(xVar);
                    }
                }
                if(newVariations.length) {
                    x.variations = [...newVariations];
                }
                //if the last variation is removed, remove the product
                else {
                    totalQuantity -= 1;
                    parsedProducts = parsedProducts.
                        filter((item) => item.productId !== variationDelete.productId);
                    break;
                }
            }
            totalQuantity += x.variations.length;
        }

        if(setLocalStorageCart(isLoggedIn, parsedProducts)) {
            setVariationDelete(undefined);
            cartDispatch(setTotalQuantity(totalQuantity));
            cartDispatch(setCount(parsedProducts.length));
        }
    }
};