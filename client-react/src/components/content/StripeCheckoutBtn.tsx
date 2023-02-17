import React from 'react';
import cartstyle from '../../css/container/cart.scss';
import { clearCart } from '../../scripts/crud/cart/clearcart';
import { getUserCredentials } from '../../scripts/crud/users/localstorageop/getusercredentials';
import { setUserCredentials } from '../../scripts/crud/users/localstorageop/setusercredentials';
import { useAppDispatch } from '../../scripts/redux/hooks';
import { CartCheckoutType } from '../../scripts/types/carttypes';

import { ComputedCartProducts, ProductInCartNoPriceInCents } from '../../scripts/types/producttypes';
import { StripeLineItem } from '../../scripts/types/stripetypes';
import { decimal128ToString } from '../../scripts/utilities';

type propstype = { products: ComputedCartProducts[] | undefined };
const StripeCheckoutBtn = ({products} : propstype) => {
    const stripeKey = process.env.STRIPE_PUB_KEY;
    const globalStateDispatch = useAppDispatch();

    const getCartItems = (): CartCheckoutType => {
        let stripeItems: Array<StripeLineItem> = [];
        let productItems: ProductInCartNoPriceInCents = [];
        let total: string | undefined = undefined;

        products?.forEach((product) => {
            total = decimal128ToString(product.total);

            product.products.forEach((item) => {
                productItems.push(item);

                item.variations.forEach((vItem) => {
                    stripeItems.push({
                        quantity: vItem?.quantity as number,
                        price_data: {
                            currency: item.currency[0].type,
                            unit_amount_decimal: 
                                decimal128ToString(
                                    item.priceInCents) as string,
                            product_data: {
                                name: item.title,
                                description: 'Color: ' + vItem?.color,
                            }
                        }
                    });
                });
            });
        });

        return {
            lineItems: stripeItems, 
            productsOrder: productItems,
            total,
        };
    };

    const checkout = async () => {
        const url: string | undefined = 
            process.env.SERVER_DOMAIN + '/api/stripe/payment';

        const user: {username: string, accesstoken: string} = getUserCredentials();

        const request = new Request(url, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-store',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization':'Bearer ' + user?.accesstoken,
            },
            body: JSON.stringify(
                {
                    items: getCartItems(),
                    username: user?.username,
                }
            ),
        });

        await fetch(request).
                then((resp) => {
                    if(resp.status === 200) {
                        return resp.json();
                    } else return undefined;
                }).
                then((data) => {
                    if(data) {
                        setUserCredentials(
                            data?.username as string, 
                            data?.accesstoken as string
                        );
                        clearCart(globalStateDispatch, true);
                        window.location.replace(data?.url);
                    }
                }).
                catch((e) => console.error(e));
            
    };

    if(!stripeKey) {
        console.error("invalid Stripe Key!");
        return (
            <button className={cartstyle['checkout-btn']}
                    disabled={true}>
                Out of Service
            </button>
        );
    }

    return (
        <button className={cartstyle['checkout-btn']}
             onClick={checkout}>
            Checkout
        </button>
    );
};

export default StripeCheckoutBtn;