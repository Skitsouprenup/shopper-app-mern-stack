import { Request, Response } from 'express';
import LikeModel from '../../models/LikeModel.js';
import handleSession from '../verifysession.js';

export const likeProduct = async (req: Request, res: Response) => {
    await handleSession(req, res, "VERIFY");

    try{
        const username: string = res.locals?.username.toString();
        const accesstoken: string = res.locals?.accesstoken.toString();

        const productId: string = req.query?.productId as string;
        const userId: string = res.locals?.userId?.toString();
        const likecount: string = req.query?.likecount as string;


        if(productId && userId && username && accesstoken && likecount) {
            const likeDocument = await LikeModel.findOne({
                'product.$id': productId
            }, 'likedUsers likeCount');

            if(likeDocument) {
                const newLikedUsers : Array<string> = [];
                for(let x of likeDocument.likedUsers) {
                    if(x !== userId)
                        newLikedUsers.push(x);
                }

                /*
                    Toggle Like Status
                */

                //product is already liked.
                if(newLikedUsers.length !== likeDocument.likedUsers.length) {
                    likeDocument.likedUsers = [...newLikedUsers];
                    likeDocument.likeCount = likeDocument.likedUsers.length;
                    likeDocument.isNew = false;
                    const updatedLikeDocument = await likeDocument.save();
                    if(process.env.NODE_ENV === 'production') {
                        res.set({'Access-Control-Allow-Origin' : process.env.FRONT_END_DOMAIN});
                    }
                    res.status(200).json(
                        {
                            username,
                            accesstoken,
                            isLiked: false, 
                            likeCount: likecount && updatedLikeDocument.likeCount,
                        }
                    );
                }
                //product is not already liked
                else {
                    newLikedUsers.push(userId);
                    likeDocument.likedUsers = [...newLikedUsers];
                    likeDocument.likeCount = likeDocument.likedUsers.length;
                    likeDocument.isNew = false;
                    const updatedLikeDocument = await likeDocument.save();
                    if(process.env.NODE_ENV === 'production') {
                        res.set({'Access-Control-Allow-Origin' : process.env.FRONT_END_DOMAIN});
                    }
                    res.status(200).json(
                        {
                            username,
                            accesstoken,
                            isLiked: true,
                            likeCount: likecount && updatedLikeDocument.likeCount,
                        }
                    );
                }
            }
            //product doesn't have any likes.
            else {
                const newLikeDocument = new LikeModel({
                    product: {
                        $ref: 'products',
                        $id: productId,
                    },
                    likedUsers: [userId],
                    likeCount: likecount && 1,
                });
                newLikeDocument.isNew = true;
                const savedLikeDocument = await newLikeDocument.save();
                if(process.env.NODE_ENV === 'production') {
                    res.set({'Access-Control-Allow-Origin' : process.env.FRONT_END_DOMAIN});
                }
                res.status(200).json(
                    {
                        username,
                        accesstoken,
                        isLiked: true,
                        likeCount: likecount && savedLikeDocument.likeCount,
                    }
                );
            }
        } else {
            if(!res.headersSent)
                res.sendStatus(400);
        }
    }
    catch(e) {
        console.error(e);
        if(!res.headersSent)
            res.sendStatus(500);
    }
};

export const verifyLike = async (req: Request, res: Response) => {
    let verifiedUsername: string = '';
    let verifiedAccessToken: string = '';

    if(req.query?.username && req.query?.accesstoken) {
        await handleSession(req, res, "VERIFY");
        verifiedUsername = 
            res.locals?.username ? res.locals.username as string : '';
        verifiedAccessToken = 
            res.locals?.accesstoken ? res.locals?.accesstoken as string : '';
    }    

    try{
        const productId: string = req.query?.productId as string;
        const userId: string = res.locals?.userId?.toString();
        const likecount: string = req.query?.likecount as string;

        if(productId) {
            const product = await LikeModel.findOne({
                'product.$id': productId
            }, 'likedUsers likeCount');
    
            let isLiked = false;
            if(product) {
    
                for(let x of product.likedUsers) {
                    if(x === userId) {
                        isLiked = true;
                        break;
                    }
                }
                if(process.env.NODE_ENV === 'production') {
                    res.set({'Access-Control-Allow-Origin' : process.env.FRONT_END_DOMAIN});
                }
                res.status(200).json(
                    {
                        verifiedUsername,
                        verifiedAccessToken,
                        isLiked,
                        likeCount: likecount ? product.likeCount : 0,
                    }
                );
            } else {
                if(process.env.NODE_ENV === 'production') {
                    res.set({'Access-Control-Allow-Origin' : process.env.FRONT_END_DOMAIN});
                }
                res.status(200).json({
                        verifiedUsername,
                        verifiedAccessToken,
                        isLiked,
                        likeCount: 0,
                    }
                );
            }
        }else {
            if(!res.headersSent) 
                res.sendStatus(400);
        }
    }
    catch(e) {
        console.error(e);
        if(!res.headersSent)
            res.sendStatus(500);
    }
};