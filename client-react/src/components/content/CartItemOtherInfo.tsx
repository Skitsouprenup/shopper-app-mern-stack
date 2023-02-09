import React, { useState } from 'react';
import { CartProductVariations } from '../../scripts/types/producttypes';

import cartstyle from '../../css/container/cart.scss';
import { decimal128ToString } from '../../scripts/utilities';
import { VariationCartProductType } from '../../scripts/types/carttypes';

interface propstype {
  productId: string | undefined,
  item: CartProductVariations | undefined, 
  itemIndex: number,
  priceAbbr: string,
  setVariationDelete: React.Dispatch<
    React.SetStateAction<VariationCartProductType | undefined>>,
}

const CartItemOtherInfo = (
  {
    productId,
    item, 
    itemIndex,
    priceAbbr,
    setVariationDelete,
  } : propstype) => {
  
  const[hoverState, setHoverState] = useState<boolean>(false);

  const removeVariation = () => {
    if(confirm('Do you want to remove this variation?')) {
      setVariationDelete(
        { 
          productId: productId as string, 
          variations: item 
        }
      );
    }
  };

  return (
    <div className={cartstyle['variation']}
         onMouseEnter={() => setHoverState(true)}
         onMouseLeave={() => setHoverState(false)}>
        <p className={cartstyle['title']}>
          <b>#{itemIndex}</b>
          {
            hoverState && (
            <button type="button" 
                    aria-label={`remove variation number ${itemIndex}`}
                    onClick={removeVariation}>
            remove
            </button>)
          }
        </p>
        <p><b>Color: </b>{item?.color}</p> 
        <p><b>Size: </b>{item?.size}</p>
        <p><b>Quantity: </b>{item?.quantity}</p>
        <p><b>Price(qty): </b>
          {
            decimal128ToString(item?.quantifiedPrice) + ' ' + priceAbbr
          }
        </p>
    </div>  
  );
};

export default CartItemOtherInfo;