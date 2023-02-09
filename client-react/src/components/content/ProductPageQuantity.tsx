import React, { useEffect } from 'react';

import productpagestyle from '../../css/container/productpage.scss'
import { QuantityActionType, CountState } from '../../scripts/productquantityreducer';

interface PropsType {
    quantity: CountState,
    availableQuantity: number,
    quantityDispatch: React.Dispatch<QuantityActionType>,
}

const ProductPageQuantity = 
    ({quantity, availableQuantity, quantityDispatch} : PropsType) => {

    return (
        <div className={productpagestyle['quantity']}>
            <p><b>Quantity</b></p>
            <div className={productpagestyle['input']}>
                <button type='button'
                        className={productpagestyle['button']}
                        onClick={() => {
                            if(quantity.count > 0)
                                quantityDispatch({type: 'decrement'});
                        }}>
                    -
                </button>
                <input type='text' name='quantity' value={quantity.count} 
                    className={productpagestyle['input-text']}
                    onChange={(e) => {
                        const inputVal = parseInt(e.target.value, 10);
                        if(inputVal) {
                            if(inputVal <= availableQuantity) {
                                quantityDispatch(
                                   {
                                       type: 'setValue', 
                                       payload: inputVal,
                                   }
                               );
                           }
                        }
                        else {
                            quantityDispatch(
                                {
                                    type: 'setValue', 
                                    payload: parseInt('0', 10),
                                }
                            );
                        }
                    }}/>
                <button type='button'
                        className={productpagestyle['button']}
                        onClick={() => {
                            if(quantity.count < availableQuantity)
                                quantityDispatch({type: 'increment'});
                        }}>
                    +
                </button>
            </div>
        </div>
    );
};

export default ProductPageQuantity;