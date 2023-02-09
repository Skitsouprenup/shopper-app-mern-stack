import React, { useEffect } from 'react';
import ProductColorBtn from './ProductColorBtn';
import ProductSizeSelection from './ProductSizeSelection';

import { itemType } from '../../scripts/types/producttypes';
import { QuantityActionType } from '../../scripts/productquantityreducer';

import productpagestyle from '../../css/container/productpage.scss';
import { ProductSizeContext } from '../../scripts/appcontext';

interface propstype {
  item: itemType,
  setAvailableQuantity: React.Dispatch<React.SetStateAction<number>>,
  selectedColor: string,
  setSelectedColor: React.Dispatch<React.SetStateAction<string>>,
  selectedSize: string,
  setSelectedSize: React.Dispatch<React.SetStateAction<string>>,
  quantityDispatch: React.Dispatch<QuantityActionType>,
};

const ProductColorSizeSelection = 
  ({item, setAvailableQuantity, selectedColor, setSelectedColor,
    selectedSize, setSelectedSize, quantityDispatch} : propstype) => {


  return (
    <>
      <div className={productpagestyle['propertylist']}>
        <p><b>Color</b></p>
        <div className={productpagestyle['color-selection']}>
        {
          item.map((item) => {
            return <ProductColorBtn 
                      color={item.color}
                      key={item.color}
                      selectedColor={selectedColor}
                      setSelectedColor={setSelectedColor} />
          })
        }
        </div>
      </div>

      <div className={productpagestyle['propertylist']}>
        <p><b>Size</b></p>
        <ProductSizeContext.Provider value={{selectedSize, setSelectedSize}}>
          {
            item.map((item) => {
              if(item.color === selectedColor) {
                return <ProductSizeSelection 
                          size={item.size}
                          key={item._id}
                          setAvailableQuantity={setAvailableQuantity}
                          quantityDispatch={quantityDispatch}/>
              } else return null;
            })
          }
        </ProductSizeContext.Provider>
      </div>
    </>
  );
};

export default ProductColorSizeSelection;