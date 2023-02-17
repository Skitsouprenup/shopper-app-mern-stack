import { getUserCredentials } from "../users/localstorageop/getusercredentials";

export const getProductByTitle = 
    async(productTitle: string, signal: AbortSignal) => {
    let url: string | undefined = process.env.SERVER_DOMAIN;
    
    if(url && productTitle) {
        url += `/api/products/getproducts/title/${productTitle}`;

        const request = new Request(url, {
            method: 'GET',
            mode: 'cors',
            cache: 'default',
            headers: {
                'Content-Type':'application/json',
            },
        });

        const product = await fetch(request, {signal});
        return product;
    }
    else {
        console.error("Empty domain and product title!");
        return undefined;
    }
}

export const getProductById = async (productId: string, signal: AbortSignal) => {
    let url: string | undefined = process.env.SERVER_DOMAIN;
    
    if(url && productId) {
        url += `/api/products/getproducts/id/${productId}`;

        const request = new Request(url, {
            method: 'GET',
            mode: 'cors',
            cache: 'default',
            headers: {
                'Content-Type':'application/json',
            },
        });

        const product = await fetch(request, {signal});
        return product;
    }
    else {
        console.error("Empty Domain and product id!");
        return undefined;
    }
};

export const getAllProducts = 
async (signal: AbortSignal,
       isLoggedIn: boolean,
       category?: string, 
       sort?: string, 
       showPopular?: boolean) : 
       Promise<Response | undefined> => {
    let url: string | undefined = process.env.SERVER_DOMAIN;

    if(url) {
        url += '/api/products/getallproducts';

        let user: {username: string, accesstoken: string} | undefined = undefined;

        if(isLoggedIn)
            user = getUserCredentials();

        if(category)
            url += `?category=${category}`;
        if(sort) {
            if(category)
                url += `&sort=${sort}`;
            else 
                url += `?sort=${sort}`;
        }
        if(showPopular) {
            if(category || sort)
                url += `&showPopular=true`;
            else url += `?showPopular=true`;
        }

        if(user?.username) {
            if(category || sort || showPopular)
                url += '&username='+user.username;
            else url += '?username='+user.username;
        }
        let requestHeaders : HeadersInit | null = null;

        if(user?.accesstoken) {
            requestHeaders = {
                'Content-Type':'application/json',
                'Authorization': 'Bearer ' + user.accesstoken
            }
        }
        else {
            requestHeaders = {
                'Content-Type':'application/json'
            }
        }

        const request = new Request(url, {
            method: 'GET',
            mode: 'cors',
            cache: 'default',
            credentials: user?.username ? 'include' : 'omit',
            headers: requestHeaders
        });

        const products = await fetch(request, {signal});
        return products;
    }
    else {
        console.error("Empty Domain!");
        return undefined;
    }
}