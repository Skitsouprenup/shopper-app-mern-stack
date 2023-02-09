import React, { useContext } from 'react';

import productpagestyle from '../../css/container/productpage.scss';
import { ProductSizeContext } from '../../scripts/appcontext';
import { QuantityActionType } from '../../scripts/productquantityreducer';

interface propstype {
  sizeName: string,
  quantityDispatch: React.Dispatch<QuantityActionType>,
}

const ProductSizeBtn = ({sizeName, quantityDispatch} : propstype) => {
  const sizeContext = useContext(ProductSizeContext);

  return (
    <div className={
          sizeName === sizeContext.selectedSize ? 
          productpagestyle['selected-button'] : 
          productpagestyle['selection-button']
        }
         onClick={() => {
          if(sizeContext.setSelectedSize)
            sizeContext.setSelectedSize(sizeName);

            quantityDispatch(
              {
                  type: 'setValue', 
                  payload: parseInt('0', 10),
              }
            );
         }}>
        {sizeName}
    </div>
  );
};

export default ProductSizeBtn;