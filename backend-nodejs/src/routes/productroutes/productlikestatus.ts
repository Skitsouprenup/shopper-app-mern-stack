import { Request, Response } from 'express';
import LikeModel from '../../models/LikeModel.js';
import handleSession from '../verifysession.js';

export const likeProduct = async (req: Request, res: Response) => {
    await handleSession(req, res, "VERIFY");

    try{
        const productId: string = req.query?.productId as string;
        const userId: string = res.locals?.userId?.toString();


        if(productId && userId) {
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
                    res.status(200).json(
                        {
                            isLiked: false, 
                            likeCount: updatedLikeDocument.likeCount,
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
                    res.status(200).json(
                        {
                            isLiked: true,
                            likeCount: updatedLikeDocument.likeCount,
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
                    likeCount: 1,
                });
                newLikeDocument.isNew = true;
                const savedLikeDocument = await newLikeDocument.save();
                res.status(200).json(
                    {
                        isLiked: true,
                        likeCount: savedLikeDocument.likeCount,
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
    await handleSession(req, res, "VERIFY");

    try{
        const productId: string = req.query?.productId as string;
        const userId: string = res.locals?.userId?.toString();

        if(productId && userId) {
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
                res.status(200).json(
                    {
                        isLiked,
                        likeCount: product.likeCount
                    }
                );
            } else {
                res.status(200).json({
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