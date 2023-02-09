import { AppDispatch } from "../../redux/reduxstore";
import { setCount, setTotalQuantity } from "../../redux/slices/cartslice";
import { logoutUserState, resetFetchState } from "../../redux/slices/userslice";

export const logoutUser = (storeDispatch : AppDispatch) => {
    let url: string | undefined = process.env.SERVER_DOMAIN;

    if(url) {
        const credentials = JSON.parse(localStorage.getItem('credentials') as string);
        if(!credentials) {
            console.error("Credentials Not Found!");
            return;
        }

        url += '/api/users/logout?username='+credentials.username;

        const request = new Request(url, {
            method: 'GET',
            mode: 'cors',
            cache: 'no-store',
            credentials: 'include',
        });

        fetch(request).
        then((resp) => {
            if(resp.status === 204) {
                localStorage.removeItem('credentials');
                storeDispatch(logoutUserState());
                storeDispatch(setCount(0));
                storeDispatch(setTotalQuantity(0));
            } else storeDispatch(resetFetchState());
        });
    }
    else console.error('Domain Not Found!');
};