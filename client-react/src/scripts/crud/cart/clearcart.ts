import { AppDispatch } from "../../redux/reduxstore";
import { setCount, setTotalQuantity } from "../../redux/slices/cartslice";
import { getUserCredentials } from "../users/localstorageop/getusercredentials";

export const clearCart = 
    (cartDispatch: AppDispatch,
     isLoggedIn: boolean, 
     noConfirm = false) => {

    if(isLoggedIn) {
        const user: {username: string} = getUserCredentials();

        if(user?.username) {
            if(noConfirm) {
                localStorage.removeItem(user.username + '-cart');
                cartDispatch(setCount(0));
                cartDispatch(setTotalQuantity(0));
            }
            else {
                if(confirm('do you want to remove all items in your cart?')) {
                    localStorage.removeItem(user.username + '-cart');
                    cartDispatch(setCount(0));
                    cartDispatch(setTotalQuantity(0));
                }
            }
        } else console.error("Can't find username in user credentials!");
    } else console.error(
        "Can't clear cart! "+
        "You must be logged in first to access your cart");
};