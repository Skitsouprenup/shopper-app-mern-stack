import {Request, Response} from "express";
import { randomBytes } from "crypto";

import UserModel from "../../models/UserModel.js";
import CryptoJS from "crypto-js";

import jwt from 'jsonwebtoken';

export const createUsers = async (req: Request, res: Response) => {

    interface requestFields {
        username: string,
        password: string,
        email: string,
        firstname: string,
        lastname: string,
        middlename: string,
    }

    try {

        const fields : requestFields = req.body as requestFields;
        if(!fields.username && !fields.password && !fields.email &&
           !fields.firstname && !fields.lastname && !fields.middlename) {
            res.status(400).json({msg: 'Sent credentials are incomplete!'});
            return;
        }

        //Verify User
        const user = await UserModel.findOne({
            username: fields.username
        }, 'username email');

        if(user?.email === fields.email) {
            res.status(400).json({msg: 'Email already exist!'});
            return;
        }

        if(user?.username === fields.username) {
            res.status(400).json({msg: 'Username already exist!'});
            return;
        }

        /*
            mongodb ObjectId requires a string of 12 bytes or a string
            of 24 hex characters or an integer
        */
        const userId = randomBytes(12).toString('hex');
        //create access token
        const accesstoken = jwt.sign({
            id: userId,
        },
        process.env.JWT_ACCESS_TKN_SECRET as string,
        { expiresIn: process.env.JWT_ACCESS_TKN_EXPIRE });
        //create refreshtoken
        const refreshtoken = jwt.sign({
            id: userId,
        },
        process.env.JWT_REFRESH_TKN_SECRET as string,
        { expiresIn: "1d" });

        const newUser = new UserModel({
            _id: userId,
            activeRefreshToken: refreshtoken,
            username: fields.username,
            email: fields.email,
            password: CryptoJS.AES.encrypt(fields.password, 
                    process.env.PASSPHRASE as string).toString(),
            firstname: fields.firstname,
            lastname: fields.lastname,
            middlename: fields.middlename,
            roles: process.env.USER_ROLE as string,
        });
        newUser.isNew = true;

        const savedUser = await newUser.save();

        if(savedUser === newUser) {
            res.status(201).
                cookie('jwt', 
                        JSON.stringify({refreshtoken}),
                        {
                            httpOnly: true, 
                            maxAge: 24*60*60*1000,
                            sameSite: "lax",
                        }).
                json({credentials: {
                    username: savedUser?.username,
                    accesstoken 
            }});
        } else res.sendStatus(500);

    }
    catch(e) {
        console.error(e);
        if(!res.headersSent)
            res.sendStatus(500);
    }
};