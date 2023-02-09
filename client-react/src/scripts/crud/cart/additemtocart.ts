import { AppDispatch } from "../../redux/reduxstore";
import { incrementCount, setTotalQuantity } from "../../redux/slices/cartslice";
import { CartProductType, CartProductVariationProps } from "../../types/cartslicetypes";
import { getLocalStorCart } from "./localstorageop/getlocalstorcart";
import { setLocalStorageCart } from "./localstorageop/setlocalstorcart";

export const addItemToCart = (
    product: CartProductType, 
    cartDispatch: AppDispatch,
    isLoggedIn: boolean) => {

    const parsedProducts : Array<CartProductType> = getLocalStorCart(isLoggedIn);
    if(parsedProducts) {
        let asVariation = false;
        let asProductItem = false;
        let quantityCount = 0;
        let productVariations : Array<CartProductVariationProps> = [];

        for(let x of parsedProducts) {
            //If the prouct that's gonna be added to cart
            //has equivalent productId in the cart. Then,
            //the product is already exising in the cart.
            if(x.productId === product.productId && !asProductItem) {
                asProductItem = true;
                productVariations = x.variations;
            }

            //If the prouct that's gonna be added to cart
            //has equivalent size and color in the already
            //existing product in the cart. then, the product
            //is an existing variation of a product already
            //existing in the cart. In this case, just increase,
            //the quantity of the variation of product
            for(let y of x.variations) {
                quantityCount += y.purchasedQuantity;
                if(y.color === product.variations[0].color &&
                   y.size === product.variations[0].size && asProductItem) {
                    quantityCount += product.variations.length;
                    y.purchasedQuantity += product.variations[0].purchasedQuantity;
                    asVariation = true;
                    if(!setLocalStorageCart(isLoggedIn, parsedProducts)){
                        return;
                    }
                    break;
                }
            }
            if(asProductItem) break;
        }

        //If the prouct that's gonna be added to cart has
        //equivalent productId in the cart but is not a variation
        //of that equivalent product. Then, the product is a
        //variation of a product already existing in the cart.
        if(!asVariation && asProductItem){
            quantityCount += product.variations.length;
            productVariations.push(product.variations[0]);
            if(setLocalStorageCart(isLoggedIn, parsedProducts)){
                cartDispatch(setTotalQuantity(quantityCount));
            }
            return;
        }

        //If the prouct that's gonna be added to cart doesn't
        //have equivalent productId in the cart. Then, the product
        //is a new item product.
        if(!asProductItem && !asVariation) {
            const newProductList = [
                ...parsedProducts,
                product,
            ];
            if(setLocalStorageCart(isLoggedIn, newProductList)) {
                cartDispatch(incrementCount());
            }
        } 

    }
    //If there are no items in the cart, the prouct that's gonna be
    //added to cart is gonna be the first item in the cart.
    else {
        const quantityCount = product.variations.length;
        if(setLocalStorageCart(isLoggedIn, [product])) {
            cartDispatch(setTotalQuantity(quantityCount));
            cartDispatch(incrementCount());
        }
    }
};