import React, { useContext, useEffect, useState } from 'react';
import { SearchItemContext } from '../../scripts/appcontext';
import { MinifiedProduct } from '../../scripts/types/producttypes';
import { getProductByTitle } from '../../scripts/crud/products/getproducts';

import productstyle from '../../css/container/minifiedproducts.scss';
import Product from './Product';
import NoProductToDisplay from './NoProductToDisplay';

const SearchPage = () => {
    const[loading, setLoading] = useState<boolean>(true);
    const[queriedProducts, setQueriedProducts] = 
        useState<Array<MinifiedProduct>>();
    const searchItemContext = useContext(SearchItemContext);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        if(searchItemContext?.searchItem) {
            setLoading(true);
            getProductByTitle(searchItemContext?.searchItem, signal).
            then((resp) => {
                if(resp?.status === 200) {
                    return resp.json();
                }
                throw new Error(resp?.statusText);
            }).
            then((data) => {
                setQueriedProducts(data);
                setLoading(false);
            }).
            catch((e) => {
                if(!signal.aborted)
                  console.error(e);
                setLoading(false);
            });

            return () => controller.abort();
        }
    },[searchItemContext?.searchItem]);

    if(loading && queriedProducts?.length)
        return <div>Loading...</div>

    return (
        <div className={productstyle['minifiedproducts-container-wrap']}>
            {
             queriedProducts?.length ? (
              queriedProducts.
              map((item) => <Product item={item} key={item._id}/>)
             ) : <NoProductToDisplay msg='No Products to Display.'/>
            }
        </div>
    );
};

export default SearchPage;