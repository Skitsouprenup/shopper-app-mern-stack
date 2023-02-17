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

//for product page
export const verifyLike = 
    (signal: AbortSignal,
     productId: string,
     isLoggedIn: boolean) => {

    try {
        let url: string | undefined = process.env.SERVER_DOMAIN;

        if(url && productId) {
            let queryString = '';
            let reqHeaders : HeadersInit | null = null;
            let request : Request | null = null;
            let user : {username: string, accesstoken: string} | null = null;

            if(isLoggedIn) {
                user = getUserCredentials();
            }

            if(user) {
                queryString = '?productId='+productId+'&username='+user?.username;
                url += '/api/products/verifylike'+queryString;

                reqHeaders = {
                    'Content-Type':'application/json',
                    'Authorization':'Bearer ' + user.accesstoken,
                };

                request = new Request(url, {
                    method: 'GET',
                    mode: 'cors',
                    credentials: 'include',
                    cache: 'no-store',
                    headers: reqHeaders,
                });
            }
            else {
                queryString = '?productId='+productId;
                url += '/api/products/verifylike'+queryString;

                reqHeaders = {
                    'Content-Type':'application/json',
                };
                request = new Request(url, {
                    method: 'GET',
                    mode: 'cors',
                    cache: 'no-store',
                    headers: reqHeaders,
                });
            }

            console.log(url);
            return fetch(request, {signal});
        } else console.error(`Can't find username or productId.`);
    }
    catch(e) {
        console.error(e);
    }

    return null;
}