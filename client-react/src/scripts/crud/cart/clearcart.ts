import { AppDispatch } from "../../redux/reduxstore";
import { setCount, setTotalQuantity } from "../../redux/slices/cartslice";

export const clearCart = (cartDispatch: AppDispatch) => {
    if(confirm('do you want to remove all items in your cart?')) {
        localStorage.removeItem('cart');
        cartDispatch(setCount(0));
        cartDispatch(setTotalQuantity(0));
    }
};