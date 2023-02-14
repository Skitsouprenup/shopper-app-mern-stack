import { getUserCredentials } from "../users/localstorageop/getusercredentials";

export const likeProduct = 
    (productId: string,
     isLoggedIn: boolean,
     likeCount: boolean) => {

    try {
        let url: string | undefined = process.env.SERVER_DOMAIN;

        if(url && productId) {
            if(isLoggedIn) {
                const user: {username: string, accesstoken: string} = getUserCredentials();    

                if(user) {
                    const queryString = 
                        '?productId='+productId+'&username='+user?.username+
                        '&likecount='+likeCount;
                    url += '/api/products/setlike'+queryString;

                    const request = new Request(url, {
                        method: 'GET',
                        mode: 'cors',
                        credentials: 'include',
                        cache: 'no-store',
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
     productId: string, 
     likeCount: boolean) => {
    
    try {
        let url: string | undefined = process.env.SERVER_DOMAIN;

        if(url && productId) {
            const user: {username: string, accesstoken: string} = getUserCredentials();

            let queryString = '';

            if(user) {
                queryString = '?productId='+productId+'&username='+user?.username+
                              '&likecount='+likeCount;
            }
            else {
                queryString = '?productId='+productId+'&likecount='+likeCount;
            }
            url += '/api/products/verifylike'+queryString;

            const reqHeaders : HeadersInit = user ? {
                'Content-Type':'application/json',
                'Authorization':'Bearer ' + user.accesstoken,
            } : {
                'Content-Type':'application/json',
            }

            const request = new Request(url, {
                method: 'GET',
                mode: 'cors',
                credentials: 'include',
                cache: 'no-store',
                headers: reqHeaders,
            });

            return fetch(request, {signal});
        } else console.error(`Can't find username or productId.`);
    }
    catch(e) {
        console.error(e);
    }

    return null;
}