
export const getProductByTitle = 
    async(productTitle: string, signal: AbortSignal) => {
    let url: string | undefined = process.env.SERVER_DOMAIN;
    
    if(url && productTitle) {
        url += `api/products/getproducts/title/${productTitle}`;

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
        url += `api/products/getproducts/id/${productId}`;

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
async (signal: AbortSignal, category?: string, sort?: string, showPopular?: boolean) : 
       Promise<Response | undefined> => {
    let url: string | undefined = process.env.SERVER_DOMAIN;

    if(url) {
        url += '/api/products/getallproducts';

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

        const request = new Request(url, {
            method: 'GET',
            mode: 'cors',
            cache: 'default',
            credentials: 'omit',
        });

        const products = await fetch(request, {signal});
        return products;
    }
    else {
        console.error("Empty Domain!");
        return undefined;
    }
}