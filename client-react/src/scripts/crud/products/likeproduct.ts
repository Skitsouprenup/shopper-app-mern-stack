import { getUserCredentials } from "../users/localstorageop/getusercredentials";

export const likeProduct = 
    (productId: string,
     isLoggedIn: boolean) => {

    try {
        let url: string | undefined = process.env.SERVER_DOMAIN;

        if(url && productId) {
            if(isLoggedIn) {
                const user: {username: string, accesstoken: string} = getUserCredentials();    

                if(user) {
                    const queryString = '?productId='+productId+'&username='+user?.username;
                    url += '/api/products/setlike'+queryString;

                    const request = new Request(url, {
                        method: 'GET',
                        mode: 'cors',
                        credentials: 'include',
                        cache: 'default',
                        headers: {
                            'Content-Type':'application/json',
                            'Authorization':'Bearer ' + user.accesstoken,
                        },
                    });

                    return fetch(request);
                }
            }else console.error(`User not logged in.`);
        }else console.error(`Can't find username or productId.`);
    }
    catch(e) {
        console.error(e);
    }

    return null;
};

export const verifyLike = 
    (signal: AbortSignal,
     productId: string) => {
    
    try {
        let url: string | undefined = process.env.SERVER_DOMAIN;

        if(url && productId) {
            const user: {username: string, accesstoken: string} = getUserCredentials();

            if(user) {
                const queryString = '?productId='+productId+'&username='+user?.username;
                url += '/api/products/verifylike'+queryString;

                const request = new Request(url, {
                    method: 'GET',
                    mode: 'cors',
                    credentials: 'include',
                    cache: 'default',
                    headers: {
                        'Content-Type':'application/json',
                        'Authorization':'Bearer ' + user.accesstoken,
                    },
                });

                return fetch(request, {signal});
            }
        } else console.error(`Can't find username or productId.`);
    }
    catch(e) {
        console.error(e);
    }

    return null;
}