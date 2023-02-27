import React, { useState } from 'react';
import { IoCloseCircleSharp } from 'react-icons/io5';

import cartstyle from '../../../css/container/cart.scss';
import { VariationCartProductType } from '../../../scripts/types/carttypes';
import { CartProductVariations, CartProductInfo } from '../../../scripts/types/producttypes';
import CartItemOtherInfo from './CartItemOtherInfo';

interface PropsType {
    product: CartProductInfo,
    variations: Array<CartProductVariations | undefined>,
    setProductDelete: React.Dispatch<React.SetStateAction<string>>,
    setVariationDelete: React.Dispatch<
        React.SetStateAction<VariationCartProductType | undefined>>,
}

const CartItem = (
    {product, 
     variations, 
     setProductDelete,
     setVariationDelete} : PropsType) => {

    const[hoverState, setHoverState] = useState<boolean>();

    const removeProduct = () => {
        if(confirm('Do you want to remove this product?')) {
            setProductDelete(
                product?.productId ? 
                product?.productId.toString() : ''
            );
        }
    };

    return (
        <div className={cartstyle['item-container']}
             onMouseEnter={() => setHoverState(true)}
             onMouseLeave={()=> setHoverState(false)}>
            {
                hoverState && (
                <div className={cartstyle['delete-btn-container']}>
                    <div role='button' 
                        aria-roledescription='remove cart product'
                        onClick={removeProduct}>
                        <IoCloseCircleSharp />
                    </div>
                </div>
                )
            }
            <div className={cartstyle['item']}>
                <div className={cartstyle['image-container']}>
                    <img alt='product-picture' src={product.imgPrimary}/>
                </div>
                <div className={cartstyle['info']}>
                    <div className={cartstyle['product-info']}>
                        <p><b>Product</b></p>{product.title}
                        <p><b>ID </b></p>
                        <p className={cartstyle['productid']}>{product.productId}</p>
                        <p><b>Price(base)</b></p>
                        {
                            product.price + ' ' + 
                            product.priceAbbr.toLocaleUpperCase()
                        }
                    </div>
                    <div className={cartstyle['amount-info']}>
                        <p><b>Variations</b></p>
                        {
                            variations.map((item, index) => {
                                return(
                                    <CartItemOtherInfo
                                        key={item?.color + ' ' + item?.size}
                                        productId={product.productId}
                                        item={item} 
                                        itemIndex={index+1}
                                        priceAbbr={product.priceAbbr.toLocaleUpperCase()}
                                        setVariationDelete={setVariationDelete}/>
                                );
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartItem;