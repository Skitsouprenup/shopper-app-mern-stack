import React, { useEffect, useState } from 'react';

import { CategoryPageProductProjection } from '../../scripts/types/producttypes';
import { getAllProducts } from '../../scripts/crud/products/getproducts';
import Product from '../content/Product';
import popuplarprodstyle from '../../css/container/popularproducts.scss';
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
  useState<Array<CategoryPageProductProjection> | undefined>();

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    setLoading(true);
    getAllProducts(signal, category, sort, showPopular).
    then((resp) => resp ? resp.json() : undefined).
    then((data) => {
      setQueriedProducts(data);
      setLoading(false);
    }).
    catch((e) => {
      if(!signal.aborted)
        console.error(e);
    });

    return () => controller.abort();
  },[sort, category, showPopular])

  return (
    <div className={
      popuplarprodstyle
        [
          wrap ? 'popularproducts-container-wrap' : 
                 'popularproducts-container'
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