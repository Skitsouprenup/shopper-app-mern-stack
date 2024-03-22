import {Request, Response} from 'express';
import UserModel from '../../models/UserModel.js';
import CryptoJS from "crypto-js";
import { sendEmail } from '../../utilities.js';

export const retrievePass = async (req: Request, res: Response) => {

    const username : string = req.query?.username as string;

    try{
        if(username) {
            const user = await UserModel.findOne(
                {
                    username: username
                },'email password');

            if(user) {
                const emailBody = 
                "<p>Here's your password: <b>"+
                CryptoJS.AES.decrypt(user?.password as string, 
                    process.env.PASSPHRASE as string).toString(CryptoJS.enc.Utf8)
                +"</b></p>"+
                "<p>If you feel like your password is compromised."+
                "please go to the site and reset your password.</p>"

                const mailOptions = {
                from: process.env.ADMIN_EMAIL,
                to: user?.email,
                subject: 'Shopper Password Retrieval',
                html: emailBody,
                };
                  
                sendEmail().sendMail(mailOptions, function(error){
                    if (error) {
                        console.error(error);
                        res.status(500).send("Unexpected Error.");
                    } else {
                        res.status(200).
                        send("Password sent to "+user?.email);
                    }
                }); 
            } else res.status(400).send("Username is invalid!");
        }
        else {
            res.status(400).send("Username is missing!");
        }
    }
    catch(e) {
        console.error(e);
        if(!res.headersSent)
            res.status(500).send("Unexpected Error.");
    }

};