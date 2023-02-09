import { getLocalStorCartString } from "../cart/localstorageop/getlocalstorcart";


export const computeProducts = 
    async (signal: AbortSignal, isLoggedIn: boolean) => {
        let url: string | undefined = process.env.SERVER_DOMAIN;

        if(url) {
            url += `/api/products/getcartproducts`;
            const cartProducts : string | null = getLocalStorCartString(isLoggedIn);

            if(cartProducts) {
                const request = new Request(url, {
                    method: 'POST',
                    mode: 'cors',
                    cache: 'default',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: cartProducts,
                });
    
                return await fetch(request, {signal});
            } else console.error("No Products");
        }
        else {
            console.error("Empty Domain!");
            return undefined;
        }

};