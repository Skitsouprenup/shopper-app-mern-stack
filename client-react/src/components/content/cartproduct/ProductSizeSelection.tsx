import React, { useEffect, useState, useContext } from 'react';

import { sizeType } from '../../../scripts/types/producttypes';
import ProductSizeBtn from './ProductSizeBtn';

import productpagestyle from '../../../css/container/productpage.scss';
import { ProductSizeContext } from '../../../scripts/appcontext';
import { QuantityActionType } from '../../../scripts/productquantityreducer';

interface quantityCompProps {
  quantity: number,
  setAvailableQuantity: React.Dispatch<React.SetStateAction<number>>,
}
const AvailableQuantity = ({quantity, setAvailableQuantity} : quantityCompProps) => {

  useEffect(() => {
    setAvailableQuantity(quantity);
  },[quantity]);

  return(
    <div>
      {quantity + ' Pieces Available'}
    </div>
  );

}

interface selectionProps {
    size: sizeType[],
    setAvailableQuantity: React.Dispatch<React.SetStateAction<number>>,
    quantityDispatch: React.Dispatch<QuantityActionType>,
}

const ProductSizeSelection = 
  ({size, setAvailableQuantity, 
    quantityDispatch} : selectionProps) => {
  const[selectedQuantity, setSelectedQuantity] = useState<number>(0);
  const sizeContext = useContext(ProductSizeContext);

  useEffect(() => {
    for(let x of size) {
      if(x.type === sizeContext.selectedSize)
        setSelectedQuantity(x.quantity);
    }
  },[sizeContext.selectedSize]);

  return (
    <div className={productpagestyle['size-selection']}>
      <div className={productpagestyle['selection-content']}>
        {
          size.map((item) => {
              return (
                <div className={productpagestyle['size-selection-buttons']}
                      key={item._id}>
                    <ProductSizeBtn 
                      sizeName={item.type}
                      quantityDispatch={quantityDispatch}/>
                </div>
              )
          })
        }
      </div>
      <AvailableQuantity 
        quantity={selectedQuantity}
        setAvailableQuantity={setAvailableQuantity}/>
    </div>
  );
};

export default ProductSizeSelection;