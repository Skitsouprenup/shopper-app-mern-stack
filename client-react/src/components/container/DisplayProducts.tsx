import React, { useEffect, useState } from 'react';

import { MinifiedProductProjection } from '../../scripts/types/producttypes';
import { getAllProducts } from '../../scripts/crud/products/getproducts';
import Product from '../content/Product';
import popularprodstyle from '../../css/container/minifiedproducts.scss';
import NoProductToDisplay from '../content/NoProductToDisplay';

type propstype = {
  wrap?: boolean,
  sort?: string,
  category?: string,
  showPopular?: boolean,
};

const DisplayProducts = ({wrap = false, 
                          sort = '', 
                          category = '',
                          showPopular = false} : propstype) => {
  const[loading, setLoading] = useState<Boolean>(true);
  const[queriedProducts, setQueriedProducts] = 
  useState<Array<MinifiedProductProjection> | undefined>();

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    setLoading(true);
    getAllProducts(signal, category, sort, showPopular).
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
  },[sort, category, showPopular])

  if(loading)
    return <div>Loading...</div>;

  return(
    <div className={
      popularprodstyle
        [
          wrap ? 'minifiedproducts-container-wrap' : 
                 'minifiedproducts-container'
        ]
      }>
      {
       queriedProducts?.length ? (
        queriedProducts.
        map((item) => <Product item={item} key={item._id}/>)
       ) : <NoProductToDisplay msg='No Products to Display.'/>
      }
    </div>
  );
};

export default DisplayProducts;