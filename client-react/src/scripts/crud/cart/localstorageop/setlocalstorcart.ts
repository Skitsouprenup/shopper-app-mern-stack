import { CartProductType } from "../../../types/cartslicetypes";
import { getUserCredentials } from "../../users/localstorageop/getusercredentials";

export const setLocalStorageCart = 
    (
        isLoggedIn: boolean, 
        parsedProducts : Array<CartProductType>,
    ) => {

    if(isLoggedIn) {
        const credentials: {username: string} = getUserCredentials();
        if(credentials?.username) {
            localStorage.setItem(
                credentials.username + '-cart', 
                JSON.stringify(parsedProducts));
            return true;
        } else {
            console.error(`Can't find username!`);
            return false;
        }
    } else return false;
}