import { randomBytes } from "crypto";
import express from "express";
import mongoose from "mongoose";
import Stripe from "stripe";
import OrderModel from "../models/OrderModel.js";
import ProductModel from "../models/ProductModel.js";
import { releaseOnHoldStocks } from "../queries/product/releaseOnHoldStocks.js";
import { updateStocks } from "../queries/product/updateStocks.js";
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
            await releaseOnHoldStocks(res, res.locals.userId, stripe);

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
                        $in: productIds
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

            const updateProducts = 
                updateStocks(res, productIds, queriedProducts, productsOrder, 'decrease');

            if(updateProducts?.length) {
                await ProductModel.collection.bulkWrite(updateProducts);
            }
            else {
                if(!res.headersSent) res.sendStatus(400);
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
                    orderId,
                }
            });

            //1 min order expiration time
            const expireTimeLengthMillis = 1000 * 180;
            //create new order
            const newOrder = new OrderModel({
                _id: new mongoose.Types.ObjectId(orderId),
                userId: res.locals.userId,
                products: productsOrder,
                total: new mongoose.Types.Decimal128
                        (items.total ? items.total : ''),
                stripeSessionId: session.id,
            });
            newOrder.isNew = true;
            await newOrder.save();

            //delete order if it's still pending after
            //the expiration time
            setTimeout(async () => {
                await releaseOnHoldStocks(res, res.locals.userId, stripe);
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

StripeRouter.post('/webhooks', async (req, res) => {

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
                    /*
                        I think the right type here is Stripe.Invoice.
                        For now, I'm gonna test Stripe.Checkout.Session.
                        event.data.object is too untyped and as the 
                        time making this app, stripe team still
                        doesn't put types in event.data.object.
                     */
                    const sessionObj = event.data.object as Stripe.Checkout.Session;
                    type metadataType = { orderId: string };
                    const metadata = sessionObj.metadata as metadataType;

                    let anomaly = false;
                    if(metadata?.orderId) {
                        const existingOrder = 
                            await OrderModel.findOne(
                                {
                                    _id : new mongoose.Types.ObjectId(metadata.orderId)
                                },
                                'status');
                        if(existingOrder) {
                            existingOrder.status = 'completed';
                            existingOrder.isNew = false;
                            await existingOrder.save();
                        } else anomaly = true;
                    } else {
                        console.error('orderId is missing! \n' +
                        'place orderId in the metadata during checkout creation!');
                        anomaly = true;
                    }
                    //There is one type of anomaly that can
                    //happen during checkout: mishandled transaction.
                    //
                    //A mishandled transaction can occur if an order
                    //is deleted however, checkout succeeds. ALthough,
                    //this is very unlikely to happen. 
                    //
                    //One scenario that I think of that this may happen
                    //is a situation where at the same time, a user 
                    //clicks the checkout button of cart section of
                    //our website and the checkout button of stripe
                    //checkout webpage.
                    //
                    //In this case, we set the order status to
                    //"anomaly" and admin will go to stripe 
                    //dashboard, check if the received session ID
                    //matches one of the payment in payment section
                    //and refund the payment.
                    //
                    //If orderId in metadata is missing or non-existent,
                    //That can cause an anomaly. Make sure orderId is
                    //placed in metadata before creating checkout session.
                    if(anomaly) {
                        const anomalyOrder = new OrderModel({
                            stripeSessionId: sessionObj?.id,
                            status: 'anomaly',
                        });
                        anomalyOrder.isNew = true;
                        await anomalyOrder.save();
                    }
                break;
                /*
                    //... handle other event types
                    default:
                    console.log(`Unhandled event type ${event.type}`);
                */
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