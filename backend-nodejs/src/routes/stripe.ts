import { randomBytes } from "crypto";
import express from "express";
import mongoose from "mongoose";
import Stripe from "stripe";
import OrderModel from "../models/OrderModel.js";
import ProductModel from "../models/ProductModel.js";
import { CartCheckoutType } from "../types/carttypes.js";
import { ProductInCartNoPriceInCents } from "../types/producttypes.js";
import { StripeLineItem } from "../types/stripetypes.js";
import handleSession from "./verifysession.js";

let stripe: Stripe | undefined = undefined;
const StripeRouter = express.Router();

export const stripeInit = () => {
    stripe = new Stripe(process.env.STRIPE_SEC as string, 
        {apiVersion: '2022-11-15', typescript: true});
};

StripeRouter.post("/payment", async (req, res) => {
    await(handleSession(req, res, "VERIFY"));

    try{
        const items : CartCheckoutType = req.body.items;

        if(items && stripe && res.locals?.username &&
           res.locals?.userId && res.locals?.accesstoken) {

            //Remove existing order. A user can only have
            //one pending order.
            const existingOrder = 
                    await OrderModel.findOne(
                        { userId: res.locals.userId, 
                          status: 'pending' }, 
                        'stripeSessionUrl');
            if(existingOrder) {
                await stripe?.checkout.sessions.expire(existingOrder?.stripeSessionUrl);
                await existingOrder.remove();
            }

            let cartStripeProducts : Array<StripeLineItem> = [];
            let productsOrder : ProductInCartNoPriceInCents = [];

            cartStripeProducts = [...items.lineItems];
            productsOrder = [...items.productsOrder];

            //Bad Request #1
            if(!cartStripeProducts.length && !productsOrder.length) {
                //console.error('No products!');
                if(!res.headersSent)
                    res.sendStatus(400);
                return;
            }

            //Note: productsIds length must be equal to productsOrder
            const productIds: Array<mongoose.Types.ObjectId> = [];
            
            for(let x of productsOrder) {
                productIds.push(new mongoose.Types.ObjectId(x._id));
            }

            //Note: queriedProducts length must be equal to
            //productIds
            const queriedProducts = 
                await ProductModel.find({
                    _id: { 
                        $in: { 
                            productIds
                        }
                    }
                },'item');

            //Bad Request #2
            if(queriedProducts.length !== productIds.length &&
               productsOrder.length !== productIds.length) {
                /*
                    console.error('Invalid query! number of queried products array'
                    +' length must be equal to number of products in request!');
                */
                if(!res.headersSent)
                    res.sendStatus(400);
                return;
            }

            /*
            mongodb ObjectId requires a string of 12 bytes or a string
            of 24 hex characters or an integer
            */
            const orderId = randomBytes(12).toString('hex');
            //create checkout session
            const session = await stripe.checkout.sessions.create({
                line_items: cartStripeProducts,
                mode: 'payment',
                success_url: 'http://localhost:3000',
                cancel_url: 'http://localhost:3000/404',
                metadata: {
                    userId: res.locals.userId,
                    orderId,
                }
            });

            //Reduce product stock
            const updateProducts = [];
            for(let x = 0; x < productIds.length; x++) {
                if(queriedProducts[x]._id.toString() === productsOrder[x]._id) {
                    for(let y of queriedProducts[x].item) {
                        for(let z of productsOrder[x].variations) {
                            if(y.color === z?.color) {
                                for(let a of y.size) {
                                    const quantity = a.quantity - z.quantity;

                                    if(quantity >= 0) {
                                        const modifiedSize = a;
                                        modifiedSize.quantity = quantity;

                                        updateProducts.push({
                                            updateOne: {
                                                filter: {
                                                    _id: productsOrder[x]._id
                                                },
                                                update: {
                                                    $set: {
                                                        item: y
                                                    }
                                                },
                                                upsert: true
                                            }
                                        });
                                    }
                                    else {
                                        //Bad Request #3
                                        /*
                                            console.error(`${queriedProducts[x].title}
                                            stock calculation is invalid!`);
                                        */
                                        if(!res.headersSent){
                                            const msg = queriedProducts[x].title +
                                            ' current stock is insufficient.'
                                            res.statusMessage = msg
                                            res.sendStatus(400);
                                        }
                                        return;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            await ProductModel.collection.bulkWrite(updateProducts);

            //3 mins
            const expireTimeLengthMillis = 1000 * 180;

            //create new order
            const newOrder = new OrderModel({
                _id: orderId,
                userId: res.locals.userId,
                products: productsOrder,
                stripeSessionUrl: session.url,
                expiration: Date.now() + expireTimeLengthMillis,
            });
            newOrder.isNew = true;
            await newOrder.save();

            //delete order if it's still pending after
            //the expiration time
            setTimeout(async () => {
                const order = 
                    await OrderModel.findOne(
                        { _id: orderId, status: 'pending' }, 
                        'stripeSessionUrl');

                if(order) {
                    await stripe?.checkout.sessions.expire(order?.stripeSessionUrl);
                    await order.remove();
                }
            }, expireTimeLengthMillis);

            res.status(200).send(JSON.stringify({
                url: session.url,
                username: res.locals.username,
                accesstoken: res.locals.accesstoken,
            }));
        }
    }
    catch(e){
        console.error(e);
        if(!res.headersSent) {
            res.sendStatus(500);
        }
    }
});

StripeRouter.post('/webhooks', (req, res) => {

    try{
        const sig = req.headers['stripe-signature'];
        const endpointSecret = process.env.STRIPE_WEBHOOK_SEC as string;

        let event: Stripe.Event | undefined = undefined;

        if(stripe && sig) {
            try{
                event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
            }
            catch(e) {
                res.status(400).send(`Webhook Error: ${e}`);
                return;
            }
        }
      
        if(event) {
            // Handle the event
            switch (event.type) {
                case 'checkout.session.completed':
                const checkoutSessionCompleted = event.data.object;
                console.log(checkoutSessionCompleted);
                // Then define and call a function to handle the event checkout.session.completed
                break;
                //... handle other event types
                default:
                console.log(`Unhandled event type ${event.type}`);
            }
        }
        res.sendStatus(200);
    }
    catch(e) {
        console.error(e);
        res.sendStatus(500);
    }
});

export default StripeRouter;