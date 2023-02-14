import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import initConnection from './initConnection.js';
import UserRouter from './routes/userroutes/userrouter.js';
import AdminRouter from './routes/adminroutes/adminrouter.js';
import ProductRouter from './routes/productroutes/productrouter.js';
import OrderRouter from './routes/orderroutes/orderrouter.js';
import StripeRouter, { stripeInit } from './routes/stripe.js';
import { corsOptions } from './config/corsconfig.js';

dotenv.config();
const app = express();

const port = process.env.PORT || 4000;
initConnection();
stripeInit();

const prod = process.env.NODE_ENV === 'production';

const originsDev = [
    'http://localhost:3000', 
    'http://localhost:4000',
];

const originsProd = [
    process.env.FRONT_END_DOMAIN as string
];

//These middlewares will be evaluated during request
//from clients
app.use(cors(corsOptions(true, prod ? originsProd : originsDev)));
//app.use(cors());
//In stripe webhooks endpoint. We need to parse the body into a buffer.
//Other parsers below are going to be fallback parsers of this route.
app.use('/api/stripe/webhooks', express.raw({ type: "application/json" }));

app.use(express.json({type: 'application/json'}),
        express.text({type: 'text/plain'}));
app.use(cookieParser());
app.use('/api/users', UserRouter);
app.use('/api/admin', AdminRouter);
app.use('/api/products', ProductRouter);
app.use('/api/orders', OrderRouter);
app.use('/api/stripe', StripeRouter);

//This will be executed during server start
app.listen(port, () => {
    console.log('Server started at port ' + port);
});