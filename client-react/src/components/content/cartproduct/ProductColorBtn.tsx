import React from 'react';

import productpagestyle from '../../../css/container/productpage.scss';

interface propstype {
    color: string,
    selectedColor: string,
    setSelectedColor: React.Dispatch<React.SetStateAction<string>>,
}

const ProductColorBtn = ({color, selectedColor, setSelectedColor}: propstype) => {

  return (
    <div className={
          color === selectedColor ? 
          productpagestyle['selected-button'] : 
          productpagestyle['selection-button']
        }
         onClick={() => {
          setSelectedColor(color);
         }}>
        {color}
    </div>
  );
};

export default ProductColorBtn;