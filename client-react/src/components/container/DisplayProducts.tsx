import React, { useEffect, useState } from 'react';

import { MinifiedProduct, MinifiedProductsPayload } from '../../scripts/types/producttypes';
import { getAllProducts } from '../../scripts/crud/products/getproducts';
import Product from '../content/Product';
import popularprodstyle from '../../css/container/minifiedproducts.scss';
import NoProductToDisplay from '../content/NoProductToDisplay';
import { useAppSelector } from '../../scripts/redux/hooks';
import { setUserCredentials } from '../../scripts/crud/users/localstorageop/setusercredentials';

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
  useState<Array<MinifiedProduct> | undefined>();
  const isLoggedIn = useAppSelector((state) => state.user.isLoggedIn);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    setLoading(true);
    if(isLoggedIn) {

      getAllProducts(signal, isLoggedIn, category, sort, showPopular).
        then((resp) => {
          if(resp?.status === 200) {
            return resp.json();
          }
          throw new Error(resp?.statusText);
        }).
        then((data) => {
          const payload = data as MinifiedProductsPayload;
          if(payload?.username && payload?.accesstoken) {
            setUserCredentials(payload.username, payload.accesstoken);
          }

          setQueriedProducts(payload?.products);
          setLoading(false);
        }).
        catch((e) => {
          if(!signal.aborted) console.error(e);
          setLoading(false);
        });
    }
    else {
      getAllProducts(signal, isLoggedIn, category, sort, showPopular).
      then((resp) => {
        if(resp?.status === 200) {
          return resp.json();
        }
        throw new Error(resp?.statusText);
      }).
      then((data) => {
        const payload = data as MinifiedProductsPayload;
        if(payload?.username && payload?.accesstoken) {
          setUserCredentials(payload.username, payload.accesstoken);
        }

        setQueriedProducts(payload?.products);
        setLoading(false);
      }).
      catch((e) => {
        if(!signal.aborted)
          console.error(e);
        setLoading(false);
      });
    }

    return () => controller.abort();
  },[sort, category, showPopular, isLoggedIn]);

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