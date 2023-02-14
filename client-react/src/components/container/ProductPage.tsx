import React, { useEffect, useReducer, useState } from 'react';
import { useParams } from 'react-router-dom';
import { IoIosHeart } from 'react-icons/io';

import productpagestyle from '../../css/container/productpage.scss';
import { ProductType } from '../../scripts/types/producttypes';
import { getProductById } from '../../scripts/crud/products/getproducts';
import { decimal128ToString } from '../../scripts/utilities';
import ProductColorSizeSelection from '../content/ProductColorSizeSelection';
import ProductPageQuantity from '../content/ProductPageQuantity';
import { quantityReducer, initialQuantity } from '../../scripts/productquantityreducer';
import { CartProductType } from '../../scripts/types/cartslicetypes';
import { addItemToCart } from '../../scripts/crud/cart/additemtocart';
import { useAppDispatch, useAppSelector } from '../../scripts/redux/hooks';
import { likeProduct, verifyLike } from '../../scripts/crud/products/likeproduct';
import { setUserCredentials } from '../../scripts/crud/users/localstorageop/setusercredentials';

const ProductPage = () => {
    const[product, setProduct] = useState<ProductType>();
    const[availableQuantity, setAvailableQuantity] = useState<number>(0);
    const[selectedColor, setSelectedColor] = useState<string>('');
    const[selectedSize, setSelectedSize] = useState<string>('');
    const[quantity, quantityDispatch] = useReducer(quantityReducer, initialQuantity);
    
    const[isLiked, setIsLiked] = useState<boolean>(false);
    const[likeLoading, setLikeLoading] = useState<boolean>(false);
    const[likeCount, setLikeCount] = useState<number>(0);

    const cartDispatch = useAppDispatch();
    const isLoggedIn = useAppSelector((state) => state.user.isLoggedIn);

    const productId = useParams()?.productId;

    useEffect(() => {
        window.scrollTo(0,0);
        const controller = new AbortController();
        const signal = controller.signal;

        getProductById(productId ? productId : '', signal).
        then((resp) => resp?.json()).
        then((data) => {
            setProduct(data);
            setSelectedColor(data?.item[0]?.color);
            setSelectedSize(
                data?.item[0]?.size?.length ? 
                data?.item[0]?.size[0].type : ''
            );
        }).
        catch((e) => {
            if(!signal.aborted)
                console.error(e);
        });

        return () => controller.abort();
    },[productId]);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        const likeStatus = 
            verifyLike(signal, productId as string, true);

        if(likeStatus) {
            likeStatus.
            then((resp) => {
                if(resp?.status === 200) {
                    return resp.json();
                } else return undefined;
            }).
            then((data) => {
                if(data) {
                    if(data?.username && data?.accesstoken) {
                        setUserCredentials(data.username, data.accesstoken);
                    }
                    const receivedStatus: boolean = data?.isLiked as boolean;
                    const likes: number = data?.likeCount as number;
                    setIsLiked(receivedStatus);
                    setLikeCount(likes);
                }
            }).
            catch((e) => {
                if(!signal.aborted) {
                    console.error(e);
                }
            });
        }

        return () => controller.abort();
    },[productId]);

    useEffect(() => {
        quantityDispatch({type: 'setValue', payload: 0});
      },[selectedColor])

    const setLikeProduct = () => {
        if(!likeLoading) setLikeLoading(true);
        const likeStatus = likeProduct(productId as string, isLoggedIn, true);

        if(likeStatus) {
            likeStatus.
            then((resp) => {
                if(resp.status === 200) {
                    return resp.json();
                } else return undefined;
            }).
            then((data) => {
                if(data) {
                    const receivedStatus: boolean = data?.isLiked as boolean;
                    const likes: number = data?.likeCount as number;
                    setUserCredentials(data?.username, data?.accesstoken);
                    setIsLiked(receivedStatus);
                    setLikeCount(likes);
                }
                setLikeLoading(false);
            }).
            catch((e) => {
                console.error(e);
                setLikeLoading(false);
            })
        }
    }

    const addToCart = () => {
        if(product) {
            const{ _id } = product;

            //variations array here must only have one
            //item because this function only adds
            //single item in the cart
            const cartProduct: CartProductType = {
                productId: _id,
                variations: [{
                    purchasedQuantity: quantity.count,
                    color: selectedColor,
                    size: selectedSize,
                }],
            };

            addItemToCart(cartProduct, cartDispatch, isLoggedIn);
            //Reset quantity input
            quantityDispatch(
                {
                    type: 'setValue', 
                    payload: parseInt('0', 10),
                }
            );
        }
    };

    return (
        <div className={productpagestyle['productpage-container']}>
            <div className={productpagestyle['title']}>
                <h1>{product?.title}</h1>
            </div>
            <div className={productpagestyle['image-container']}>
                <img alt='product-image' src={product?.imgPrimary}
                     className={productpagestyle['image']}/>
            </div>
            <div className={productpagestyle['info']}>
                <p className={productpagestyle['desc']}>{product?.desc}</p>

                {(product?.item) && (
                    product?.item?.length &&
                    <ProductColorSizeSelection 
                            item={product?.item}
                            setAvailableQuantity={setAvailableQuantity}
                            selectedColor={selectedColor}
                            setSelectedColor={setSelectedColor}
                            selectedSize={selectedSize}
                            setSelectedSize={setSelectedSize}
                            quantityDispatch={quantityDispatch}/>
                )}

                <ProductPageQuantity
                    availableQuantity={availableQuantity}
                    quantity={quantity}
                    quantityDispatch={quantityDispatch} />

                <p className={productpagestyle['price']}>
                    <b>Price:</b> {
                        decimal128ToString(product?.currency[0].price) + ' ' + 
                        product?.currency[0].type.toUpperCase()
                    }
                </p>
                <p className={productpagestyle['likes']}>
                    <b>Likes:</b> {
                        likeCount
                    }
                </p>
                {
                    isLoggedIn ? (
                    <div className={productpagestyle['buttons']}>
                        <button type='button' 
                                aria-label='Like product'
                                className={productpagestyle['like-button']}
                                onClick={setLikeProduct}
                                disabled={likeLoading}>
                            {
                               likeLoading ? 
                               <div className={productpagestyle['not-liked']}>
                                ...
                                </div> :
                               isLiked ? 
                               <div className={productpagestyle['liked']}>
                                    <IoIosHeart />
                                </div> : 
                                <div className={productpagestyle['not-liked']}>
                                    Like
                                </div>
                            }
                        </button>
                        <button type='button'
                                aria-label='Add to shopping cart'
                                className={
                                    (availableQuantity && quantity.count) ? 
                                    productpagestyle['add-to-cart-button'] :
                                    productpagestyle['add-to-cart-disabled-button']
                                }
                                onClick={addToCart} 
                                disabled={
                                    (availableQuantity && quantity.count) ? false : true
                                }>
                            Add To Cart
                        </button>
                    </div>) : (
                        <div style={{
                            fontStyle: 'italic',
                            fontWeight: '600',
                            color: 'gray',
                        }}>
                            You must log-in first before you can buy or like this product.
                        </div>
                    )
                }
            </div>
        </div>
    );
};

export default ProductPage;