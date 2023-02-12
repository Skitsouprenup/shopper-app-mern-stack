import React, { useEffect, useState } from 'react';

import cartstyle from '../../css/container/cart.scss';

import CartItem from '../content/CartItem';
import { ComputedCartProducts, CartProductInfo } from '../../scripts/types/producttypes';
import { decimal128ToString } from '../../scripts/utilities';
import StripeCheckoutBtn from '../content/StripeCheckoutBtn';
import { useAppDispatch, useAppSelector } from '../../scripts/redux/hooks';
import { removeItemFromCart } from '../../scripts/crud/cart/removeitemfromcart';
import { VariationCartProductType } from '../../scripts/types/carttypes';
import { removeCartProductVariation } from '../../scripts/crud/cart/removevariation';
import { initCart } from '../../scripts/crud/cart/initcart';
import NoProductToDisplay from '../content/NoProductToDisplay';
import { clearCart } from '../../scripts/crud/cart/clearcart';

const Cart = () => {
    const[productDelete, setProductDelete] = useState<string>('');
    const[variationDelete, setVariationDelete] = 
        useState<VariationCartProductType | undefined>(undefined);
    const[products, setProducts] = useState<Array<ComputedCartProducts>>([]);
    const cartCount = useAppSelector(state => state.cart);
    const isLoggedIn = useAppSelector(state => state.user.isLoggedIn);
    const cartDispatch = useAppDispatch();
    
    useEffect(() => {
        let controller: AbortController | undefined = undefined;

        if(cartCount.count) {
            controller = new AbortController();
            const signal = controller ? controller.signal : undefined;
            initCart(signal, setProducts, isLoggedIn);
        }
        
        return () => {
            if(controller)
                controller.abort();
        };
    },[cartCount.totalQuantity, cartCount.count]);

    useEffect(() => {
        removeItemFromCart(
            productDelete, 
            cartDispatch, 
            setProductDelete,
            isLoggedIn,
        );

    },[productDelete]);

    useEffect(() => {
        removeCartProductVariation(
            cartDispatch, 
            variationDelete,
            setVariationDelete,
            isLoggedIn,
        );
    },[variationDelete]);

    if(!cartCount.count && !products) {
        return(
            <NoProductToDisplay 
                msg='No items in cart.'/>
        );
    }

    return (
        <div className={cartstyle['cart-container']}>
            <h2>Your Cart</h2>
            <div className={cartstyle['links']}>
                <p>Shopping Cart
                    {
                       `(${products?.length ? 
                        products[0]?.products?.length : "0"})`
                    }
                </p>
                <p>Wishlist(0)</p>
            </div>
            <div className={cartstyle['items']}>
                <div className={cartstyle['cart-items']}>
                    {
                        products?.length && (
                            <>
                                {
                                    products[0]?.products?.length &&
                                    products[0].products.map((itemProduct) => {
                                        const { _id, title, imgPrimary, variations,
                                                currency } = itemProduct;
                                        const productInfo : CartProductInfo = {
                                            productId: _id,
                                            title,
                                            imgPrimary,
                                            price: decimal128ToString(currency[0].price),
                                            priceAbbr: currency[0].type
                                        };
                                        return <CartItem 
                                                product={productInfo}
                                                variations={variations}
                                                setProductDelete={setProductDelete}
                                                setVariationDelete={setVariationDelete}
                                                key={_id}/>
                                    })
                                }
                            </>
                        )
                    }
                </div>
                <div className={cartstyle['summary']}>
                    <p><b>Summary</b></p>
                    <div><b>Subtotal: </b>
                        {`$${
                             products?.length ? 
                             decimal128ToString(products[0]?.total) : 
                             "0"
                            }`
                        }
                    </div>
                    <div><b>Shipping Fee: </b>$0</div>
                    <div><b>Discount: </b>$0</div>
                    <div>
                        <b>Total: </b>
                        {`$${
                             products?.length ? 
                             decimal128ToString(products[0]?.total) : 
                             "0"
                            }`
                        }
                    </div>
                </div>
                
            </div>
            <div className={cartstyle['buttons']}>
                <button role='button'
                        aria-roledescription='Continue shopping'
                        className={cartstyle['cont-shopping-btn']}>
                    Continue Shopping
                </button>
                <button role='button'
                        aria-roledescription='Clear cart'
                        className={cartstyle['cont-shopping-btn']}
                        onClick={() => clearCart(cartDispatch)}>
                    Clear Cart
                </button>
                <StripeCheckoutBtn 
                    products={products}/>
            </div>
        </div>
    );
};

export default Cart;