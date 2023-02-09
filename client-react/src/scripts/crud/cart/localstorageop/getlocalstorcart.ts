import { CartProductType } from "../../../types/cartslicetypes";
import { getUserCredentials } from "../../users/localstorageop/getusercredentials";

export const getLocalStorCart = (isLoggedIn: boolean): Array<CartProductType> => {
    if(isLoggedIn) {
        const user: {username: string} = getUserCredentials();
        if(user && user?.username) {
            const cartStor = localStorage.getItem(user.username + '-cart');
            if(!cartStor) return [];
            return JSON.parse(cartStor);
        } else return [];
    } else return [];
};

export const getLocalStorCartString = (isLoggedIn: boolean): string => {
    if(isLoggedIn) {
        const user: {username: string} = getUserCredentials();
        if(user && user?.username) {
            const cartStor = localStorage.getItem(user.username + '-cart');
            if(!cartStor) return '';
            return cartStor;
        } else return '';
    } else return '';
};