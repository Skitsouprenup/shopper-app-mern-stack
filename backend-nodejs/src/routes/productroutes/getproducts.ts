import util from 'util';
import {Request, Response} from "express";
import LikeModel from "../../models/LikeModel.js";

import ProductModel from "../../models/ProductModel.js";
import { productPageProjection } from "../../getproductsprojections.js";
import { productSortOptions } from "../../utilities.js";
import { checkIfCategoryLike, checkIfPopularLike } from '../../queries/product/checkprodlikestatus.js';
import handleSession from '../verifysession.js';
import { MinifiedProduct, MinifiedProductsPayload } from '../../types/producttypes.js';

export const getProductById = async (req: Request, res: Response) => {

    if(!req.params.id) {
        console.error('ID is undefined');
        res.sendStatus(500);
    }

    try{
        const product = await ProductModel.findById(req.params.id, {}, productPageProjection);

        if(process.env.NODE_ENV === 'production') {
            res.set({'Access-Control-Allow-Origin' : process.env.FRONT_END_DOMAIN});
        }
        res.status(200).json(product);
    }
    catch(err) {
        console.error(err);
        res.sendStatus(500);
    }
};

export const getProductByTitle = async (req: Request, res: Response) => {
    const titleQuery : string | undefined = req.params.title;

    if(!titleQuery) {
        console.error('Title is undefined');
        res.sendStatus(500);
    }

    try{
        const product = await 
            ProductModel.find(
                { 
                    /*
                        This regex pattern is good for searching
                        a keyword in any part of a title. However,
                        this may impact our app performance.

                        If searching becomes slower, better use
                        this pattern ^keyword.*

                        The pattern above, matches title starting
                        from the beginning of the title. This
                        is not equivalent to the current pattern.
                        However, this is much faster according
                        to mongodb docs.
                    */
                    title : { $regex: `[.]*${titleQuery}[.]*`}, 
                }, {}, productPageProjection);
        if(process.env.NODE_ENV === 'production') {
            res.set({'Access-Control-Allow-Origin' : process.env.FRONT_END_DOMAIN});
        }
        res.status(200).json(product);
    }
    catch(err) {
        console.error(err);
        res.sendStatus(500);
    }
}

export const getAllProducts = async (req: Request, res: Response) => {
    let userId = '';
    let accesstoken = '';
    const username = req.query?.username as string;

    try{
        //Verify logged in user if there's one.
        if(username) {
            await handleSession(req, res, 'VERIFY');
            userId = res.locals?.userId?.toString();
            accesstoken = res.locals?.accesstoken?.toString();
            if(!userId || !accesstoken) {
                if(!res.headersSent) {
                    res.sendStatus(400);
                    return;
                }
            }
    
            //The default value of res.statusCode
            //if not explicitly set is 200. If the
            //status code is not equal to 200 after
            //handleSession() method, it means that
            //There's a problem with user verification
            //process and we can't continue any further.
            if(res.statusCode !== 200) return;
        }

        const sort = req.query?.sort?.toString();
        const count: unknown = req.query?.count ? req.query.count : 5;
        const category = req.query?.category as string;
        const showPopular = req.query?.showPopular?.toString() === 'true' ? true : false;

        //Popular Products Search
        if(showPopular) {

            const popularProducts: Array<MinifiedProduct> = await LikeModel.aggregate([
                {
                    $addFields: {
                        fk: {$objectToArray: "$product"},
                        isLiked: userId ? checkIfPopularLike(userId) : null,
                    }
                },
                {
                    $lookup: {
                        from: 'products',
                        localField: 'fk.1.v',
                        foreignField: '_id',
                        pipeline: [{
                            $project: {
                                _id: 1,
                                title: 1,
                                imgPrimary: 1,
                            }
                        }],
                        as: 'products',
                    }
                },
                {
                    $project: {
                        _id: '$products._id',
                        title: '$products.title',
                        imgPrimary: '$products.imgPrimary',
                        isLiked: '$isLiked',
                    }
                },
                {
                    $limit: typeof count === 'number' ? count : 0
                },
                {
                    $sort: { likeCount: -1 }
                }
                
            ]) as Array<MinifiedProduct>;
            let payload : MinifiedProductsPayload | null = null;

            if(userId && username && accesstoken) {
                payload = {
                    products: popularProducts,
                    username,
                    accesstoken, 
                }
            }
            else {
                payload = {
                    products: popularProducts,
                }
            }

            //console.log(util.inspect(output, false, null, true));
            if(process.env.NODE_ENV === 'production') {
                res.set({'Access-Control-Allow-Origin' : process.env.FRONT_END_DOMAIN});
            }
            res.status(200).json(payload);
        }
        //Category search
        else {
            let products : Array<MinifiedProduct> | null = null;

            products = await ProductModel.aggregate([
                {
                    $match: {
                        categories: category.toLowerCase(),
                    }
                },
                {
                    $lookup: {
                        from: 'likes',
                        pipeline: [{
                            $project: {
                                _id: 0,
                                likedUsers: 1,
                                dbRefId: '$product.$id',
                            }
                        }],
                        as: 'likes'
                    }
                },
                {
                    $addFields: {
                        isLiked: userId ? checkIfCategoryLike(userId) : null,
                    }
                },
                {
                    $project: {
                        _id: 1,
                        title: 1,
                        imgPrimary: 1,
                        isLiked: 1,
                    }
                },
                {
                    $limit: typeof count === 'number' ? count : 0
                },
                {
                    $sort: productSortOptions(sort)
                }
            ]) as Array<MinifiedProduct>;
            let payload : MinifiedProductsPayload | null = null;

            if(userId && username && accesstoken) {
                payload = {
                    products,
                    username,
                    accesstoken, 
                }
            }
            else {
                payload = {
                    products,
                }
            }

            //console.log(util.inspect(products, false, null, true));
            if(process.env.NODE_ENV === 'production') {
                res.set({'Access-Control-Allow-Origin' : process.env.FRONT_END_DOMAIN});
            }
            res.status(200).json(payload);
        }
    }
    catch(err) {
        console.error(err);
        res.sendStatus(500);
    }
};