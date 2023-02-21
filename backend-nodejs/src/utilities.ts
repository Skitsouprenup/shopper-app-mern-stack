import { ProductSchema } from "./models/ProductModel.js";
import nodemailer from 'nodemailer';
import CryptoJS from "crypto-js";

export const productSortOptions = (sort: string | undefined) => {
    let option = {};

    if(sort) {
        switch(sort.toLowerCase()) {
            case 'newest':
                ProductSchema.index({createdAt: -1});
                option = { createdAt: -1 };
                break;

            case 'oldest':
                ProductSchema.index({createdAt: 1});
                option = { createdAt: 1 };
                break;

            case 'lowest price':
                ProductSchema.index({'currency.price': 1});
                option = { 'currency.price' : 1 };
                break;

            case 'highest price':
                ProductSchema.index({'currency.price': -1});
                option = { 'currency.price' : -1 };
                break;
        }
    }

    return option;
};

export const sendEmail = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.ADMIN_EMAIL,
          pass: CryptoJS.AES.decrypt(process.env.ADMIN_EMAIL_PASS as string, 
            process.env.PASSPHRASE as string).toString(CryptoJS.enc.Utf8),
        }
    });
}